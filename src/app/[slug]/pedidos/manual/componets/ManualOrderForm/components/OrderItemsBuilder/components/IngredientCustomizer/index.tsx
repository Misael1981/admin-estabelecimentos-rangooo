"use client"

import {
  ManageableIngredientDTO,
  MenuCategoryDTO,
} from "@/dtos/manual-order.dto"
import IngredientManager from "../IngredientManager"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Customization = {
  added: ManageableIngredientDTO[]
  removed: string[]
}

type IngredientCustomizerProps = {
  selectedIds: string[]
  selectedCategory: MenuCategoryDTO
  isDouble: boolean
  handleAddItem: () => void
  updateCustom: (productId: string, patch: Partial<Customization>) => void
  quantity: number
  setQuantity: (value: number) => void
}

const IngredientCustomizer = ({
  selectedIds,
  selectedCategory,
  isDouble,
  handleAddItem,
  updateCustom,
  quantity,
  setQuantity,
}: IngredientCustomizerProps) => {
  return (
    <div className="space-y-4">
      {selectedIds.map((productId, index) => {
        const product = selectedCategory.products.find(
          (p) => p.id === productId,
        )
        if (!product) return null

        const removable: ManageableIngredientDTO[] = (
          product.ingredients ?? []
        ).map((name) => ({ name }))
        const addable = selectedCategory.additionalIngredients.filter(
          (ing) => ing.isActive !== false,
        )

        return (
          <div key={productId} className="mx-auto w-full max-w-xl space-y-3">
            {isDouble && (
              <p className="text-sm font-semibold">
                ½ {product.name} (sabor {index + 1})
              </p>
            )}

            {removable.length > 0 && (
              <IngredientManager
                title="Retirar ingrediente"
                ingredients={removable}
                onChangeDelete={(names) =>
                  updateCustom(productId, { removed: names })
                }
              />
            )}

            {addable.length > 0 && (
              <IngredientManager
                title="Adicionar ingrediente"
                ingredients={addable}
                onChange={(items) => updateCustom(productId, { added: items })}
              />
            )}
          </div>
        )
      })}

      <div className="mx-auto flex w-full max-w-xl items-center gap-3">
        <Input
          type="number"
          min={1}
          className="w-24"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, e.target.valueAsNumber || 1))
          }
        />
        <Button type="button" className="flex-1" onClick={handleAddItem}>
          Adicionar ao pedido
        </Button>
      </div>
    </div>
  )
}

export default IngredientCustomizer
