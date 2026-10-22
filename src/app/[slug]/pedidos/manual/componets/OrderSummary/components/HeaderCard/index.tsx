import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { Receipt } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"

const HeaderCard = () => {
  // HeaderCard
  const { control } = useFormContext<ManualOrderFormInput>()
  const items = useWatch({ control, name: "items" })
  const totalQuantity = (items ?? []).reduce((t, i) => t + (i.quantity ?? 1), 0)

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Receipt className="text-muted-foreground size-5" />

        <h2 className="text-lg font-semibold tracking-tight">
          Resumo do pedido
        </h2>
      </div>

      <span className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium">
        {totalQuantity} {totalQuantity === 1 ? "item" : "itens"}
      </span>
    </header>
  )
}

export default HeaderCard
