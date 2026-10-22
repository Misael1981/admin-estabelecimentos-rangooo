export type PriceCatalog = {
  productPrices: Map<string, number>
  additionalPrices: Map<string, number>
}

type PricedIngredient = { id?: string }

export type PricedItem = {
  productId?: string | null
  quantity?: number
  isDouble?: boolean
  flavor1Id?: string | null
  flavor2Id?: string | null
  additionalIngredients?: PricedIngredient[] | null
  flavor1additionalIngredients?: PricedIngredient[] | null
  flavor2additionalIngredients?: PricedIngredient[] | null
}

// Regra do meio a meio: troque aqui se a decisão for outra
export type HalfAndHalfRule = "HIGHEST" | "AVERAGE"
export const HALF_AND_HALF_RULE: HalfAndHalfRule = "HIGHEST"

// Trabalha em centavos (inteiros) pra evitar 0.1 + 0.2 = 0.30000000000000004
const toCents = (value: number) => Math.round(value * 100)

export function calculateItemTotal(
  item: PricedItem,
  catalog: PriceCatalog,
): number {
  const quantity = item.quantity ?? 1

  const productCents = (id?: string | null) =>
    id ? toCents(catalog.productPrices.get(id) ?? 0) : 0

  const additionsCents = (list?: PricedIngredient[] | null) =>
    (list ?? []).reduce(
      (sum, ing) =>
        sum + (ing.id ? toCents(catalog.additionalPrices.get(ing.id) ?? 0) : 0),
      0,
    )

  let unitCents: number

  if (item.isDouble) {
    const p1 = productCents(item.flavor1Id)
    const p2 = productCents(item.flavor2Id)

    const base =
      HALF_AND_HALF_RULE === "AVERAGE"
        ? Math.round((p1 + p2) / 2)
        : Math.max(p1, p2)

    unitCents =
      base +
      additionsCents(item.flavor1additionalIngredients) +
      additionsCents(item.flavor2additionalIngredients)
  } else {
    unitCents =
      productCents(item.productId) + additionsCents(item.additionalIngredients)
  }

  return (unitCents * quantity) / 100
}

export function calculateItemsSubtotal(
  items: PricedItem[],
  catalog: PriceCatalog,
): number {
  const cents = items.reduce(
    (sum, item) => sum + Math.round(calculateItemTotal(item, catalog) * 100),
    0,
  )
  return cents / 100
}

export function calculateOrderTotal(
  subtotalReais: number,
  deliveryFeeCents: number = 0,
): number {
  return (Math.round(subtotalReais * 100) + deliveryFeeCents) / 100
}
