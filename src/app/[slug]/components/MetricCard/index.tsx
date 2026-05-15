// src/app/(app)/[slug]/components/MetricCard.tsx
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend?: {
    value: number // ex: 10 para +10%
    isPositive: boolean
  }
}

const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: MetricCardProps) => {
  return (
    <Card className="min-w-60 gap-0 overflow-hidden border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold tracking-wider uppercase">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-slate-50 p-2">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-green-600">{value}</div>
        <div className="mt-1 flex items-center gap-1">
          {trend && (
            <span
              className={`text-xs font-bold ${trend.isPositive ? "text-emerald-600" : "text-rose-600"}`}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
          )}
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard
