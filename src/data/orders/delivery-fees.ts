import "server-only"
import { db } from "@/lib/prisma"
import { DeliveryFees } from "@/dtos/delivery-fees.dto"

export async function getDeliveryFees(slug: string): Promise<DeliveryFees> {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      useRangoooDelivery: true,
      deliveryAreas: {
        select: {
          areaType: true,
          fee: true,
        },
      },
    },
  })

  if (!restaurant) return {}

  if (restaurant.useRangoooDelivery) {
    const settings = await db.systemSettings.findUnique({
      where: { id: "global" },
    })

    return {
      URBAN: settings?.urbanDeliveryFee ?? 800,
      RURAL: settings?.ruralDeliveryFee ?? 1500,
      DISTRICT: settings?.districtDeliveryFee ?? 1500,
    }
  }

  const areas = await db.deliveryArea.findMany({
    where: { restaurantId: restaurant.id },
    select: { areaType: true, fee: true },
  })

  return Object.fromEntries(areas.map((a) => [a.areaType, a.fee]))
}
