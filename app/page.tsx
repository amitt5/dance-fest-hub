import FestivalDirectory from "@/components/festival-directory"

export default async function Home() {

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Upcoming Dance Festivals</h1>
      <FestivalDirectory />
    </div>
  )
}

