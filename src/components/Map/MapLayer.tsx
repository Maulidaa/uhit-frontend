import { Marker, useMapEvents } from "react-leaflet"
import indonesia1 from "../../data/geojson/gadm41_IDN_1.json"
import indonesia2 from "../../data/geojson/gadm41_IDN_2.json"
import { useCallback, useEffect, useRef, useState } from "react"
import { getCentroid } from "../../utils/getCentroid"
import { getTemperature } from "../../services/weatherApi"
import { getAQI } from "../../services/aqiApi"
import { getPopulation } from "../../services/populationApi"
import { getGreenRegionData } from "../../services/greenRegionApi"
import { divIcon, type LatLngBounds, type Map as LeafletMap } from "leaflet"
import { calculateUHI } from "../../utils/calculateUHI"
import "./MapLayer.css"

const IDN2_ZOOM_THRESHOLD = 7

type RegionPin = {
 id: string
 name: string
 province: string
 lat: number
 lon: number
 temp: number | null
 aqi: number | null
 pm25: number | null
 population: number | null
 greenPercent: number | null
 greenStatus: "LOW" | "MEDIUM" | "HIGH" | null
 level: "IDN_1" | "IDN_2"
}

export type RegionPinDetail = RegionPin

type ViewportTrackingInfo = {
 zoom: number
 dominantProvince: string
 focusRegion: string
 visibleCount: number
 center: {
  lat: number
  lon: number
 }
}

function MapViewportWatcher({ onChange }: { onChange: (map: LeafletMap) => void }) {
 const map = useMapEvents({
  zoomend: () => onChange(map),
  moveend: () => onChange(map),
 })

 useEffect(() => {
  onChange(map)
 }, [map, onChange])

 return null
}

function prepareRegionPoints() {
 return (indonesia2 as any).features
  .map((feature: any): RegionPin | null => {
   const [lat, lon] = getCentroid(feature)

   if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null
   }

   return {
    id: feature.properties.GID_2 ?? `${feature.properties.NAME_1}-${feature.properties.NAME_2}`,
    name: feature.properties.NAME_2 ?? feature.properties.NAME_1,
    province: feature.properties.NAME_1 ?? "Unknown",
    lat,
    lon,
    temp: null,
    aqi: null,
    pm25: null,
    population: null,
    greenPercent: null,
    greenStatus: null,
    level: "IDN_2",
   }
  })
  .filter((item: RegionPin | null): item is RegionPin => item !== null)
}

function prepareProvincePoints() {
 return (indonesia1 as any).features
  .map((feature: any): RegionPin | null => {
   const [lat, lon] = getCentroid(feature)

   if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null
   }

   return {
    id: feature.properties.GID_1 ?? feature.properties.NAME_1,
    name: feature.properties.NAME_1,
    province: feature.properties.NAME_1,
    lat,
    lon,
    temp: null,
    aqi: null,
    pm25: null,
    population: null,
    greenPercent: null,
    greenStatus: null,
    level: "IDN_1",
   }
  })
  .filter((item: RegionPin | null): item is RegionPin => item !== null)
}

function getDominantProvince(points: RegionPin[]) {
 const counter = new Map<string, number>()

 points.forEach((point) => {
  counter.set(point.province, (counter.get(point.province) ?? 0) + 1)
 })

 let dominantProvince = "Unknown"
 let maxCount = 0

 counter.forEach((count, province) => {
  if (count > maxCount) {
   maxCount = count
   dominantProvince = province
  }
 })

 return dominantProvince
}

function getNearestRegion(points: RegionPin[], lat: number, lon: number): RegionPin | null {
 let nearest: RegionPin | null = null
 let nearestDistance = Number.POSITIVE_INFINITY

 points.forEach((point) => {
  const dx = point.lon - lon
  const dy = point.lat - lat
  const distance = dx * dx + dy * dy

  if (distance < nearestDistance) {
   nearestDistance = distance
   nearest = point
  }
 })

 return nearest
}

