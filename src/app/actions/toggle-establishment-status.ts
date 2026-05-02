"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@misael1981/rangooo-database"

export async function toggleEstablishmentStatus(
  id: string,
  isOpen: boolean,
  slug: string,
) {
  try {
    await prisma.restaurant.update({
      where: { id },
      data: { isOpen },
    })

    revalidatePath(`/${slug}`)

    return { success: true }
  } catch (error) {
    console.error("Falha ao atualizar status:", error)
    return { success: false, error: "Falha ao atualizar status" }
  }
}
