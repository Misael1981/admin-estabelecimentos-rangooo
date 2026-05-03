"use server"

import { BusinessHoursFormData } from "@/schemas/establishments-schemas"
import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

export async function updateBusinessHours(
  slug: string,
  businessHoursData: BusinessHoursFormData,
  restaurantId: string,
) {
  try {
    await prisma.$transaction([
      prisma.businessHours.deleteMany({
        where: { restaurantId },
      }),

      prisma.businessHours.createMany({
        data: businessHoursData.businessHours.map((bh) => ({
          restaurantId,
          dayOfWeek: bh.dayOfWeek,
          timeSlots: bh.timeSlots,
          isClosed: bh.isClosed,
          displayOrder: bh.dayOfWeek,
        })),
      }),
    ])

    revalidatePath(`/${slug}/dashboard/horarios-funcionamento`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar horários:", error)
    return {
      success: false,
      error: "Falha ao salvar os horários de funcionamento.",
    }
  }
}
