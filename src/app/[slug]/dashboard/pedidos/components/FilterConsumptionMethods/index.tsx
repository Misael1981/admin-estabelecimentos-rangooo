"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConsumptionMethod } from "@misael1981/rangooo-database"

const LABELS: Record<ConsumptionMethod, string> = {
  DELIVERY: "Entrega",
  PICKUP: "Retirada",
  DINE_IN: "Consumo Local",
}

interface FilterConsumptionMethodsProps {
  consumptionMethods?: ConsumptionMethod[] | { method: ConsumptionMethod }[]
}

const FilterConsumptionMethods = ({
  consumptionMethods = [],
}: FilterConsumptionMethodsProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const active = searchParams.get(
    "consumptionMethod",
  ) as ConsumptionMethod | null

  const handleFilterChange = (value: ConsumptionMethod | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!value) {
      params.delete("consumptionMethod")
    } else {
      params.set("consumptionMethod", value)
    }

    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const available: ConsumptionMethod[] = consumptionMethods
    .map((m) => (typeof m === "string" ? m : m.method))
    .filter(Boolean)

  return (
    <section className="my-6 flex flex-col items-center justify-center gap-4">
      <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
        Filtrar por Consumo
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={active === null ? "default" : "outline"}
          size="sm"
          className="cursor-pointer rounded-full"
          onClick={() => handleFilterChange(null)}
        >
          Todos
        </Button>

        {available.map((method) => (
          <Button
            key={method}
            variant={active === method ? "default" : "outline"}
            size="sm"
            className="cursor-pointer rounded-full"
            onClick={() => handleFilterChange(method)}
          >
            {LABELS[method] || method}
          </Button>
        ))}
      </div>
    </section>
  )
}

export default FilterConsumptionMethods
