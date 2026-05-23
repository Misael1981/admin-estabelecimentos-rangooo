"use server"

import { STATUS_CONFIGS } from "@/constants/maps-options"
import { db } from "@/lib/prisma"
import webpush from "web-push"

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

interface SendPushArgs {
  userId: string
  orderNumber: number
  status: string
}

export async function sendPushToClient({
  userId,
  orderNumber,
  status,
}: SendPushArgs) {
  const subscriptions = await db.clientPushSubscription.findMany({
    where: { userId },
  })

  if (!subscriptions.length) return

  const currentStatus = STATUS_CONFIGS[status as keyof typeof STATUS_CONFIGS]

  const notifications = subscriptions.map(
    (sub: { id: string; endpoint: string; auth: string; p256dh: string }) =>
      webpush
        .sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { auth: sub.auth, p256dh: sub.p256dh },
          },
          JSON.stringify({
            title: `Pedido #${orderNumber} atualizado!`,
            body: `Seu pedido está: ${currentStatus.label}. Toque para acompanhar.`,
            url: `https://rangooo.vercel.app/meus-pedidos`,
          }),
        )
        .catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log(
              `🧹 Limpando subscription expirada do usuário ${userId}`,
            )
            await db.clientPushSubscription
              .delete({
                where: { id: sub.id },
              })
              .catch(() => null)
          } else {
            console.error("❌ Erro ao enviar push:", err)
          }
        }),
  )

  await Promise.all(notifications)
}
