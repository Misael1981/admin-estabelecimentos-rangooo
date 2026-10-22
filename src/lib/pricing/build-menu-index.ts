import { MenuCategoryDTO, ProductDTO } from "@/dtos/manual-order.dto"
import { PriceCatalog } from "./order-total"

export function buildMenuIndex(categories: MenuCategoryDTO[]) {
  const productsById = new Map<string, ProductDTO>()
  const productPrices = new Map<string, number>()
  const additionalPrices = new Map<string, number>()

  for (const category of categories) {
    for (const product of category.products) {
      productsById.set(product.id, product)
      productPrices.set(product.id, product.price)
    }
    for (const ing of category.additionalIngredients) {
      if (ing.id) additionalPrices.set(ing.id, ing.price ?? 0)
    }
  }

  const catalog: PriceCatalog = { productPrices, additionalPrices }
  return { catalog, productsById }
}
