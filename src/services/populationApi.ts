import populationDataRaw from "../data/populationData.json"
import {
  getProvinceNumericValue,
  getAvailableProvinces,
  getAggregateValue,
} from "./dataResolver"

export type PopulationData = {
  population: number | null
}

const populationData = (populationDataRaw as any).provinces as Record<string, number>

/**
 * Get population for a province
 * Data is stored in thousands, returns actual count
 */
export async function getPopulation(
  provinceName: string,
): Promise<PopulationData> {
  const population = getProvinceNumericValue(provinceName, {
    data: populationData,
    transform: (val) => val * 1000, // Convert from thousands
  })

  return { population }
}

/**
 * Get total Indonesia population
 */
export function getTotalIndonesiaPopulation(): number {
  return getAggregateValue(populationData, (val) => val * 1000)
}

/**
 * Get top N provinces by population
 */
export function getTopProvincesByPopulation(limit = 10) {
  return Object.entries(populationData)
    .map(([name, population]) => ({
      name,
      population: (population as number) * 1000, // Convert from thousands
    }))
    .sort((a, b) => b.population - a.population)
    .slice(0, limit)
}

/**
 * Get all available provinces in population dataset
 */
export function getAvailablePopulationProvinces(): string[] {
  return getAvailableProvinces(populationData)
}
