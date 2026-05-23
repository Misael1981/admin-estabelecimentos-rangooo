import { db } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher-server"
import { sendPushToClient } from "@/app/actions/send-push-to-client"
import { sendPushToKDS } from "@/app/actions/send-push-to-kds"

export async function notifyClientAboutOrderUpdate(orderId: string) {
  // Faz a query única aqui
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { userId: true, orderNumber: true, status: true },
  })

  if (!order) return

  await Promise.all([
    pusherServer
      .trigger(`client-${order.userId}`, "order-updated", {
        orderId,
        status: order.status,
        orderNumber: order.orderNumber,
      })
      .catch((err) => console.error("❌ Erro Pusher cliente:", err)),

    sendPushToClient({
      userId: order.userId,
      orderNumber: Number(order.orderNumber),
      status: order.status,
    }).catch((err) => console.error("❌ Erro genérico no Push cliente:", err)),
  ])
}

export async function notifyNewOrder(orderId: string, slug: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      userId: true,
      orderNumber: true,
      status: true,
      restaurantId: true,
    },
  })

  if (!order) return

  const restaurantChannel = `restaurant-${order.restaurantId}`
  const kdsChannel = `kds-${order.restaurantId}`

  const pusherNotification = pusherServer
    .trigger([restaurantChannel, kdsChannel], "order:created", {
      order: {
        id: orderId,
        orderNumber: order.orderNumber,
      },
    })
    .catch((err) => console.error("❌ Erro Pusher:", err))

  const pushKDS = sendPushToKDS({
    slug: slug,
    restaurantId: order.restaurantId,
  })

  const notifications: Promise<unknown>[] = [pusherNotification, pushKDS]

  return Promise.allSettled(notifications)
}
