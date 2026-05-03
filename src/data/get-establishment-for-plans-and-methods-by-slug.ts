import {
  AreaType,
  ConsumptionMethod,
  PaymentMethod,
  PlanType,
  prisma,
} from "@misael1981/rangooo-database"

export type EstablishmentPlansMethods = {
  id: string
  name: string
  slug: string
  plan: PlanType
  useRangoooDelivery: boolean
  deliveryAreas: {
    areaType: AreaType
    fee: number
  }[]
  systemSettings: {
    URBAN: number
    RURAL: number
    DISTRICT: number
  } | null
  consumptionMethods: {
    method: ConsumptionMethod
  }[]
  paymentMethods: {
    method: PaymentMethod
  }[]
}

export async function getEstablishmentForPlansAndMethodsBySlug(
  slug: string,
): Promise<EstablishmentPlansMethods | null> {
  try {
    const establishment = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        useRangoooDelivery: true,
        deliveryAreas: {
          select: {
            areaType: true,
            fee: true,
          },
        },
        consumptionMethods: {
          select: {
            method: true,
          },
        },
        paymentMethods: {
          select: {
            method: true,
          },
        },
      },
    })

    if (!establishment) return null

    const settings = await prisma.systemSettings.findUnique({
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
    console.error("Erro ao buscar dados completos:", err)
    return null
  }
}
