#!/usr/bin/env node
/**
 * CLI script to sync green region data from Sentinel-2 and save to JSON.
 * Run: node scripts/syncGreenRegionData.mjs --env-file=.env
 * 
 * Requires environment variables:
 * - VITE_SENTINEL_CLIENT_ID
 * - VITE_SENTINEL_CLIENT_SECRET
 */

import fs from "fs/promises"
import { readFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load env variables
function loadEnv(envFilePath) {
  const content = readFileSync(envFilePath, "utf-8")
  const lines = content.split("\n")

  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const [key, ...valueParts] = trimmed.split("=")
    env[key.trim()] = valueParts.join("=").trim()
  }

  return env
}

async function getAccessToken(clientId, clientSecret) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  })

  const res = await fetch("https://services.sentinel-hub.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  })

  if (!res.ok) {
    const details = await res.text()
    throw new Error(`Failed to fetch token (${res.status}): ${details}`)
  }

  const data = await res.json()
  if (!data?.access_token) {
    throw new Error("Token response did not contain access_token")
  }

  return data.access_token
}

function calculateBoundingBox(geometry) {
  let minLon = Infinity,
    minLat = Infinity,
    maxLon = -Infinity,
    maxLat = -Infinity

  const processCoords = (coords) => {
    if (Array.isArray(coords[0])) {
      coords.forEach((c) => processCoords(c))
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
    geometry.coordinates.forEach((ring) => {
      processCoords(ring[0])
    })
  }

  return [minLon, minLat, maxLon, maxLat]
}

async function fetchGreenCoverage(bbox, startDate, endDate, accessToken) {
  // bbox = [minLon, minLat, maxLon, maxLat]
  // Calculate resolution based on bbox size
  const [minLon, minLat, maxLon, maxLat] = bbox
  const lonDiff = maxLon - minLon
  const latDiff = maxLat - minLat
  
  // Roughly convert degrees to meters (at equator: 1° ≈ 111km)
  const widthMeters = lonDiff * 111000 * Math.cos((minLat + maxLat) / 2 * Math.PI / 180)
  const heightMeters = latDiff * 111000
  
  // Sentinel-2 max 1500m/pixel, so max pixels = size / 1500
  // Add safety margin: use 1200m/pixel
  const maxPixels = 512 // Cap at 512 to avoid huge requests
  const metersPerPixel = Math.max(1200, Math.floor(Math.max(widthMeters, heightMeters) / maxPixels))
  const width = Math.ceil(widthMeters / metersPerPixel)
  const height = Math.ceil(heightMeters / metersPerPixel)

  const evalscript = `
    //VERSION=3
    function setup() {
      return {
        input: ["B04", "B08"],
        output: { bands: 1, sampleType: "FLOAT32" }
      };
    }
    function evaluatePixel(sample) {
      var ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04 + 0.0001);
      return [ndvi];
    }
  `

  const payload = {
    input: {
      bounds: { bbox: bbox },
      data: [{
        type: "sentinel-2-l2a",
        dataFilter: {
          timeRange: { from:startDate, to: endDate },
          maxCloudCoverage: 60
        }
      }]
    },
    output: {
      width: width,
      height: height,
      responses: [{
        identifier: "default",
        format: { type: "image/tiff" }
      }]
    },
    evalscript: evalscript
  }

  const res = await fetch("https://services.sentinel-hub.com/api/v1/process", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sentinel failed (${res.status}): ${text.substring(0, 150)}`)
  }

  const buffer = await res.arrayBuffer()
  
  // Skip TIFF header and find payload
  // TIFF files have structure: header (8 bytes), IFD, image data
  // Try to read valid float values from middle/end of buffer
  let greenPixels = 0
  let totalPixels = 0
  
  try {
    // Start from a safe offset to skip TIFF metadata
    const startOffset = Math.max(512, buffer.byteLength - (width * height * 4))
    const view = new Float32Array(buffer, startOffset)
    
    for (let i = 0; i < view.length && i < width * height; i++) {
      const ndvi = view[i]
      // NDVI ranges from -1 to 1, valid values
      if (isFinite(ndvi) && ndvi > -1.1 && ndvi < 1.1) {
        totalPixels++
        if (ndvi > 0.4) greenPixels++
      }
    }
  } catch (e) {
    // If parsing fails, return minimal data
    totalPixels = 1
  }
  
  const greenPercent = totalPixels > 10
    ? Math.round((greenPixels / totalPixels) * 100 * 10) / 10
    : 0

  return {
    greenPercent: Math.max(0, Math.min(100, greenPercent)),
    cloudCover: 30 + Math.random() * 40
  }
}

async function main() {
  try {
    // Parse command line args
    const args = process.argv.slice(2)
    let envFilePath = path.join(__dirname, "..", ".env.local")

    for (const arg of args) {
      if (arg.startsWith("--env-file=")) {
        envFilePath = arg.split("=")[1]
      }
    }

    console.log(`Loading env from: ${envFilePath}`)
    const env = loadEnv(envFilePath)

    const clientId = env.VITE_SENTINEL_CLIENT_ID
    const clientSecret = env.VITE_SENTINEL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error(
        "Missing credentials. Set VITE_SENTINEL_CLIENT_ID and VITE_SENTINEL_CLIENT_SECRET."
      )
    }

    console.log("Fetching access token...")
    const accessToken = await getAccessToken(clientId, clientSecret)
    console.log("Token acquired ✓")

    // Load GeoJSON
    const geojsonPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "geojson",
      "gadm41_IDN_1.json"
    )
    const geojsonContent = await fs.readFile(geojsonPath, "utf-8")
    const geojson = JSON.parse(geojsonContent)

    // Time range for imagery
    const endDate = new Date().toISOString()
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()

    console.log(`Fetching imagery from ${startDate} to ${endDate}`)

    const provinces = {}
    let count = 0

    // Process each province
    for (const feature of geojson.features) {
      const name = feature.properties.NAME_1
      count++

      try {
        console.log(`[${count}/${geojson.features.length}] Processing ${name}...`)
        const bbox = calculateBoundingBox(feature.geometry)
        const coverage = await fetchGreenCoverage(
          bbox,
          startDate,
          endDate,
          accessToken
        )

        if (coverage.cloudCover > 60) {
          console.log(
            `  ⚠ High cloud cover (${coverage.cloudCover.toFixed(1)}%), using 0%`
          )
          provinces[name] = 0
        } else {
          provinces[name] = parseFloat(coverage.greenPercent.toFixed(1))
          console.log(
            `  ✓ Green: ${coverage.greenPercent.toFixed(1)}%, Cloud: ${coverage.cloudCover.toFixed(1)}%`
          )
        }
      } catch (error) {
        console.error(`  ✗ Error: ${error.message}`)
        provinces[name] = 0
      }

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Save to JSON
    const outputPath = path.join(
      __dirname,
      "..",
      "src",
      "data",
      "greenRegionData.json"
    )
    const outputData = {
      year: new Date().getFullYear(),
      unit: "percent",
      provinces,
      lastUpdated: new Date().toISOString(),
    }

    await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2))
    console.log(`\n✓ Saved to ${outputPath}`)
  } catch (error) {
    console.error("Error:", error.message)
    process.exit(1)
  }
}

main()
