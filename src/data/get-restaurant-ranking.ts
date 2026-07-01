import { prisma } from "@misael1981/rangooo-database"

interface GetRestaurantRankingInput {
  slug: string
  month: string
  year: string
}

export async function getRestaurantRanking({
  slug,
  month,
  year,
}: GetRestaurantRankingInput) {
  try {
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`)
    const nextMonth = Number(month) === 12 ? 1 : Number(month) + 1
    const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year)
    const endDate = new Date(
      `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00Z`,
    )

    const ordersGrouped = await prisma.order.groupBy({
      by: ["userId"],
      where: {
        restaurant: {
          slug: slug,
        },
        status: "DELIVERED",
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        _sum: {
          totalAmount: "desc", // O pódio é definido por quem gastou mais!
        },
      },
      take: 10,
    })

    if (ordersGrouped.length === 0) return []

    const userIds = ordersGrouped.map((item) => item.userId)
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    })

    const ranking = ordersGrouped.map((item, index) => {
      const userDetails = users.find((u) => u.id === item.userId)
      return {
        position: index + 1,
        userId: item.userId,
        name: userDetails?.name || "Cliente Sem Nome",
        image: userDetails?.image,
        totalOrders: item._count.id,
        totalSpent: Number(item._sum.totalAmount) || 0,
      }
    })

    return ranking
  } catch (error) {
    console.error("[GET_RESTAURANT_RANKING_ERROR]:", error)
    return []
  }
}
