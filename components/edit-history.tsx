"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EditHistoryItem {
  id: string
  user: {
    name: string
    avatar: string
  }
  date: string
  changes: {
    field: string
    oldValue: string
    newValue: string
  }[]
}

// Mock data
const mockEditHistory: EditHistoryItem[] = [
  {
    id: "1",
    user: {
      name: "Admin",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2023-04-01 14:32",
    changes: [
      {
        field: "Event Created",
        oldValue: "",
        newValue: "Initial event creation",
      },
    ],
  },
  {
    id: "2",
    user: {
      name: "Maria Lopez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2023-04-05 09:15",
    changes: [
      {
        field: "Description",
        oldValue: "Join us for a weekend of dancing.",
        newValue: "Join us for a weekend of dancing with international artists and DJs.",
      },
    ],
  },
  {
    id: "3",
    user: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    date: "2023-04-10 16:45",
    changes: [
      {
        field: "Artists",
        oldValue: "DJ Mambo, Maria & Carlos",
        newValue: "DJ Mambo, Maria & Carlos, Bachata Sensual Team",
      },
      {
        field: "End Date",
        oldValue: "2023-07-23",
        newValue: "2023-07-24",
      },
    ],
  },
]

export default function EditHistory({ festivalId }: { festivalId: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit History</h2>

      <div className="space-y-6">
        {mockEditHistory.map((item) => (
          <div key={item.id} className="border-b pb-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-medium">{item.user.name}</h3>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>

            <div className="space-y-2 ml-11">
              {item.changes.map((change, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{change.field}: </span>
                  {change.oldValue ? (
                    <>
                      <span className="line-through text-red-500">{change.oldValue}</span>
                      <span className="mx-2">→</span>
                    </>
                  ) : null}
                  <span className="text-green-600">{change.newValue}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

