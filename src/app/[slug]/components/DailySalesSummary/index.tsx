import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import MetricCard from "../MetricCard"
import {
  DollarSign,
  Motorbike,
  ShoppingBag,
  User,
  UtensilsCrossed,
} from "lucide-react"
import { formatCurrency } from "@/helpers/format-currency"
import { Decimal } from "@misael1981/rangooo-database/generated-client/runtime/library"
import DailySummaryCard from "../DailySummaryCard"

interface Order {
  id: string
  status: string
  totalAmount: Decimal
  consumptionMethod: "DELIVERY" | "PICKUP" | "DINE_IN" | string
  createdAt: Date
}

interface DailySalesSummaryProps {
  todayOrders: Order[]
}

const DailySalesSummary = ({ todayOrders }: DailySalesSummaryProps) => {
  const deliveryOrders = todayOrders.filter(
    (o) => o.consumptionMethod === "DELIVERY",
  )
  const pickupOrders = todayOrders.filter(
    (o) => o.consumptionMethod === "PICKUP",
  )
  const dineInOrders = todayOrders.filter(
    (o) => o.consumptionMethod === "DINE_IN",
  )

  const totalRevenue = todayOrders.reduce(
    (acc, o) => acc + Number(o.totalAmount),
    0,
  )

  const deliveryValue = deliveryOrders.reduce(
    (acc, o) => acc + Number(o.totalAmount),
    0,
  )
  const pickupValue = pickupOrders.reduce(
    (acc, o) => acc + Number(o.totalAmount),
    0,
  )
  const dineInValue = dineInOrders.reduce(
    (acc, o) => acc + Number(o.totalAmount),
    0,
  )

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Resumo do Dia</h2>
        <p className="text-sm text-gray-600">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <MetricCard
          title="Faturamento Total"
          value={formatCurrency(Number(totalRevenue))}
          description="em relação a ontem"
          icon={DollarSign}
        />

        <MetricCard
          title="Pedidos"
          value={todayOrders.length}
          description="total de pedidos"
          icon={ShoppingBag}
        />

        {deliveryOrders.length > 0 && (
          <MetricCard
            title="Delivery"
            value={deliveryOrders.length}
            description="pedidos para entrega"
            icon={Motorbike}
          />
        )}

        {pickupOrders.length > 0 && (
          <MetricCard
            title="Retirar"
            value={pickupOrders.length}
            description="pedidos para retirada"
            icon={User}
          />
        )}

        {dineInOrders.length > 0 && (
          <MetricCard
            title="Mesa"
            value={dineInOrders.length}
            description="pedidos para consumo no local"
            icon={UtensilsCrossed}
          />
        )}
      </div>

      <DailySummaryCard
        delivery={{
          count: deliveryOrders.length,
          value: deliveryValue,
        }}
        pickup={{
          count: pickupOrders.length,
          value: pickupValue,
        }}
        dineIn={{
          count: dineInOrders.length,
          value: dineInValue,
        }}
      />
    </section>
  )
}

export default DailySalesSummary
