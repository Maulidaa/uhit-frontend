/**
 * Generic province data resolver
 * Handles both static JSON data sources with consistent error handling
 */

import { resolveProvinceName } from "../utils/provinceName"

export type DataResolver<T = number> = {
  data: Record<string, T>
  transform?: (value: T) => number | null
}

/**
 * Resolve province data safely
 * @param provinceName - Input province name (any format)
 * @param resolver - Data mapping and optional transformer
 * @returns Resolved value or null if not found
 */
export function resolveProvinceData<T = number>(
  provinceName: string,
  resolver: DataResolver<T>,
): T | null {
  const resolvedName = resolveProvinceName(provinceName, Object.keys(resolver.data))
  return resolvedName ? (resolver.data[resolvedName] ?? null) : null
}

/**
 * Get numeric value from province data
 * @param provinceName - Input province name (any format)
 * @param resolver - Data mapping and optional transformer
 * @returns Numeric value or null if not found
 */
export function getProvinceNumericValue(
  provinceName: string,
  resolver: DataResolver<number>,
): number | null {
  const value = resolveProvinceData(provinceName, resolver)
  if (value == null) return null
  return resolver.transform ? resolver.transform(value) : (value as number)
}

/**
 * Get all province names from data source
 */
export function getAvailableProvinces(data: Record<string, any>): string[] {
  return Object.keys(data)
}

/**
 * Calculate aggregate from all provinces
 */
export function getAggregateValue(
  data: Record<string, number>,
  transformer?: (value: number) => number,
): number {
  return Object.values(data).reduce((sum, val) => {
    const transformed = transformer ? transformer(val) : val
    return sum + (typeof transformed === "number" ? transformed : 0)
  }, 0)
}
