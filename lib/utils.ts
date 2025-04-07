import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startMonth = start.toLocaleString("default", { month: "short" })
  const endMonth = end.toLocaleString("default", { month: "short" })

  const startDay = start.getDate()
  const endDay = end.getDate()

  const startYear = start.getFullYear()
  const endYear = end.getFullYear()

  if (startYear !== endYear) {
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
  }

  if (startMonth !== endMonth) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
  }

  return `${startMonth} ${startDay} - ${endDay}, ${startYear}`
}

