export async function getAccessToken() {
  const clientId = import.meta.env.VITE_SENTINEL_CLIENT_ID
  const clientSecret = import.meta.env.VITE_SENTINEL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Missing Sentinel credentials. Set VITE_SENTINEL_CLIENT_ID and VITE_SENTINEL_CLIENT_SECRET.")
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  })

  const res = await fetch("https://services.sentinel-hub.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  })

  if (!res.ok) {
    const details = await res.text()
    throw new Error(`Failed to fetch Sentinel token (${res.status}): ${details}`)
  }

  const data = await res.json()
  if (!data?.access_token) {
    throw new Error("Sentinel token response did not contain access_token")
  }

  return data.access_token
}

export type SentinelImageryRequest = {
  geometry: any
  startDate: string
  endDate: string
  bands?: string[]
}

export type GreenCoverageResult = {
  greenPercent: number
  cloudCover: number
  timestamp: string
}

/**
 * Calculate NDVI (Normalized Difference Vegetation Index) from Red and NIR bands.
 * NDVI = (NIR - Red) / (NIR + Red)
 * Green pixels: NDVI > 0.4
 */
export function calculateNDVIGreenCoverage(
  redBand: number[][],
  nirBand: number[][],
): number {
  let greenPixels = 0
  let totalPixels = 0

  for (let y = 0; y < redBand.length; y++) {
    for (let x = 0; x < redBand[y].length; x++) {
      const red = redBand[y][x]
      const nir = nirBand[y][x]

      if (red + nir > 0) {
        const ndvi = (nir - red) / (nir + red)
        if (ndvi > 0.4) {
          greenPixels++
        }
        totalPixels++
      }
    }
  }

  return totalPixels > 0 ? (greenPixels / totalPixels) * 100 : 0
}

/**
 * Fetch Sentinel-2 composite imagery for a bounding box geometry.
 * Simplified version using Sentinel Hub OGC APIs.
 */
export async function fetchSentinel2GreenCoverage(
  bbox: [number, number, number, number], // [minLon, minLat, maxLon, maxLat]
  startDate: string,
  endDate: string,
  accessToken: string,
): Promise<GreenCoverageResult> {
  try {
    const width = 512
    const height = 512

    // Sentinel Hub WCS request for NDVI calculation
    const evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: ["B04", "B08", "CLM"],
          output: { bands: 3, sampleType: "FLOAT32" }
        };
      }
      function evaluatePixel(sample) {
        var ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
        return [ndvi, sample.CLM, 1];
      }
    `

    const payload = {
      input: {
        bounds: {
          bbox: bbox,
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: {
                from: startDate,
                to: endDate,
              },
              maxCloudCoverage: 50,
            },
          },
        ],
      },
      output: {
        width,
        height,
        responses: [
          {
            identifier: "default",
            format: { type: "image/tiff" },
          },
        ],
      },
      evalscript: evalscript,
    }

    const res = await fetch(
      "https://services.sentinel-hub.com/api/v1/process",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      const details = await res.text()
      throw new Error(`Sentinel fetch failed (${res.status}): ${details}`)
    }

    // Parse response to calculate green coverage
    // Simplified: assume response buffer contains NDVI values
    const buffer = await res.arrayBuffer()

    let greenCount = 0
    let totalCount = 0
    let cloudCover = 0

    try {
      // Skip TIFF header (8 bytes) and any IFD, start reading floats from offset
      const offset = Math.min(1024, buffer.byteLength - 3072) // Skip headers, ensure enough data
      const view = new Float32Array(buffer, offset, Math.floor((buffer.byteLength - offset) / 4))

      for (let i = 0; i < view.length; i += 3) {
        const ndvi = view[i] || 0
        const clm = view[i + 1] || 0
        totalCount++

        if (ndvi > 0.4) {
          greenCount++
        }
        if (clm > 0) {
          cloudCover++
        }
      }
    } catch (e) {
      console.warn("TIFF parse error, returning 0 green coverage")
      totalCount = 1
      greenCount = 0
    }

    const greenPercent =
      totalCount > 0 ? (greenCount / totalCount) * 100 : 0
    const cloudPercent =
      totalCount > 0 ? (cloudCover / totalCount) * 100 : 0

    return {
      greenPercent: Math.min(100, Math.max(0, greenPercent)),
      cloudCover: Math.min(100, Math.max(0, cloudPercent)),
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching Sentinel-2 coverage:", error)
    // Return fallback if API fails
    return {
      greenPercent: 0,
      cloudCover: 0,
      timestamp: new Date().toISOString(),
    }
  }
}