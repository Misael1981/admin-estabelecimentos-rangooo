"use client"

import {
  ManageableIngredientDTO,
  MenuCategoryDTO,
} from "@/dtos/manual-order.dto"
import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import SearchProduct from "./components/SearchProduct"
import SelectQuantityFlavors from "./components/SelectQuantityFlavors"
import MenuCategorieSelect from "./components/MenuCategorieSelect"
import ProductsList from "./components/ProductsList"
import IngredientCustomizer from "./components/IngredientCustomizer"
import FieldsItem from "./components/FieldsItem"
import { toAdded } from "@/helpers/to-added"

type Props = {
  menuCategories: MenuCategoryDTO[]
}

type Customization = {
  added: ManageableIngredientDTO[]
  removed: string[]
}

const emptyCustom: Customization = { added: [], removed: [] }

const OrderItemsBuilder = ({ menuCategories }: Props) => {
  const { control } = useFormContext<ManualOrderFormInput>()
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

    const c1 = getCustom(first)
    const c2 = isDouble && second ? getCustom(second) : emptyCustom

    append(
      isDouble
        ? {
            productId: first,
            quantity,
            isDouble: true,
            flavor1Id: first,
            flavor1Removed: c1.removed,
            flavor1additionalIngredients: toAdded(c1.added),
            flavor2Id: second,
            flavor2Removed: c2.removed,
            flavor2additionalIngredients: toAdded(c2.added),
          }
        : {
            productId: first,
            quantity,
            isDouble: false,
            removedIngredients: c1.removed.length
              ? JSON.stringify(c1.removed)
              : null,
            additionalIngredients: toAdded(c1.added),
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
      <MenuCategorieSelect
        menuCategories={menuCategories}
        selectedCategoryId={selectedCategory.id}
        onSelectCategory={handleCategoryClick}
      />

      <SearchProduct
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        label={selectedCategory.name}
      />

      {selectedCategory.isDouble && (
        <SelectQuantityFlavors
          selectTwoFlavors={selectTwoFlavors}
          onSelectTwoFlavors={handleToggleTwoFlavors}
        />
      )}

      <ProductsList
        products={filteredProducts}
        onSelect={handleSelectProduct}
        selectedIds={selectedIds}
        maxSelections={maxSelections}
      />

      <IngredientCustomizer
        selectedIds={selectedIds}
        selectedCategory={selectedCategory}
        isDouble={isDouble}
        handleAddItem={handleAddItem}
        updateCustom={updateCustom}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      <FieldsItem
        fields={fields}
        onRemove={remove}
        menuCategories={menuCategories}
      />
    </div>
  )
}

export default OrderItemsBuilder
