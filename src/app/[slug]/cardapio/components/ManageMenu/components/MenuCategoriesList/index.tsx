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
import { useState } from "react"
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/actions/create-category"
import MenuTableCard from "../MenuTableCard"
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

type CategorySummary = {
  id: string
  name: string
  isDouble: boolean
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
  const [name, setName] = useState("")
  const [isDouble, setIsDouble] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const isEditing = editingId !== null

  const resetForm = () => {
    setName("")
    setIsDouble(false)
    setEditingId(null)
  }

  const handleEdit = (table: CategorySummary) => {
    setEditingId(table.id)
    setName(table.name)
    setIsDouble(table.isDouble)
  }

  const handleSubmit = async () => {
    if (name.trim().length < 3) {
      return toast.error("O nome da tabela deve ter pelo menos 3 caracteres.")
    }

    try {
      const result = isEditing
        ? await updateCategory({ id: editingId, name, isDouble, slug })
        : await createCategory({ name, isDouble, slug })

      if (result.success) {
        toast.success(
          isEditing ? "Tabela atualizada!" : "Tabela criada com sucesso!",
        )
        resetForm()
      } else {
        toast.error(result.error || "Erro ao salvar tabela.")
      }
    } catch (error) {
      toast.error("Erro crítico de conexão.")
      console.error(error)
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
              onEdit={handleEdit}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          placeholder="Ex: Pizzas, Bebidas, Promoções..."
        />

        <Field orientation="horizontal" className="w-1/3">
          <Switch
            id="isDouble"
            checked={isDouble}
            onCheckedChange={setIsDouble}
          />
          <FieldLabel htmlFor="isDouble">Incluir 2 sabores</FieldLabel>
        </Field>

        <div className="flex w-full gap-2">
          {isEditing && (
            <Button variant="outline" onClick={resetForm} className="flex-1">
              Cancelar
            </Button>
          )}
          <Button onClick={handleSubmit} className="flex-1">
            {!isEditing && <PlusCircle className="mr-2 h-4 w-4" />}
            {isEditing ? "Salvar alterações" : "Nova Tabela"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MenuCategoriesList
