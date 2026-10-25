import "server-only"

import { DeliveryFees } from "@/dtos/delivery-fees.dto"
import { db } from "@/lib/prisma"

export async function getDeliveryFees(slug: string): Promise<DeliveryFees> {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: {
      useRangoooDelivery: true,
      deliveryAreas: { select: { areaType: true, fee: true } },
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

  return Object.fromEntries(
    restaurant.deliveryAreas.map((a) => [a.areaType, a.fee]),
  )
}
