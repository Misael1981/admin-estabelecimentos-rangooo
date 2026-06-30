"use server"

import { db } from "@/lib/prisma"

export async function updateRestaurantClientCRM(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: {
        userId: true,
        restaurantId: true,
        totalAmount: true,
      },
    })

    if (!order) {
      console.error(`[CRM_ERROR]: Pedido ${orderId} não encontrado.`)
      return { success: false }
    }

    await db.restaurantClient.upsert({
      where: {
        restaurantId_userId: {
          restaurantId: order.restaurantId,
          userId: order.userId,
        },
      },
      update: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: order.totalAmount },
      },
      create: {
        restaurantId: order.restaurantId,
        userId: order.userId,
        totalOrders: 1,
        totalSpent: order.totalAmount,
      },
    })

    return { success: true }
  } catch (error) {
    console.error(
      "[CRM_ERROR]: Erro ao atualizar perfil do cliente no restaurante:",
      error,
    )
    return { success: false }
  }
}
