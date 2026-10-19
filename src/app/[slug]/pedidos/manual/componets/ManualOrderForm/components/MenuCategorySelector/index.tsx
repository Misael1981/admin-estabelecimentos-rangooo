"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MenuCategoryDTO } from "@/dtos/manual-order.dto"
import { useState } from "react"
import ProductCard from "./components/ProductCard"
import SearchProduct from "./components/SearchProduct"
import SelectQuantityFlavors from "./components/SelectQuantityFlavors"

type MenuCategoryProps = {
  menuCategories: MenuCategoryDTO[]
}

const MenuCategorySelector = ({ menuCategories }: MenuCategoryProps) => {
  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectTwoFlavors, setSelectTwoFlavors] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleCategoryClick = (category: MenuCategoryDTO) => {
    setSelectedCategory(category)
  }

  const filteredProducts = selectedCategory.products.filter((product) => {
    const searchLower = searchValue.toLowerCase()
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    )
  })

  const handleSelectProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
      return
    }

    const maxSelections = selectTwoFlavors ? 2 : 1

    setSelectedIds((prev) =>
      prev.length < maxSelections ? [...prev, id] : prev,
    )
  }

  const maxSelections = selectTwoFlavors ? 2 : 1

  return (
    <div className="space-y-6">
      <ScrollArea className="w-full">
        <Separator className="my-4 bg-gray-300" />
        <div className="flex items-center justify-center gap-4">
          {menuCategories.map((category) => (
            <Button
              key={category.id}
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
          onSelectTwoFlavors={setSelectTwoFlavors}
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
    </div>
  )
}

export default MenuCategorySelector
