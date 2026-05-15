import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  MenuCategoryWithProductsDTO,
  MenuProductWithCategoryDTO,
} from "@/dtos/menu.dto"
import { formatCurrency } from "@/helpers/format-currency"
import {
  ChevronDown,
  ChevronUp,
  CirclePlus,
  Edit,
  Eye,
  EyeOff,
  Search,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { deleteProduct } from "@/app/actions/upsert-product"
import { toggleProductVisibility } from "@/app/actions/toggle-product-visibility"
import DialogAddProduct from "../DialogAddProduct"

type ProductsListSessionProps = {
  selectedProductsCategory: MenuCategoryWithProductsDTO | null
  slug: string
}

const ProductsListSession = ({
  selectedProductsCategory,
  slug,
}: ProductsListSessionProps) => {
  const [showList, setShowList] = useState(false)
  const [dialogAddProductOpen, setDialogAddProductOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] =
    useState<MenuProductWithCategoryDTO | null>(null)
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        selectedProductsCategory?.products.map((p) => [p.id, p.isVisible]) ??
          [],
      ),
  )

  if (!selectedProductsCategory) {
    return null
  }

  console.log("Produtos selecionados: ", selectedProductsCategory.products)

  const filteredProducts = selectedProductsCategory.products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleToggleVisibility = async (id: string) => {
    const newValue = !visibilityMap[id]

    setVisibilityMap((prev) => ({ ...prev, [id]: newValue }))

    const result = await toggleProductVisibility(id, newValue, slug)

    if (result.success) {
      toast.success("Produto atualizado com sucesso!")
    } else {
      setVisibilityMap((prev) => ({ ...prev, [id]: !newValue }))
      toast.error("Erro ao atualizar visibilidade.")
    }
  }

  const handleEditProduct = (product: MenuProductWithCategoryDTO) => {
    setSelectedProduct(product)
    setDialogAddProductOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const result = await deleteProduct(id, slug)
      if (result.success) {
        toast.success("Produto removido com sucesso!")
      } else {
        toast.error(result.error)
      }
    }
  }

  return (
    <section>
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="flex flex-col items-center justify-center gap-2 space-y-0 lg:flex-row lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">
              Produtos da Tabela -{" "}
              <span className="text-primary">
                {selectedProductsCategory.name}
              </span>
            </CardTitle>
            <CardDescription className="text-center">
              Adicione, exclua ou edite produtos da tabela.
            </CardDescription>
          </div>
          <Button onClick={() => setDialogAddProductOpen(true)}>
            <CirclePlus size={16} />
            Adicionar Produto
          </Button>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="flex w-full max-w-lg items-center justify-center gap-2">
            <Input
              placeholder="Buscar produto"
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button>
              <Search size={16} />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowList((prev) => !prev)}
            className="text-muted-foreground hover:text-primary"
          >
            {showList ? (
              <ChevronUp className="mr-2" size={16} />
            ) : (
              <ChevronDown className="mr-2" size={16} />
            )}
            {showList
              ? "Ocultar Lista"
              : `Ver Lista (${selectedProductsCategory.products.length})`}
          </Button>
          {showList && (
            <ul className="animate-in fade-in slide-in-from-top-2 w-full max-w-md space-y-2 duration-300">
              {filteredProducts.map((p) => (
                <li
                  key={p.id}
                  className="group bg-card hover:border-primary/50 flex items-center justify-between gap-6 rounded-md border p-3 transition-all"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-xs font-semibold text-green-600">
                      {formatCurrency(p.price)}
                    </span>
                  </div>
                  <div className="flex gap-1 transition-opacity group-hover:opacity-100 sm:opacity-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 transition-transform hover:scale-110"
                      onClick={() => handleToggleVisibility(p.id)}
                    >
                      {visibilityMap[p.id] ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProduct(p)}
                      className="h-8 w-8 transition-transform hover:scale-110"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </li>
              ))}

              {filteredProducts.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  Nenhum produto encontrado.
                </p>
              )}
            </ul>
          )}
        </CardFooter>
      </Card>
      <DialogAddProduct
        dialogAddProductOpen={dialogAddProductOpen}
        setDialogAddProductOpen={setDialogAddProductOpen}
        product={selectedProduct}
        selectedCategoryName={selectedProductsCategory.name}
        selectedCategoryId={selectedProductsCategory.id}
        slug={slug}
      />
    </section>
  )
}

export default ProductsListSession
