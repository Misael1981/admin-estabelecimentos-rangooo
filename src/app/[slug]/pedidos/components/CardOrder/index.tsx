"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatCurrency } from "@/helpers/format-currency"
import {
  CardOrderProps,
  METHOD_CONFIGS,
  paymentMethods,
} from "@/constants/maps-options"
import SelectStatus from "./components/SelectStatus"
import PrintOrderButton from "./components/PrintOrderButton"

const CardOrder = ({ order, slug, restaurantName }: CardOrderProps) => {
  const methodConfig = METHOD_CONFIGS[order.method!]

  console.log(order)

  return (
    <div className="max-w-120">
      <Card className="hover:border-primary/20 w-full max-w-3xl gap-0 border-2 p-0 transition-all">
        <CardHeader className="gap-0 border-b p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex w-full items-center justify-between gap-2 lg:w-fit">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-semibold">Nº do Pedido</span>
                <Badge>{order.orderNumber}</Badge>
              </div>
              <div className="space-x-2">
                <Badge
                  variant="outline"
                  className={`${methodConfig.color} border-current`}
                >
                  {/* <MethodIcon className="mr-1 h-4 w-4" /> */}
                  {methodConfig.label}
                </Badge>
              </div>
            </div>

            <SelectStatus
              status={order.status}
              slug={slug}
              orderId={order.id}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-2 border-b border-dashed pb-2 last:border-0 last:pb-0"
              >
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    {item.category || "Geral"}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.quantity}x</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground text-sm font-medium">
                Total do Pedido
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(Number(order.totalAmount))}
              </span>
            </div>
            {order.method === "DELIVERY" && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground text-sm font-medium">
                  Método de pagamento
                </span>
                <span className="text-lg font-bold text-green-600">
                  {
                    paymentMethods[
                      order.paymentMethod as keyof typeof paymentMethods
                    ]
                  }
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="gap-0 border-t p-6">
          <div className="flex w-full flex-wrap items-end justify-center gap-6 sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {order.customerName || "Cliente"}
                {order.customerPhone && ` - ${order.customerPhone}`}
              </p>
              {order.method === "DELIVERY" && order.address && (
                <p className="text-muted-foreground text-xs">
                  {order.address.street}, {order.address.number},{" "}
                  {order.address.neighborhood}
                </p>
              )}
            </div>
            <PrintOrderButton order={order} restaurantName={restaurantName} />
          </div>
        </CardFooter>
      </Card>
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      ></div>
    </div>
  )
}

export default CardOrder
