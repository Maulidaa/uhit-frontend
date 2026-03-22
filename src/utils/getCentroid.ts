export function getCentroid(feature: any) {
  const coords = feature.geometry.coordinates
  const type = feature.geometry.type

  const polygons = type === "Polygon" ? [coords] : coords

  // Pilih outer ring terbesar agar marker jatuh di pulau utama provinsi.
  const largestRing = polygons.reduce((currentLargest: number[][], polygon: number[][][]) => {
    const ring = polygon[0]
    return Math.abs(getSignedArea(ring)) > Math.abs(getSignedArea(currentLargest)) ? ring : currentLargest
  }, polygons[0][0])

  const [lat, lng] = getRingCentroid(largestRing)

  return [lat, lng]
}

function getSignedArea(ring: number[][]) {
  let area = 0

  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[(i + 1) % ring.length]
    area += x1 * y2 - x2 * y1
  }

  return area / 2
}

function getRingCentroid(ring: number[][]): [number, number] {
  let areaFactor = 0
  let centroidX = 0
  let centroidY = 0

  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i]
    const [x2, y2] = ring[(i + 1) % ring.length]
    const cross = x1 * y2 - x2 * y1

    areaFactor += cross
    centroidX += (x1 + x2) * cross
    centroidY += (y1 + y2) * cross
  }

  const area = areaFactor / 2

  if (Math.abs(area) < 1e-12) {
    let lat = 0
    let lng = 0

    ring.forEach(([x, y]) => {
      lng += x
      lat += y
    })

    return [lat / ring.length, lng / ring.length]
  }

  const x = centroidX / (6 * area)
  const y = centroidY / (6 * area)

  return [y, x]
}