import { prisma } from "@misael1981/rangooo-database"

export const getRestaurantMenuBySlug = async (slug: string) => {
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
