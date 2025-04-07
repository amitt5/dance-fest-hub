import type { Festival } from "./types"

// Mock data for festivals
const festivals: Festival[] = [
  {
    id: "1",
    name: "Barcelona Bachata Festival",
    startDate: "2023-07-20",
    endDate: "2023-07-23",
    city: "Barcelona",
    country: "Spain",
    description:
      "Join us for a weekend of bachata dancing with international artists and DJs. Workshops, performances, and social dancing all weekend long.",
    styles: ["Bachata", "Salsa"],
    artists: ["DJ Mambo", "Maria & Carlos", "Bachata Sensual Team"],
    image: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/barcelona-bachata",
    facebookPage: "https://facebook.com/barcelonabachata",
    instagramPage: "https://instagram.com/bcnbachata",
    rating: 4.8,
    attendeeCount: 124,
  },
  {
    id: "2",
    name: "Miami Salsa Congress",
    startDate: "2023-08-15",
    endDate: "2023-08-20",
    city: "Miami",
    country: "USA",
    description:
      "The biggest salsa event in Miami featuring workshops, performances, and parties with the best salsa artists from around the world.",
    styles: ["Salsa", "Bachata"],
    artists: ["Salsa Kings", "DJ Mambo", "Latin Vibes Crew"],
    image: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/miami-salsa",
    facebookPage: "https://facebook.com/miamisalsa",
    rating: 4.5,
    attendeeCount: 256,
  },
  {
    id: "3",
    name: "Paris Kizomba Festival",
    startDate: "2023-09-10",
    endDate: "2023-09-12",
    city: "Paris",
    country: "France",
    description: "Experience the best of kizomba dancing in the heart of Paris with international instructors and DJs.",
    styles: ["Kizomba", "Semba"],
    artists: ["Kizomba Fusion", "DJ Kizz", "Semba Masters"],
    image: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/paris-kizomba",
    instagramPage: "https://instagram.com/pariskizomba",
    rating: 4.2,
    attendeeCount: 89,
  },
  {
    id: "4",
    name: "Berlin Zouk Congress",
    startDate: "2023-10-05",
    endDate: "2023-10-08",
    city: "Berlin",
    country: "Germany",
    description:
      "A weekend dedicated to Brazilian Zouk with workshops, shows, and parties featuring international zouk artists.",
    styles: ["Zouk"],
    artists: ["Zouk Masters", "DJ Rio", "Brazilian Zouk Team"],
    image: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/berlin-zouk",
    facebookPage: "https://facebook.com/berlinzouk",
    instagramPage: "https://instagram.com/berlinzouk",
    rating: 4.6,
    attendeeCount: 178,
  },
  {
    id: "5",
    name: "Cancun Bachata Festival",
    startDate: "2023-11-15",
    endDate: "2023-11-20",
    city: "Cancun",
    country: "Mexico",
    description: "Dance bachata on the beautiful beaches of Cancun with top international instructors and DJs.",
    styles: ["Bachata", "Salsa"],
    artists: ["Bachata Passion", "DJ Latino", "Maria & Carlos"],
    image: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/cancun-bachata",
    rating: 4.9,
    attendeeCount: 210,
  },
  {
    id: "6",
    name: "Toronto Salsa Weekend",
    startDate: "2023-12-01",
    endDate: "2023-12-03",
    city: "Toronto",
    country: "Canada",
    description: "A weekend of salsa dancing in downtown Toronto with workshops, social dancing, and performances.",
    styles: ["Salsa", "Bachata"],
    artists: ["Salsa Kings", "DJ Toronto", "Latin Vibes Crew"],
    image: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/toronto-salsa",
    facebookPage: "https://facebook.com/torontosalsa",
    rating: 4.3,
    attendeeCount: 67,
  },
]

// Function to get all festivals
export async function getFestivals(): Promise<Festival[]> {
  // In a real app, this would fetch from an API or database
  return festivals
}

// Function to get a festival by ID
export async function getFestivalById(id: string): Promise<Festival | undefined> {
  // In a real app, this would fetch from an API or database
  return festivals.find((festival) => festival.id === id)
}

