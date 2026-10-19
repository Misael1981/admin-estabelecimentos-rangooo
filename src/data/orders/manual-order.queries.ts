import { db } from "@/lib/prisma"
import "server-only"

export async function getManualOrderData(slug: string) {
  try {
    const establishment = await db.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        consumptionMethods: {
          select: {
            id: true,
            isActive: true,
            method: true,
          },
        },
        menuCategories: {
          select: {
            id: true,
            name: true,
            displayOrder: true,
            isDouble: true,
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                imageUrl: true,
                ingredients: true,
                orderItems: {
                  select: {
                    id: true,
                    isDouble: true,
                  },
                },
              },
            },
          },
        },
        orders: {
          select: {
            items: {
              select: {
                id: true,
                isDouble: true,
              },
            },
          },
        },
      },
    })

    if (!establishment) return null

    return {
      ...establishment,
      menuCategories: establishment.menuCategories.map((category) => ({
        ...category,
        products: category.products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        })),
      })),
    }
  } catch (error) {
    console.error("Erro ao buscar dados do estabelecimento:", error)
    return null
  }
}
