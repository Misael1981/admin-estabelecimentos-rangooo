"use server"

import {
  ConsumptionMethod,
  PaymentMethod,
  prisma,
} from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

interface UpdateMethodsParams {
  restaurantId: string
  slug: string
  consumptionMethods: ConsumptionMethod[]
  paymentMethods: PaymentMethod[]
}

export async function updateRestaurantMethods({
  restaurantId,
  slug,
  consumptionMethods,
  paymentMethods,
}: UpdateMethodsParams) {
  try {
    await prisma.$transaction([
      prisma.restaurantConsumptionMethod.deleteMany({
        where: { restaurantId },
      }),
      prisma.restaurantConsumptionMethod.createMany({
        data: consumptionMethods.map((method, idx) => ({
          restaurantId,
          method,
          isActive: true,
          displayOrder: idx,
        })),
      }),

      prisma.restaurantPaymentMethod.deleteMany({ where: { restaurantId } }),
      prisma.restaurantPaymentMethod.createMany({
        data: paymentMethods.map((method, idx) => ({
          restaurantId,
          method,
          isActive: true,
          displayOrder: idx,
        })),
      }),
    ])

    revalidatePath(`/${slug}/dashboard/plano-metodos`)

    return { success: true }
  } catch (error) {
    console.error("Erro na Server Action de Métodos:", error)
    return {
      success: false,
      error: "Falha ao atualizar métodos de pagamento e consumo.",
    }
  }
}