function getViewportTrackingInfo(bounds: LatLngBounds, zoom: number, allRegions: RegionPin[]) {
 const center = bounds.getCenter()
 const visible = allRegions.filter((point) => bounds.contains([point.lat, point.lon]))
 if (visible.length === 0) {
  return null
 }

 const dominantProvince = getDominantProvince(visible)
 const nearest = getNearestRegion(visible, center.lat, center.lng)

 return {
  zoom,
  dominantProvince,
  focusRegion: nearest?.name ?? "Unknown",
  visibleCount: visible.length,
  center: {
   lat: center.lat,
   lon: center.lng,
  },
 } satisfies ViewportTrackingInfo
}

function filterVisibleRegions(
 points: RegionPin[],
 bounds: LatLngBounds,
 limit = 90,
 gridSize = 0.08,
) {
 const visible = points.filter((point) => bounds.contains([point.lat, point.lon]))
 const occupiedCells = new Set<string>()
 const result: RegionPin[] = []

 for (const point of visible) {
  const cellKey = `${Math.floor(point.lat / gridSize)}:${Math.floor(point.lon / gridSize)}`
  if (occupiedCells.has(cellKey)) continue

  occupiedCells.add(cellKey)
  result.push(point)

  if (result.length >= limit) break
 }

 return result
}

function getTempClass(temp: number | null) {
 if (temp == null) return "temp-na"

 const level = calculateUHI(temp)
 if (level === "HIGH") return "temp-high"
 if (level === "MEDIUM") return "temp-medium"
 return "temp-low"
}

function formatMarkerText(temp: number | null) {
 if (temp == null) return "N/A"
 return `${temp.toFixed(1)}C`
}

function buildTempIcon(temp: number | null) {
 const tempClass = getTempClass(temp)
 const text = formatMarkerText(temp)

 return divIcon({
  className: "temp-marker-wrapper",
  html: `<div class="temp-marker temp-full ${tempClass}">${text}</div>`,
  iconSize: [60, 28],
  iconAnchor: [30, 14],
  popupAnchor: [0, -16],
 })
}

async function fetchMissingWithConcurrency(
 points: RegionPin[],
 concurrency = 4,
) {
 const updated = [...points]
 let currentIndex = 0

 async function worker() {
  while (currentIndex < points.length) {
    const index = currentIndex++
    const point = points[index]

     const [temp, aqiData, populationData, greenData] = await Promise.all([
      getTemperature(point.lat, point.lon),
      getAQI(point.lat, point.lon),
      point.level === "IDN_1" ? getPopulation(point.province) : Promise.resolve({ population: null }),
          point.level === "IDN_1"
          ? getGreenRegionData(point.province)
          : Promise.resolve({ greenPercent: null, status: null }),
     ])
   updated[index] = {
    ...point,
    temp,
    aqi: aqiData.aqi,
    pm25: aqiData.pm25,
    population: populationData.population,
     greenPercent: greenData.greenPercent,
     greenStatus: greenData.status,
   }
  }
 }

 const workers = Array.from({ length: Math.min(concurrency, points.length) }, () => worker())
 await Promise.all(workers)

 return updated
}

