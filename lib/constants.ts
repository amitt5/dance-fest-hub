// Dance styles supported by the platform
export const DANCE_STYLES = ["Bachata", "Salsa", "Kizomba", "Zouk"] as const

// List of countries where dance festivals are commonly held
export const COUNTRIES = [
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "Colombia",
  "Croatia",
  "Cuba",
  "Czech Republic",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Peru",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Romania",
  "Russia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Venezuela"
].sort() as unknown as readonly string[]

// Types derived from constants
export type DanceStyle = typeof DANCE_STYLES[number]
export type Country = typeof COUNTRIES[number] 