"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function confirmOrders(orderIds: string[], slug: string) {
  try {
    const updatedOrders = await db.order.updateMany({
      where: {
        id: { in: orderIds },
        status: "PENDING",
      },
      data: { status: "CONFIRMED" },
    })

    if (updatedOrders.count > 0) {
      revalidatePath(`/${slug}/dashboard/pedidos`)
    }

    return { success: true, count: updatedOrders.count }
  } catch (error) {
    console.error("ERRO_ATUALIZAR_STATUS:", error)
    return { success: false, error: "Erro ao atualizar status." }
  }
}
