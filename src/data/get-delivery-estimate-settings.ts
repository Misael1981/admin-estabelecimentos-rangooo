import { db } from "@/lib/prisma"

export async function getDeliveryEstimateSettings(restaurantId: string) {
  try {
    const deliveryEstimate = db.deliveryEstimateSettings.findUnique({
      where: { restaurantId },
    })

    return deliveryEstimate
  } catch (err) {
    console.error("Erro ao buscar dados: ", err)
    return null
  }
}
