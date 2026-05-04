"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useRef } from "react"
import { createCategory, deleteCategory } from "@/app/actions/create-category"
import MenuTableCard from "../MenuTableCard"

type CategorySummary = {
  id: string
  name: string
  productsCount: number
}

type Props = {
  categories: CategorySummary[]
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  selectedCategoryId: string
  slug: string
}

const MenuCategoriesList = ({
  categories,
  onSelect,
  onDelete,
  selectedCategoryId,
  slug,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddCategory = async () => {
    const name = inputRef.current?.value

    if (!name || name.trim().length < 3) {
      return toast.error("O nome da tabela deve ter pelo menos 3 caracteres.")
    }

    try {
      const result = await createCategory({
        name,
        slug,
      })

      if (result.success) {
        toast.success("Tabela criada com sucesso!")
        if (inputRef.current) inputRef.current.value = "" // Limpa o campo
      } else {
        toast.error(result.error || "Erro ao criar categoria.")
      }
    } catch (error) {
      toast.error("Erro crítico de conexão.")
      console.error("Erro ao criar categoria:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const result = await deleteCategory(id, slug)

      if (result.success) {
        toast.success("Tabela excluída com sucesso!")
        onDelete(id)
      } else {
        toast.error(result.error || "Erro ao excluir categoria.")
      }
    } catch (error) {
      toast.error("Erro crítico de conexão.")
      console.error("Erro ao excluir categoria:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">Tabelas</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Crie, exclua ou edite as tabelas em que serão exibidos seus
            produtos.
          </CardDescription>
        </div>
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/10">
            {categories.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {categories.map((cat) => (
            <MenuTableCard
              key={cat.id}
              table={cat}
              onSelect={onSelect}
              onDelete={handleDeleteCategory}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 border-t pt-6 md:flex-row">
        <Input ref={inputRef} placeholder="Ex: Pizzas, Bebidas, Promoções..." />
        <div className="w-full">
          <Button onClick={handleAddCategory} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Tabela
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MenuCategoriesList
