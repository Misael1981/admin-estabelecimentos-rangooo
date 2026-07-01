import { prisma } from "@misael1981/rangooo-database"

interface GetCustomerDetailsInput {
  slug: string
  customerId: string
}

export async function getCustomerDetails({
  slug,
  customerId,
}: GetCustomerDetailsInput) {
  try {
    // Busca o vínculo do cliente com o restaurante usando o slug como barreira de segurança
    const customerProfile = await prisma.restaurantClient.findFirst({
      where: {
        userId: customerId,
        restaurant: {
          slug: slug,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
    })

    // Se o cliente não tiver vínculo com esse restaurante, bloqueia o acesso
    if (!customerProfile) return null

    // Busca o histórico de pedidos desse cliente especificamente NESTE restaurante
    const orders = await prisma.order.findMany({
      where: {
        userId: customerId,
        restaurant: {
          slug: slug,
        },
      },
      orderBy: {
        createdAt: "desc", // Mais recentes primeiro
      },
      take: 5,
    })

    const formattedProfile = {
      ...customerProfile,
      totalSpent: customerProfile.totalSpent.toNumber(), // Transforma o Decimal em number puro do JS
    }

    const formattedOrders = orders.map((order) => ({
      ...order,
      deliveryFee: order.deliveryFee ? Number(order.deliveryFee) : null,
      totalAmount: order.totalAmount ? Number(order.totalAmount) : null,
    }))

    return {
      profile: formattedProfile,
      orders: formattedOrders,
    }
  } catch (error) {
    console.error("[GET_CUSTOMER_DETAILS_ERROR]:", error)
    throw new Error("Erro ao carregar dados do cliente.")
  }
}
