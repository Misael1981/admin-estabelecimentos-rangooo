"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface ReportIncidentInput {
  deliveryPersonId: string
  description: string
  orderId?: string
  restaurantId: string
  slug: string
}

export async function reportIncidentAction(data: ReportIncidentInput) {
  try {
    const { deliveryPersonId, description, orderId } = data

    if (!description || description.trim().length < 10) {
      return {
        error: "A descrição do incidente deve ter pelo menos 10 caracteres.",
      }
    }

    await db.deliveryIncident.create({
      data: {
        deliveryPersonId,
        description: description.trim(),
        orderId: orderId || null,
        restaurantId: data.restaurantId,
      },
    })

    revalidatePath(`/${data.slug}/entregadores`)

    return { success: true }
  } catch (error) {
    console.error("Erro ao registrar incidente:", error)
    return { error: "Não foi possível registrar o incidente. Tente novamente." }
  }
}
