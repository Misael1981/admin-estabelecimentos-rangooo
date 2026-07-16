import { db } from "@/lib/prisma"

export async function getEstablishmentForPlan(slug: string) {
  try {
    const establishment = await db.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        plan: true,
        useRangoooDelivery: true,
        deliveryAreas: {
          select: {
            areaType: true,
            fee: true,
          },
        },
      },
    })

    if (!establishment) return null

    const settings = await db.systemSettings.findUnique({
      where: { id: "global" },
    })

    return {
      ...establishment,
      systemSettings: settings
        ? {
            URBAN: settings.urbanDeliveryFee,
            RURAL: settings.ruralDeliveryFee,
            DISTRICT: settings.districtDeliveryFee,
          }
        : null,
    }
  } catch (err) {
    console.error("Erro ao buscar estabelecimento:", err)
    return null
  }
}