export default function MapLayer({
 onSelectPin,
}: {
 onSelectPin: (pin: RegionPinDetail) => void
}){

 const [pins, setPins] = useState<RegionPin[]>([])
 const [bounds, setBounds] = useState<LatLngBounds | null>(null)
 const [zoom, setZoom] = useState(5)
 const provincePointsRef = useRef<RegionPin[]>([])
 const allRegionsRef = useRef<RegionPin[]>([])
 const localTempCacheRef = useRef<Map<string, number | null>>(new Map())
 const localAqiCacheRef = useRef<Map<string, number | null>>(new Map())
 const localPm25CacheRef = useRef<Map<string, number | null>>(new Map())
 const localPopulationCacheRef = useRef<Map<string, number | null>>(new Map())
 const localGreenPercentCacheRef = useRef<Map<string, number | null>>(new Map())
 const localGreenStatusCacheRef = useRef<Map<string, "LOW" | "MEDIUM" | "HIGH" | null>>(new Map())
 const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
 const lastTrackingSignatureRef = useRef("")

 const handleMapChange = useCallback((map: LeafletMap) => {
  const nextBounds = map.getBounds()
  const nextZoom = map.getZoom()
  setBounds(nextBounds)
  setZoom(nextZoom)

  const source = nextZoom >= IDN2_ZOOM_THRESHOLD ? allRegionsRef.current : provincePointsRef.current

  const tracking = getViewportTrackingInfo(nextBounds, nextZoom, source)
  if (!tracking) return

  const roundedZoom = Math.round(tracking.zoom * 4) / 4
  const signature = `${roundedZoom}|${tracking.dominantProvince}|${tracking.focusRegion}`

  if (signature === lastTrackingSignatureRef.current) {
   return
  }

  lastTrackingSignatureRef.current = signature

  console.info(
   `[MapTracker] zoom=${roundedZoom.toFixed(2)} area=${tracking.dominantProvince} focus=${tracking.focusRegion} visible=${tracking.visibleCount}`,
   tracking,
  )

  window.dispatchEvent(new CustomEvent("map:zoom-area-change", { detail: tracking }))
 }, [])

 useEffect(() => {
  provincePointsRef.current = prepareProvincePoints()
  allRegionsRef.current = prepareRegionPoints()
 }, [])

 useEffect(()=>{
  if (!bounds) return

  let cancelled = false
  const currentBounds = bounds

  async function fetchAll(){
   const useIdn2 = zoom >= IDN2_ZOOM_THRESHOLD
   const source = useIdn2 ? allRegionsRef.current : provincePointsRef.current
   const visibleRegions = filterVisibleRegions(
    source,
    currentBounds,
    useIdn2 ? 90 : 34,
    useIdn2 ? 0.08 : 0.35,
   )

   const seeded = visibleRegions.map((region) => ({
    ...region,
    temp: localTempCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
    aqi: localAqiCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
    pm25: localPm25CacheRef.current.get(`${region.level}:${region.id}`) ?? null,
    population: localPopulationCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
      greenPercent: localGreenPercentCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
      greenStatus: localGreenStatusCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
   }))

   setPins(seeded)

   const missing = visibleRegions.filter(
    (region) => !localTempCacheRef.current.has(`${region.level}:${region.id}`),
   )
   if (missing.length === 0) return

   const batch = missing.slice(0, useIdn2 ? 45 : 20)
   const fetched = await fetchMissingWithConcurrency(batch, 3)

   fetched.forEach((region) => {
    localTempCacheRef.current.set(`${region.level}:${region.id}`, region.temp)
    localAqiCacheRef.current.set(`${region.level}:${region.id}`, region.aqi)
    localPm25CacheRef.current.set(`${region.level}:${region.id}`, region.pm25)
    localPopulationCacheRef.current.set(`${region.level}:${region.id}`, region.population)
      localGreenPercentCacheRef.current.set(`${region.level}:${region.id}`, region.greenPercent)
      localGreenStatusCacheRef.current.set(`${region.level}:${region.id}`, region.greenStatus)
   })

   const updated = visibleRegions.map((region) => ({
    ...region,
    temp: localTempCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
    aqi: localAqiCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
    pm25: localPm25CacheRef.current.get(`${region.level}:${region.id}`) ?? null,
    population: localPopulationCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
      greenPercent: localGreenPercentCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
      greenStatus: localGreenStatusCacheRef.current.get(`${region.level}:${region.id}`) ?? null,
   }))

   if (!cancelled) {
    setPins(updated)
   }

  }

  if (debounceRef.current) clearTimeout(debounceRef.current)
  debounceRef.current = setTimeout(() => {
   fetchAll()
  }, 140)

  return () => {
   cancelled = true
   if (debounceRef.current) {
    clearTimeout(debounceRef.current)
    debounceRef.current = null
   }
  }

 },[bounds, zoom])

 return (
  <>
   <MapViewportWatcher onChange={handleMapChange} />
  {pins.filter((pin) => pin.temp != null).map((pin) => (
    <Marker
     key={pin.id}
     position={[pin.lat, pin.lon]}
     icon={buildTempIcon(pin.temp)}
     eventHandlers={{
      click: () => {
       onSelectPin(pin)
      },
     }}
    />
   ))}
  </>
 )
}