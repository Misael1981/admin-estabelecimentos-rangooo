"use client"

import { OrderItemDTO } from "@/dtos/order.dto"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import dynamic from "next/dynamic"
import { getPusherClient } from "@/lib/pusher"
import { useRouter } from "next/navigation"
import type { AreaType, OrderStatus } from "@misael1981/rangooo-database"
const CardOrder = dynamic(() => import("../CardOrder"), {
  ssr: false,
})

type OrderType = {
  id: string
  customerName: string
  customerPhone: string
  paymentMethod: string | null
  orderNumber: number
  totalAmount: number
  status: OrderStatus
  method: "DELIVERY" | "PICKUP" | "DINE_IN"
  createdAt: string
  items: OrderItemDTO[]
  address?:
    | {
        street: string
        number: string
        city: string
        neighborhood?: string
        complement?: string
        reference?: string
        areaType?: AreaType
      }
    | undefined
}

type OrdersListWrapperProps = {
  normalizedOrders: OrderType[]
  slug: string
  restaurantId: string
}

const OrdersListWrapper = ({
  normalizedOrders,
  slug,
  restaurantId,
}: OrdersListWrapperProps) => {
  const [showDelivered, setShowDelivered] = useState(false)
  const [orders, setOrders] = useState(normalizedOrders)
  const router = useRouter()

  const activeOrders = orders.filter((order) => order.status !== "DELIVERED")

  const deliveredOrders = orders.filter((order) => order.status === "DELIVERED")

  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(`restaurant-${restaurantId}`)

    console.log("📡 Conectando ao Pusher, canal:", `restaurant-${restaurantId}`)

    const handleOrderCreated = (data: OrderType) => {
      console.log("🔔 EVENTO order:created RECEBIDO!", data)
      setOrders((prevOrders) => [data, ...prevOrders])
      router.refresh()
    }

    const handleSubscriptionSucceeded = () => {
      console.log(
        "✅ Inscrito no canal com sucesso:",
        `restaurant-${restaurantId}`,
      )
    }

    const handleGlobalEvent = (eventName: string, data: unknown) => {
      console.log("🌐 Pusher global event:", eventName, data)
    }

    channel.bind("order:created", handleOrderCreated)
    channel.bind("pusher:subscription_succeeded", handleSubscriptionSucceeded)
    pusher.bind_global(handleGlobalEvent)

    return () => {
      channel.unbind("order:created", handleOrderCreated)
      channel.unbind(
        "pusher:subscription_succeeded",
        handleSubscriptionSucceeded,
      )
      pusher.unbind_global(handleGlobalEvent)
      pusher.unsubscribe(`restaurant-${restaurantId}`)
    }
  }, [restaurantId, router])

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      {orders.length === 0 ? (
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm">
          <span className="text-3xl">📭</span>

          <h3 className="text-lg font-semibold text-gray-800">
            Nenhum pedido por enquanto
          </h3>

          <p className="text-sm text-gray-600">
            Assim que novos pedidos chegarem, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        activeOrders.map((order) => (
          <CardOrder key={order.id} order={order} slug={slug} />
        ))
      )}

      {deliveredOrders.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="flex w-full max-w-2xl items-center gap-4">
            <div className="h-1 flex-1 bg-gray-200" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDelivered(!showDelivered)}
              className="gap-2 rounded-full border-gray-300 text-gray-600 transition-all hover:bg-gray-100"
            >
              {showDelivered ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Ocultar pedidos entregues ({deliveredOrders.length})
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Mostrar pedidos entregues ({deliveredOrders.length})
                </>
              )}
            </Button>
            <div className="h-1 flex-1 bg-gray-200" />
          </div>

          {/* SEÇÃO DE PEDIDOS CONCLUÍDOS (RENDERIZAÇÃO CONDICIONAL) */}
          {showDelivered && (
            <section className="flex w-full flex-col items-center justify-center gap-4 opacity-80 transition-opacity hover:opacity-100">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Histórico de entregas do turno
              </div>
              {deliveredOrders.map((order) => (
                <CardOrder key={order.id} order={order} slug={slug} />
              ))}
            </section>
          )}
        </div>
      )}
    </section>
  )
}

export default OrdersListWrapper
