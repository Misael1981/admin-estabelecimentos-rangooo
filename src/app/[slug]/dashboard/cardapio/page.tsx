import { getRestaurantMenuBySlug } from "@/data/get-restaurant-menu"
import { MenuCategoryDTO } from "@/dtos/menu.dto"
import HeaderCardapio from "./components/HeaderCardapio"
import ManageMenu from "./components/ManageMenu"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CardapioPage({ params }: PageProps) {
  const { slug } = await params

  const categories = await getRestaurantMenuBySlug(slug)

  if (!categories || categories.length === 0) {
    return <div>O cardápio ainda está sendo montado ou não existe.</div>
  }

  const menuData: MenuCategoryDTO[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    displayOrder: cat.displayOrder,
    productsCount: cat._count.products,

    products: cat.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      ingredients: p.ingredients,
      isVisible: p.isVisible,
    })),

    additionalIngredients: cat.additionalIngredients.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price),
    })),
  }))

  return (
    <div className="space-y-8">
      <HeaderCardapio />

      <ManageMenu menuData={menuData} slug={slug} />
    </div>
  )
}
