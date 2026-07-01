"use client"

import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

const months = [
  { label: "Janeiro", value: "01" },
  { label: "Fevereiro", value: "02" },
  { label: "Março", value: "03" },
  { label: "Abril", value: "04" },
  { label: "Maio", value: "05" },
  { label: "Junho", value: "06" },
  { label: "Julho", value: "07" },
  { label: "Agosto", value: "08" },
  { label: "Setembro", value: "09" },
  { label: "Outubro", value: "10" },
  { label: "Novembro", value: "11" },
  { label: "Dezembro", value: "12" },
]

const SearchesPerMonthButtons = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentMonthValue = String(new Date().getMonth() + 1).padStart(2, "0")
  const selectedMonth = searchParams.get("month") || currentMonthValue

  const handleMonthSelect = (monthValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("month", monthValue)

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-auto py-2 lg:justify-center [&::-webkit-scrollbar]:hidden">
      {months.map((month) => (
        <Button
          key={month.value}
          variant={selectedMonth === month.value ? "default" : "outline"}
          onClick={() => handleMonthSelect(month.value)}
          aria-pressed={selectedMonth === month.value}
          className="shrink-0"
        >
          {month.label}
        </Button>
      ))}
    </div>
  )
}

export default SearchesPerMonthButtons
