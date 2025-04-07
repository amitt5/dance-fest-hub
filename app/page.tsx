import FestivalDirectory from "@/components/festival-directory"
import { getFestivals } from "@/lib/data"

export default async function Home() {
  const festivals = await getFestivals()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Upcoming Dance Festivals</h1>
      <FestivalDirectory initialFestivals={festivals} />
    </div>
  )
}

