"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronRight, Edit, Grid, MoreVertical, Trash2 } from "lucide-react"
import { useState } from "react"
import AlertDialogDelete from "../AlertDialogDelete"

type CategorySummary = {
  id: string
  name: string
  productsCount: number
}

type Props = {
  table: CategorySummary
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  selectedCategoryId: string
}

const MenuTableCard = ({
  table,
  onSelect,
  onDelete,
  selectedCategoryId,
}: Props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const isSelected = table.id === selectedCategoryId

  return (
    <div
      onClick={() => onSelect(table.id)}
      className={`group relative flex h-24 max-w-72 min-w-60 flex-1 cursor-pointer items-center justify-between gap-2 rounded-md border p-2 transition-all ${
        isSelected
          ? "border-primary/20 bg-primary/10"
          : "border-gray-300 hover:bg-gray-50"
      } `}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${isSelected ? "bg-primary text-white" : "text-primary bg-gray-100"}`}
      >
        <Grid size={16} className="dark:text-black" />
      </div>
      <div className="text-center">
        <p className="font-medium">{table.name}</p>
        <p className="text-xs text-gray-500">
          {table.productsCount} produto(s)
        </p>
      </div>
      <div className="flex items-center gap-2 transition-opacity group-hover:opacity-100 md:opacity-0">
        <ChevronRight
          size={16}
          className={`${isSelected ? "text-primary" : "text-gray-400"}`}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Renomear
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialogDelete
        isOpen={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title={`${table.name}`}
        onDelete={() => onDelete(table.id)}
      />
    </div>
  )
}

export default MenuTableCard
