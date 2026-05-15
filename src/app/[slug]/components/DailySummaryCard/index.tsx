import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bike, Store, Calculator, UtensilsCrossed } from "lucide-react"

interface SummaryItem {
  count: number
  value: number
}

interface DailySummaryProps {
  delivery: SummaryItem
  pickup: SummaryItem
  dineIn: SummaryItem
}

const DailySummaryCard = ({ delivery, pickup, dineIn }: DailySummaryProps) => {
  const totalValue = delivery.value + pickup.value + dineIn.value
  const totalCount = delivery.count + pickup.count + dineIn.count

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Calculator className="h-4 w-4" />
          Fechamento Parcial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-slate-100">
          {/* Mesas */}
          {dineIn.count > 0 && (
            <li className="group flex items-center justify-between rounded-lg px-2 py-4 transition-colors hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 p-2">
                  <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Mesas
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{dineIn.count} pedidos</p>
                <p className="text-lg font-bold text-slate-900">
                  {dineIn.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </li>
          )}

          {/* Entregas */}
          {delivery.count > 0 && (
            <li className="group flex items-center justify-between rounded-lg px-2 py-4 transition-colors hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 p-2">
                  <Bike className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Entregas
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">
                  {delivery.count} pedidos
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {delivery.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </li>
          )}

          {/* Retiradas */}
          {pickup.count > 0 && (
            <li className="group flex items-center justify-between rounded-lg px-2 py-4 transition-colors hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-50 p-2">
                  <Store className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Retiradas
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{pickup.count} pedidos</p>
                <p className="text-lg font-bold text-slate-900">
                  {pickup.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </li>
          )}

          {/* Totalizador */}
          <li className="mt-2 flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
            <span className="text-lg font-black">Total do Dia</span>
            <div className="text-right">
              <p className="text-xs tracking-widest text-slate-400 uppercase">
                {totalCount} total
              </p>
              <p className="text-3xl font-black text-emerald-600">
                {totalValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

export default DailySummaryCard
