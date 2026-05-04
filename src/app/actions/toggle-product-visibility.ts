"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

export async function toggleProductVisibility(
  productId: string,
  isVisible: boolean,
  slug: string,
) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isVisible },
      select: { id: true },
    })

    revalidatePath(`/${slug}/dashboard/cardapio`)
    return { success: true }
  } catch (error) {
    console.error("ERRO_TOGGLE_VISIBILIDADE:", error)
    return { success: false }
  }
}
