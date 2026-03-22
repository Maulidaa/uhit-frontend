import { getAccessToken, fetchSentinel2GreenCoverage } from "./sentinelApi"
import indonesia1 from "../data/geojson/gadm41_IDN_1.json"

export type ProvinceGreenData = {
  [provinceName: string]: number // percentage
}

export type GreenRegionSync = {
  year: number
  unit: string
  provinces: ProvinceGreenData
  lastUpdated: string
}

/**
 * Calculate bounding box from GeoJSON geometry.
 * Returns [minLon, minLat, maxLon, maxLat]
 */
function calculateBoundingBox(geometry: any): [number, number, number, number] {
  let minLon = Infinity
  let minLat = Infinity
  let maxLon = -Infinity
  let maxLat = -Infinity

  const processCoords = (coords: any): void => {
    if (Array.isArray(coords[0])) {
      coords.forEach((c: any) => processCoords(c))
    } else {
      const [lon, lat] = coords
      minLon = Math.min(minLon, lon)
      minLat = Math.min(minLat, lat)
      maxLon = Math.max(maxLon, lon)
      maxLat = Math.max(maxLat, lat)
    }
  }

  if (geometry.type === "Polygon") {
    processCoords(geometry.coordinates[0])
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((ring: any) => {
      processCoords(ring[0])
    })
  }

  return [minLon, minLat, maxLon, maxLat]
}

/**
 * Fetch green region data from Sentinel-2 for all provinces.
 * This is computationally intensive and should be called infrequently (e.g., weekly).
 */
export async function syncGreenRegionDataFromSentinel(): Promise<GreenRegionSync> {
  try {
    const accessToken = await getAccessToken()
    const endDate = new Date().toISOString()
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()

    const provinces: ProvinceGreenData = {}

    // Process each province
    for (const feature of (indonesia1 as any).features) {
      const provinceName = feature.properties.NAME_1
      const bbox = calculateBoundingBox(feature.geometry)

      try {
        const result = await fetchSentinel2GreenCoverage(
          bbox,
          startDate,
          endDate,
          accessToken
        )

        // Skip if cloud cover too high
        if (result.cloudCover > 60) {
          console.warn(`${provinceName}: High cloud cover (${result.cloudCover}%), skipping`)
          provinces[provinceName] = 0
        } else {
          provinces[provinceName] = parseFloat(result.greenPercent.toFixed(1))
        }
      } catch (error) {
        console.error(`Error processing ${provinceName}:`, error)
        provinces[provinceName] = 0
      }

      // Rate limiting: wait 500ms between requests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return {
      year: new Date().getFullYear(),
      unit: "percent",
      provinces,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Failed to sync green region data:", error)
    throw error
  }
}

/**
 * Save synced green region data to JSON file.
 * NOTE: This runs server-side only (Node.js environment).
 * Client cannot write files directly.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveGreenRegionDataToFile(
  _data: GreenRegionSync,
  _filePath: string
): Promise<void> {
  // This function should be implemented server-side
  // Example (Node.js):
  // const fs = await import('fs/promises')
  // await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  throw new Error(
    "saveGreenRegionDataToFile must be implemented server-side (Node.js/Deno)"
  )
}
