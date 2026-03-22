export type AQIData = {
  aqi: number | null
  pm25: number | null
}

export async function getAQI(lat: number, lon: number): Promise<AQIData> {
  try {
    const API_KEY = "a289a14ee22db6acae452538ff8f3926"

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    )

    const data = await res.json()
    const aqi = data?.list?.[0]?.main?.aqi
    const pm25 = data?.list?.[0]?.components?.pm2_5

    return {
      aqi: typeof aqi === "number" ? aqi : null,
      pm25: typeof pm25 === "number" ? pm25 : null,
    }

  } catch (err) {
    console.log("AQI error:", err)
    return { aqi: null, pm25: null }
  }
}