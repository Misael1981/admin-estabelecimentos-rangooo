import {
  AreaType,
  ConsumptionMethod,
  PaymentMethod,
  PaymentReceiptStatus,
  PlanType,
  prisma,
  SubscriptionStatus,
} from "@misael1981/rangooo-database"

export type EstablishmentPlansMethods = {
  id: string
  name: string
  slug: string
  createdAt: Date
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
  subscription: {
    id: string
    plan: {
      name: string
      price: number
    }
    status: SubscriptionStatus
    currentPeriodEnd: Date
    contractAcceptedAt: Date | null
    contractVersion: string | null
    receipts: {
      status: PaymentReceiptStatus
      dueDate: Date
    }[]
  } | null
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
        createdAt: true,
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
        subscription: {
          select: {
            id: true,
            status: true,
            contractAcceptedAt: true,
            contractVersion: true,
            currentPeriodEnd: true,
            plan: {
              select: {
                name: true,
                price: true,
              },
            },
            receipts: {
              select: {
                dueDate: true,
                status: true,
              },
            },
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
      subscription: establishment.subscription
        ? {
            ...establishment.subscription,
            plan: {
              ...establishment.subscription.plan,
              price: establishment.subscription.plan.price.toNumber(), // 👈 Converte o Decimal do Prisma para number
            },
          }
        : null,
    }
  } catch (err) {
    console.error("Erro ao buscar dados completos:", err)
    return null
  }
}
