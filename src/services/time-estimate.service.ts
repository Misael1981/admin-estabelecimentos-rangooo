import { db } from "@/lib/prisma"
import { MovementLevel } from "@misael1981/rangooo-database"

const MOVEMENT_MULTIPLIERS: Record<MovementLevel, number> = {
  LOW: 0.8,
  NORMAL: 1.0,
  HIGH: 1.25,
}

export async function getAutomaticDeliveryEstimate(
  restaurantId: string,
): Promise<number> {
  const settings = await db.deliveryEstimateSettings.findUnique({
    where: { restaurantId },
  })

  if (!settings) {
    return 40
  }

  if (settings.mode === "FIXED") {
    return settings.fallbackMinutes
  }

  const lastOrders = await db.order.findMany({
    where: {
      restaurantId,
      status: "DELIVERED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: settings.sampleSize,
    select: {
      createdAt: true,
      updatedAt: true,
    },
  })

  if (lastOrders.length === 0) {
    return settings.fallbackMinutes + settings.manualAdjustment
  }

  const totalMinutes = lastOrders.reduce((acc, order) => {
    const diffInMs = order.updatedAt.getTime() - order.createdAt.getTime()
    const diffInMinutes = Math.round(diffInMs / 1000 / 60)
    return acc + diffInMinutes
  }, 0)

  const averageMinutes = totalMinutes / lastOrders.length

  const multiplier = MOVEMENT_MULTIPLIERS[settings.movementLevel] || 1.0

  let finalEstimate = (averageMinutes + settings.manualAdjustment) * multiplier

  finalEstimate = Math.max(10, Math.round(finalEstimate))

  return finalEstimate
}
