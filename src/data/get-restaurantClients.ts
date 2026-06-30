import { prisma } from "@misael1981/rangooo-database"

interface GetRestaurantClientsInput {
  slug: string
  page?: number
  limit?: number
  search?: string
}

export async function getRestaurantClients({
  slug,
  page = 1,
  limit = 10,
  search = "",
}: GetRestaurantClientsInput) {
  try {
    const skip = (page - 1) * limit

    // Busca os vínculos filtrando pelo SLUG do restaurante em uma única query
    const [clients, totalCount] = await prisma.$transaction([
      // Query 1: Busca os clientes paginados e filtrados
      prisma.restaurantClient.findMany({
        where: {
          restaurant: {
            slug: slug,
          },
          user: {
            // Se houver termo de busca, filtra por nome, email ou telefone (ignora maiúsculas/minúsculas)
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
        },
        orderBy: {
          totalOrders: "desc", // Já traz ordenado por quem pede mais (Top Clientes)!
        },
        skip: skip,
        take: limit,
      }),

      // Query 2: Conta o total de clientes (essencial para os botões de Avançar/Voltar da paginação)
      prisma.restaurantClient.count({
        where: {
          restaurant: {
            slug: slug,
          },
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    const formattedClients = clients.map((client) => ({
      ...client,
      totalSpent: client.totalSpent.toNumber(),
    }))

    return {
      clients: formattedClients,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  } catch (error) {
    console.error("[GET_RESTAURANT_CLIENTS_ERROR]:", error)
    throw new Error("Falha ao buscar clientes do estabelecimento.")
  }
}
