import { notFound } from "next/navigation"
import EventForm from "@/components/event-form"
import { getFestivalById } from "@/lib/data"

export default async function EditEventPage({
  params,
}: {
  params: { id: string }
}) {
  const festival = await getFestivalById(params.id)

  if (!festival) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Festival</h1>
      <EventForm initialData={festival} />
    </div>
  )
}

