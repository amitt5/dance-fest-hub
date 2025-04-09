import type { Event } from "./types"

// Mock data for festivals
const festivals: Event[] = [
  {
    id: "1",
    name: "Barcelona Bachata Festival",
    start_date: "2023-07-20",
    end_date: "2023-07-23",
    city: "Barcelona",
    country: "Spain",
    description:
      "Join us for a weekend of bachata dancing with international artists and DJs. Workshops, performances, and social dancing all weekend long.",
    event_styles: [{ style: "Bachata" }, { style: "Salsa" }],
    event_artists: [{ artist: { id: "1", name: "DJ Mambo" } }, { artist: { id: "2", name: "Maria & Carlos" } }, { artist: { id: "3", name: "Bachata Sensual Team" } }],
    poster_url: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/barcelona-bachata",
    facebook_link: "https://facebook.com/barcelonabachata",
    instagram_link: "https://instagram.com/bcnbachata",
    created_at: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Miami Salsa Congress",
    start_date: "2023-08-15",
    end_date: "2023-08-20",
    city: "Miami",
    country: "USA",
    description:
      "The biggest salsa event in Miami featuring workshops, performances, and parties with the best salsa artists from around the world.",
    event_styles: [{ style: "Salsa" }, { style: "Bachata" }],
    event_artists: [{ artist: { id: "1", name: "Salsa Kings" } }, { artist: { id: "2", name: "DJ Mambo" } }, { artist: { id: "3", name: "Latin Vibes Crew" } }],
    poster_url: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/miami-salsa",
    facebook_link: "https://facebook.com/miamisalsa",
    created_at: "2023-02-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Paris Kizomba Festival",
    start_date: "2023-09-10",
    end_date: "2023-09-12",
    city: "Paris",
    country: "France",
    description: "Experience the best of kizomba dancing in the heart of Paris with international instructors and DJs.",
    event_styles: [{ style: "Kizomba" }, { style: "Semba" }],
    event_artists: [{ artist: { id: "1", name: "Kizomba Fusion" } }, { artist: { id: "2", name: "DJ Kizz" } }, { artist: { id: "3", name: "Semba Masters" } }],
    poster_url: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/paris-kizomba",
    instagram_link: "https://instagram.com/pariskizomba",
    created_at: "2023-02-15T00:00:00Z",
  },
  {
    id: "4",
    name: "Berlin Zouk Congress",
    start_date: "2023-10-05",
    end_date: "2023-10-08",
    city: "Berlin",
    country: "Germany",
    description:
      "A weekend dedicated to Brazilian Zouk with workshops, shows, and parties featuring international zouk artists.",
    event_styles: [{ style: "Zouk" }],
    event_artists: [
      { artist: { id: "1", name: "Zouk Masters" } },
      { artist: { id: "2", name: "DJ Rio" } },
      { artist: { id: "3", name: "Brazilian Zouk Team" } }
    ],
    poster_url: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/berlin-zouk",
    facebook_link: "https://facebook.com/berlinzouk",
    instagram_link: "https://instagram.com/berlinzouk",
    created_at: "2023-03-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Cancun Bachata Festival",
    start_date: "2023-11-15",
    end_date: "2023-11-20",
    city: "Cancun",
    country: "Mexico",
    description: "Dance bachata on the beautiful beaches of Cancun with top international instructors and DJs.",
    event_styles: [{ style: "Bachata" }, { style: "Salsa" }],
    event_artists: [
      { artist: { id: "1", name: "Bachata Passion" } },
      { artist: { id: "2", name: "DJ Latino" } },
      { artist: { id: "3", name: "Maria & Carlos" } }
    ],
    poster_url: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/cancun-bachata",
    created_at: "2023-03-15T00:00:00Z",
  },
  {
    id: "6",
    name: "Toronto Salsa Weekend",
    start_date: "2023-12-01",
    end_date: "2023-12-03",
    city: "Toronto",
    country: "Canada",
    description: "A weekend of salsa dancing in downtown Toronto with workshops, social dancing, and performances.",
    event_styles: [{ style: "Salsa" }, { style: "Bachata" }],
    event_artists: [
      { artist: { id: "1", name: "Salsa Kings" } },
      { artist: { id: "2", name: "DJ Toronto" } },
      { artist: { id: "3", name: "Latin Vibes Crew" } }
    ],
    poster_url: "/placeholder.svg?height=400&width=600",
    website: "https://example.com/toronto-salsa",
    created_at: "2023-04-01T00:00:00Z",
  },
]

// Function to get all festivals
export async function getFestivals(): Promise<Event[]> {
  // In a real app, this would fetch from an API
  return festivals
}

// Function to get a festival by ID
export async function getFestivalById(id: string): Promise<Event | undefined> {
  // In a real app, this would fetch from an API
  return festivals.find((festival) => festival.id === id)
}

