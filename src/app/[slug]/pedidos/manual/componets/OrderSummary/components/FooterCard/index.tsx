import { DeliveryFees } from "@/dtos/delivery-fees.dto"
import {
  calculateItemsSubtotal,
  calculateOrderTotal,
  PriceCatalog,
} from "@/lib/pricing/order-total"
import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { useFormContext, useWatch } from "react-hook-form"

type FooterCardProps = {
  catalog: PriceCatalog
  deliveryFees: DeliveryFees
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const FooterCard = ({ catalog, deliveryFees }: FooterCardProps) => {
  const { control } = useFormContext<ManualOrderFormInput>()
  const [items, method, areaType] = useWatch({
    control,
    name: ["items", "consumptionMethod", "areaType"],
  })

  const isDelivery = method === "DELIVERY"
  const feeCents = isDelivery && areaType ? deliveryFees[areaType] : undefined
  const outOfArea = isDelivery && feeCents === undefined

  const subtotal = calculateItemsSubtotal(items ?? [], catalog)
  const total = calculateOrderTotal(subtotal, feeCents ?? 0)

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="tabular-nums">
          {currencyFormatter.format(subtotal)}
        </span>
      </div>

      {isDelivery && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Taxa de entrega</span>
          {outOfArea ? (
            <span className="text-destructive text-xs font-medium">
              Não atendemos esta área
            </span>
          ) : (
            <span className="tabular-nums">
              {currencyFormatter.format((feeCents ?? 0) / 100)}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Total estimado</span>
        <span className="tabular-nums">{currencyFormatter.format(total)}</span>
      </div>
    </div>
  )
}

export default FooterCard
