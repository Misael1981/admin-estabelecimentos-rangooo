import { ProductDTO } from "@/dtos/manual-order.dto"
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
  const items = useWatch({ control, name: "items" }) ?? []

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
            const quantity = item.quantity ?? 1
            const nameOf = (id?: string | null) =>
              productsById.get(id ?? "")?.name

            const name1 = nameOf(item.flavor1Id)
            const name2 = nameOf(item.flavor2Id)

            const title = item.isDouble
              ? `½ ${name1 ?? "Sabor 1"} + ½ ${name2 ?? "Sabor 2"}`
              : (nameOf(item.productId) ?? "Produto")

            const parseRemoved = (
              value: string | string[] | null | undefined,
            ): string[] => {
              if (!value) return []
              if (Array.isArray(value)) return value

              try {
                const parsed = JSON.parse(value)
                return Array.isArray(parsed)
                  ? parsed.filter(
                      (entry): entry is string => typeof entry === "string",
                    )
                  : []
              } catch {
                return [value]
              }
            }

            const parts: Array<{
              label: string | null
              removed: string[]
              added: Array<{ name: string; id?: string }>
            }> = item.isDouble
              ? [
                  {
                    label: name1 ?? null,
                    removed: item.flavor1Removed ?? [],
                    added: item.flavor1additionalIngredients ?? [],
                  },
                  {
                    label: name2 ?? null,
                    removed: item.flavor2Removed ?? [],
                    added: item.flavor2additionalIngredients ?? [],
                  },
                ]
              : [
                  {
                    label: null,
                    removed: parseRemoved(item.removedIngredients),
                    added: item.additionalIngredients ?? [],
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
                      {part.removed.length > 0 && (
                        <p className="text-red-600">
                          Sem{part.label ? ` (${part.label})` : ""}:{" "}
                          {part.removed.join(", ")}
                        </p>
                      )}
                      {part.added.length > 0 && (
                        <p className="text-green-600">
                          Extra{part.label ? ` (${part.label})` : ""}:{" "}
                          {part.added.map((a) => a.name).join(", ")}
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
