import { Prisma } from "@misael1981/rangooo-database"
import { toZonedTime } from "date-fns-tz"

export async function generateOrderNumber(
  tx: Prisma.TransactionClient,
  restaurantId: string,
) {
  const timeZone = "America/Sao_Paulo"

  const now = toZonedTime(new Date(), timeZone)

  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const currentDay = now.getDate()

  const ordersToday = await tx.order.count({
    where: {
      restaurantId: restaurantId,
      createdAt: { gte: startOfDay },
    },
  })

  return currentDay * 100 + (ordersToday + 1)
}
