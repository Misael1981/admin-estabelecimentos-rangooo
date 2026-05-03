"use server"

import { db } from "@/lib/prisma"
import { OrderStatus } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  slug: string,
) {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { status },
      select: { id: true },
    })

    revalidatePath(`/${slug}/dashboard/pedidos`)

    return { success: true }
  } catch (error) {
    console.error("ERRO_ATUALIZAR_STATUS:", error)
    return { success: false, error: "Erro ao atualizar status." }
  }
}
