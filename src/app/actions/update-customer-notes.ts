"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

interface UpdateCustomerNotesInput {
  customerId: string
  restaurantId: string
  notes: string
  slug: string
}

export async function updateCustomerNotes({
  customerId,
  restaurantId,
  notes,
  slug,
}: UpdateCustomerNotesInput) {
  try {
    if (!customerId || !restaurantId) {
      return { success: false, error: "Dados inválidos para atualização." }
    }

    await prisma.restaurantClient.update({
      where: {
        restaurantId_userId: {
          restaurantId: restaurantId,
          userId: customerId,
        },
      },
      data: {
        internalNotes: notes.trim() || null,
      },
    })

    revalidatePath(`/${slug}/clientes/${customerId}`)
    revalidatePath(`/${slug}/clientes`)

    return { success: true }
  } catch (error) {
    console.error("[UPDATE_CUSTOMER_NOTES_ERROR]:", error)
    return { success: false, error: "Erro interno ao salvar as anotações." }
  }
}
