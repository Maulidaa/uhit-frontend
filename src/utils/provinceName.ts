/**
 * Province name normalization and resolution utility
 * Standardized format: CamelCase (JakartaRaya, SumateraBarat, etc.)
 */

export function normalizeProvinceKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, "") // Remove non-alphanumeric
}

/**
 * Aliases for common variations in province naming.
 * Maps normalized names to canonical GeoJSON names.
 */
const PROVINCE_ALIASES: Record<string, string> = {
  // Jakarta variations
  jakarta: "JakartaRaya",
  dkijakarta: "JakartaRaya",
  jakartaraya: "JakartaRaya",
  daerahkhususibukotajakarta: "JakartaRaya",

  // Yogyakarta variations
  yogyakarta: "Yogyakarta",
  diyogyakarta: "Yogyakarta",
  diogjakarta: "Yogyakarta",
  yogya: "Yogyakarta",

  // Bangka Belitung variations
  bangkabelitung: "BangkaBelitung",
  kepbangkabelitung: "BangkaBelitung",
  kepulauanbangkabelitung: "BangkaBelitung",
}

/**
 * Resolve province name by fuzzy matching.
 * Returns the canonical name from available provinces.
 */
export function resolveProvinceName(
  provinceName: string,
  availableProvinceNames: string[],
): string | null {
  const normalizedTarget = normalizeProvinceKey(provinceName)

  // Try exact normalization match first
  for (const candidate of availableProvinceNames) {
    if (normalizeProvinceKey(candidate) === normalizedTarget) {
      return candidate
    }
  }

  // Try alias mapping
  const aliased = PROVINCE_ALIASES[normalizedTarget]
  if (aliased && availableProvinceNames.includes(aliased)) {
    return aliased
  }

  return null
}
