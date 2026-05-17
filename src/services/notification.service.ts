import { db } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher-server"
import { sendPushToClient } from "@/app/actions/send-push-to-client"

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
