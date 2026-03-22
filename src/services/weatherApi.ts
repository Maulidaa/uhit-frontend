const CACHE_TTL_MS = 10 * 60 * 1000
const GRID_STEP = 0.2

type CacheEntry = {
 temp: number | null
 expiresAt: number
}

const temperatureCache = new Map<string, CacheEntry>()
const inFlightRequests = new Map<string, Promise<number | null>>()

function normalizeCoord(value: number) {
 return Math.round(value / GRID_STEP) * GRID_STEP
}

function buildKey(lat: number, lon: number) {
 const nLat = normalizeCoord(lat)
 const nLon = normalizeCoord(lon)
 return `${nLat.toFixed(3)},${nLon.toFixed(3)}`
}

async function fetchTemperature(lat: number, lon: number) {
 try {
  const res = await fetch(
   `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
  )

  if (!res.ok) {
   return null
  }

  const data = await res.json()
  return data?.current?.temperature_2m ?? null
 } catch {
  return null
 }
}

export async function getTemperature(lat:number, lon:number){
 const key = buildKey(lat, lon)
 const now = Date.now()
 const cached = temperatureCache.get(key)

 if (cached && cached.expiresAt > now) {
  return cached.temp
 }

 const running = inFlightRequests.get(key)
 if (running) {
  return running
 }

 const nLat = normalizeCoord(lat)
 const nLon = normalizeCoord(lon)

 const request = fetchTemperature(nLat, nLon).then((temp) => {
  temperatureCache.set(key, {
   temp,
   expiresAt: Date.now() + CACHE_TTL_MS,
  })

  inFlightRequests.delete(key)
  return temp
 })

 inFlightRequests.set(key, request)
 return request
}