import "server-only"

import { db } from "@/lib/prisma"

export async function getManualOrderData(slug: string) {
  try {
    const establishment = await db.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        deliveryFee: true,
        slug: true,
        consumptionMethods: {
          select: {
            id: true,
            isActive: true,
            method: true,
          },
        },
        customers: {
          select: {
            id: true,
            name: true,
            phone: true,
            customerCode: true,
            addresses: {
              select: {
                id: true,
                street: true,
                number: true,
                complement: true,
                neighborhood: true,
                reference: true,
                city: true,
                state: true,
                areaType: true,
              },
            },
          },
        },
        menuCategories: {
          orderBy: [{ displayOrder: "desc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            displayOrder: true,
            isDouble: true,
            additionalIngredients: {
              select: {
                id: true,
                name: true,
                price: true,
                isActive: true,
              },
            },
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
      deliveryFee: establishment.deliveryFee?.toNumber(),
      menuCategories: establishment.menuCategories.map((category) => ({
        ...category,
        products: category.products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        })),
        additionalIngredients: category.additionalIngredients.map((ing) => ({
          ...ing,
          price: ing.price.toNumber(),
        })),
      })),
    }
  } catch (error) {
    console.error("Erro ao buscar dados do estabelecimento:", error)
    return null
  }
}
