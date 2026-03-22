import greenRegionDataRaw from "../data/greenRegionData.json"
import { getProvinceNumericValue, getAvailableProvinces } from "./dataResolver"

export type GreenRegionData = {
  greenPercent: number | null
  status: "LOW" | "MEDIUM" | "HIGH" | null
}

const provinceGreenData = (greenRegionDataRaw as any).provinces as Record<string, number>

/**
 * Convert green percentage to status category
 */
function toStatus(value: number | null): GreenRegionData["status"] {
  if (value == null) return null
  if (value >= 60) return "HIGH"
  if (value >= 30) return "MEDIUM"
  return "LOW"
}

/**
 * Get green region data for a province
 * Supports fuzzy matching via resolveProvinceName
 */
export async function getGreenRegionData(
  provinceName: string,
): Promise<GreenRegionData> {
  const greenPercent = getProvinceNumericValue(provinceName, {
    data: provinceGreenData,
  })

  return {
    greenPercent,
    status: toStatus(greenPercent),
  }
}

/**
 * Get all available provinces in green region dataset
 */
export function getAvailableGreenProvinces(): string[] {
  return getAvailableProvinces(provinceGreenData)
}
