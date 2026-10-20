"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MenuCategoryDTO } from "@/dtos/manual-order.dto"

type MenuCategorieSelectProps = {
  menuCategories: MenuCategoryDTO[]
  selectedCategoryId: string | null
  onSelectCategory: (category: MenuCategoryDTO) => void
}

const MenuCategorieSelect = ({
  menuCategories,
  selectedCategoryId,
  onSelectCategory,
}: MenuCategorieSelectProps) => {
  return (
    <ScrollArea className="w-full">
      <Separator className="my-4 bg-gray-300" />
      <div className="flex items-center justify-center gap-4">
        {menuCategories.map((category) => (
          <Button
            key={category.id}
            type="button"
            size="sm"
            variant={
              selectedCategoryId === category.id ? "default" : "secondary"
            }
            onClick={() => onSelectCategory(category)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <Separator className="my-4 bg-gray-300" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default MenuCategorieSelect
