import { ProductDTO } from "@/dtos/manual-order.dto"
import { ingredientNames, toIngredientList } from "@/helpers/ingredients"
import { calculateItemTotal, PriceCatalog } from "@/lib/pricing/order-total"
import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { useFormContext, useWatch } from "react-hook-form"

type ItemsCardProps = {
  productsById: Map<string, ProductDTO>

  catalog: PriceCatalog
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const ItemsCard = ({ productsById, catalog }: ItemsCardProps) => {
  const { control } = useFormContext<ManualOrderFormInput>()
  const values = useWatch({ control })
  const items = values.items ?? []

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Itens selecionados</h3>

      {items.length === 0 ? (
        <p className="text-muted-foreground rounded-md border border-dashed p-5 text-center text-sm">
          Nenhum produto adicionado ao pedido.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => {
            const product = productsById.get(item.productId ?? "")
            const quantity = item.quantity ?? 1

            const title = item.isDouble
              ? `½ ${item.flavor1Name} + ½ ${item.flavor2Name}`
              : (product?.name ?? "Produto")

            // Cada "parte" do item: 1 no normal, 2 no meio a meio
            const parts = item.isDouble
              ? [
                  {
                    label: item.flavor1Name,
                    removed: item.flavor1Removed,
                    added: toIngredientList(item.flavor1additionalIngredients),
                  },
                  {
                    label: item.flavor2Name,
                    removed: item.flavor2Removed,
                    added: toIngredientList(item.flavor2additionalIngredients),
                  },
                ]
              : [
                  {
                    label: null,
                    removed: item.removedIngredients,
                    added: toIngredientList(item.additionalIngredients),
                  },
                ]

            return (
              <li
                key={`${item.productId}-${index}`}
                className="flex items-end justify-between gap-3 border-b border-dashed"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    <span className="text-muted-foreground mr-1">
                      {quantity}x
                    </span>
                    {title}
                  </p>

                  {parts.map((part, i) => (
                    <div key={i} className="space-y-0.5 text-xs">
                      {part.removed && (
                        <p className="text-red-600">
                          Sem{part.label ? ` (${part.label})` : ""}:{" "}
                          {part.removed}
                        </p>
                      )}
                      {part.added.length > 0 && (
                        <p className="text-green-600">
                          Extra{part.label ? ` (${part.label})` : ""}:{" "}
                          {ingredientNames(part.added)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <span className="shrink-0 text-sm font-medium tabular-nums">
                  {currencyFormatter.format(calculateItemTotal(item, catalog))}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ItemsCard
