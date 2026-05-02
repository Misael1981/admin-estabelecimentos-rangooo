import { prisma } from "@misael1981/rangooo-database"

/**
 * Função para buscar os dados do restaurante e pedidos do turno atual.
 * Implementa a lógica de corte às 06:00 da manhã para delivery.
 */
export async function getRestaurantDashboardData(slug: string) {
  function getBrasiliaDate() {
    const now = new Date()
    const spDateString = now.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    })

    const [date, time] = spDateString.split(", ")
    const [day, month, year] = date.split("/")
    const [hour, minute, second] = time.split(":")

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    )
  }

  const now = getBrasiliaDate()
  const cutoffHour = 6

  const startOfShift = new Date(now)
  if (now.getHours() < cutoffHour) {
    startOfShift.setDate(startOfShift.getDate() - 1)
  }
  startOfShift.setHours(cutoffHour, 0, 0, 0)

  const endOfShift = new Date(startOfShift)
  endOfShift.setDate(endOfShift.getDate() + 1)

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      isOpen: true,
      slug: true,
      orders: {
        where: {
          status: { not: "CANCELED" },
          createdAt: {
            gte: startOfShift,
            lt: endOfShift,
          },
        },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          consumptionMethod: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  return restaurant
}
