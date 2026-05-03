"use server"

import { plansSchema } from "@/schemas/establishments-schemas"
import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"
import z from "zod"

export async function updateRestaurantPlans(
  restaurantId: string,
  formData: z.infer<typeof plansSchema>,
  slug: string,
) {
  try {
    await prisma.$transaction([
      prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          plan: formData.plan,
          useRangoooDelivery: formData.useRangoooDelivery,
        },
      }),

      ...formData.deliveryFees.map((fee) =>
        prisma.deliveryArea.upsert({
          where: {
            restaurantId_areaType: {
              restaurantId,
              areaType: fee.areaType,
            },
          },
          update: { fee: fee.fee },
          create: {
            restaurantId,
            areaType: fee.areaType,
            fee: fee.fee,
          },
        }),
      ),
    ])

    revalidatePath(`/${slug}/plano-metodos`)
    return { success: true }
  } catch (error) {
    console.error("ERRO_AO_SALVAR_PLANO:", error)
    return {
      success: false,
      message: "Erro ao salvar configurações.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
