"use client"

import { ProductDTO } from "@/dtos/manual-order.dto"
import ProductCard from "../ProductCard"

type ProductListProps = {
  products: ProductDTO[]
  onSelect: (productId: string) => void
  selectedIds: string[]
  maxSelections: 1 | 2
}

const ProductsList = ({
  products,
  onSelect,
  selectedIds,
  maxSelections,
}: ProductListProps) => {
  return (
    <section className="scrollbar overflow-x-auto pb-2">
      <div className="flex w-max gap-4">
        {products.map((product) => (
          <div key={product.id} className="w-110 shrink-0">
            <ProductCard
              product={product}
              isSelected={selectedIds.includes(product.id)}
              onSelect={() => onSelect(product.id)}
              disabled={
                !selectedIds.includes(product.id) &&
                selectedIds.length >= maxSelections
              }
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductsList
