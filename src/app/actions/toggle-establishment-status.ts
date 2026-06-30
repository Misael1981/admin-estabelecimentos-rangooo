"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@misael1981/rangooo-database"
import { OrderStatus } from "@misael1981/rangooo-database"
import { updateRestaurantClientCRM } from "./update-restaurant-client"

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

    if (!isOpen) {
      const pendingOrders = await prisma.order.findMany({
        where: {
          restaurantId: id,
          NOT: {
            status: {
              in: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
            },
          },
        },
        select: { id: true },
      })

      if (pendingOrders.length > 0) {
        console.log(
          `[FECHAMENTO_AUTOMATICO]: Encontrados ${pendingOrders.length} pedidos pendentes para o restaurante ${slug}.`,
        )
        const orderIds = pendingOrders.map((o) => o.id)
        await prisma.order.updateMany({
          where: {
            id: { in: orderIds },
          },
          data: {
            status: OrderStatus.DELIVERED,
          },
        })

        await Promise.all(
          orderIds.map((orderId) => updateRestaurantClientCRM(orderId)),
        )

        console.log(
          `[FECHAMENTO_AUTOMATICO]: ${pendingOrders.length} pedidos finalizados e CRM atualizado com sucesso.`,
        )
      }
    }

    revalidatePath(`/${slug}`)
    revalidatePath(`/${slug}/pedidos`)

    return { success: true }
  } catch (error) {
    console.error("Falha ao atualizar status:", error)
    return { success: false, error: "Falha ao atualizar status" }
  }
}
