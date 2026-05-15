import { Prisma, prisma } from "@misael1981/rangooo-database"

export type RestaurantMenuCategory = Prisma.MenuCategoryGetPayload<{
  include: {
    _count: { select: { products: true } }
    products: {
      select: {
        id: true
        name: true
        price: true
        imageUrl: true
        description: true
        ingredients: true
        isVisible: true
      }
    }
    additionalIngredients: true
  }
}>

export type RestaurantMenuProduct = Prisma.ProductGetPayload<{
  select: {
    id: true
    name: true
    price: true
    imageUrl: true
    description: true
    ingredients: true
    isVisible: true
  }
}>

export type RestaurantMenuAdditionalIngredient =
  Prisma.AdditionalIngredientGetPayload<{
    select: {
      id: true
      name: true
      price: true
    }
  }>

export const getRestaurantMenuBySlug = async (
  slug: string,
): Promise<RestaurantMenuCategory[]> => {
  return await prisma.menuCategory.findMany({
    where: {
      restaurant: { slug },
    },
    include: {
      _count: {
        select: { products: true },
      },
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          description: true,
          ingredients: true,
          isVisible: true,
        },
        orderBy: { name: "asc" },
      },
      additionalIngredients: true,
    },
    orderBy: { displayOrder: "asc" },
  })
}
