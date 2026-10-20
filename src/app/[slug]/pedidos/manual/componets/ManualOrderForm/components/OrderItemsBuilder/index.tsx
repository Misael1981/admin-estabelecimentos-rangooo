"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ManageableIngredientDTO,
  MenuCategoryDTO,
} from "@/dtos/manual-order.dto"
import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import ProductCard from "./components/ProductCard"
import SearchProduct from "./components/SearchProduct"
import SelectQuantityFlavors from "./components/SelectQuantityFlavors"
import IngredientManager from "./components/IngredientManager"

type Props = {
  menuCategories: MenuCategoryDTO[]
}

type Customization = {
  added: ManageableIngredientDTO[]
  removed: string[]
}

const emptyCustom: Customization = { added: [], removed: [] }

const OrderItemsBuilder = ({ menuCategories }: Props) => {
  const { control, formState } = useFormContext<ManualOrderFormInput>()
  const { fields, append, remove } = useFieldArray({ control, name: "items" })

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    menuCategories[0]?.id,
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectTwoFlavors, setSelectTwoFlavors] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState<
    Record<string, Customization>
  >({})

  const getCustom = (productId: string) =>
    customizations[productId] ?? emptyCustom

  const updateCustom = (productId: string, patch: Partial<Customization>) =>
    setCustomizations((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] ?? emptyCustom), ...patch },
    }))

  const selectedCategory = menuCategories.find(
    (c) => c.id === selectedCategoryId,
  )

  if (!selectedCategory) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        Nenhuma tabela cadastrada.
      </p>
    )
  }

  const isDouble = selectedCategory.isDouble && selectTwoFlavors
  const maxSelections = isDouble ? 2 : 1

  const resetSelection = () => {
    setSelectedIds([])
    setSelectTwoFlavors(false)
    setQuantity(1)
    setCustomizations({})
  }

  const handleCategoryClick = (category: MenuCategoryDTO) => {
    setSelectedCategoryId(category.id)
    setSearchValue("")
    resetSelection()
  }

  const handleSelectProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
      // eslint-disable-next-line
      setCustomizations(({ [id]: _removed, ...rest }) => rest)
      return
    }
    if (selectedIds.length < maxSelections) {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleToggleTwoFlavors = (value: boolean) => {
    setSelectTwoFlavors(value)
    if (!value) {
      const keep = selectedIds[0]
      setSelectedIds(keep ? [keep] : [])
      setCustomizations((prev) =>
        keep && prev[keep] ? { [keep]: prev[keep] } : {},
      )
    }
  }

  const handleAddItem = () => {
    if (selectedIds.length < maxSelections) {
      return toast.error(
        isDouble ? "Selecione os 2 sabores." : "Selecione um produto.",
      )
    }

    const [first, second] = selectedIds

    const nameOf = (id?: string) =>
      selectedCategory.products.find((p) => p.id === id)?.name ?? null

    const joinNames = (names: string[]) => names.join(", ") || null

    const c1 = getCustom(first)
    const c2 = isDouble && second ? getCustom(second) : emptyCustom

    append(
      isDouble
        ? {
            productId: first,
            quantity,
            isDouble: true,
            flavor1Id: first,
            flavor1Name: nameOf(first),
            flavor1Removed: joinNames(c1.removed),
            flavor1additionalIngredients: c1.added,
            flavor2Id: second,
            flavor2Name: nameOf(second),
            flavor2Removed: joinNames(c2.removed),
            flavor2additionalIngredients: c2.added,
          }
        : {
            productId: first,
            quantity,
            isDouble: false,
            removedIngredients: joinNames(c1.removed),
            additionalIngredients: c1.added,
          },
    )

    resetSelection()
  }

  const filteredProducts = selectedCategory.products.filter((product) => {
    const term = searchValue.toLowerCase()
    return (
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <ScrollArea className="w-full">
        <Separator className="my-4 bg-gray-300" />
        <div className="flex items-center justify-center gap-4">
          {menuCategories.map((category) => (
            <Button
              key={category.id}
              type="button"
              size="sm"
              variant={
                selectedCategory.id === category.id ? "default" : "secondary"
              }
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <Separator className="my-4 bg-gray-300" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <section className="flex flex-col items-center gap-2">
        <h3 className="px-5 pt-2 text-center text-2xl font-semibold">
          {selectedCategory.name}
        </h3>
        <SearchProduct
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </section>

      {selectedCategory.isDouble && (
        <SelectQuantityFlavors
          selectTwoFlavors={selectTwoFlavors}
          onSelectTwoFlavors={handleToggleTwoFlavors}
        />
      )}

      <section className="scrollbar overflow-x-auto pb-2">
        <div className="flex w-max gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="w-110 shrink-0">
              <ProductCard
                product={product}
                isSelected={selectedIds.includes(product.id)}
                onSelect={() => handleSelectProduct(product.id)}
                disabled={
                  !selectedIds.includes(product.id) &&
                  selectedIds.length >= maxSelections
                }
              />
            </div>
          ))}
        </div>
      </section>

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

      {/* Carrinho provisório, só pra você enxergar o que está no form */}
      <section className="mx-auto w-full max-w-xl space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center justify-between rounded-md border p-2 text-sm"
          >
            <span>
              {field.quantity}x{" "}
              {field.isDouble
                ? `½ ${field.flavor1Name} + ½ ${field.flavor2Name}`
                : (menuCategories
                    .flatMap((c) => c.products)
                    .find((p) => p.id === field.productId)?.name ?? "Produto")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
            >
              Remover
            </Button>
          </div>
        ))}

        {formState.errors.items?.message && (
          <p className="text-destructive text-sm">
            {formState.errors.items.message}
          </p>
        )}
      </section>
    </div>
  )
}

export default OrderItemsBuilder
