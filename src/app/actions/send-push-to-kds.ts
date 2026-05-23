"use server"

import { db } from "@/lib/prisma"
import webpush from "web-push"

webpush.setVapidDetails(
  "mailto:seu@email.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function sendPushToKDS({
  slug,
  restaurantId,
}: {
  slug: string
  restaurantId: string
}) {
  const subscriptions = await db.restaurantPushSubscription.findMany({
    where: { restaurantId },
  })

  const notifications = subscriptions.map((sub) =>
    webpush
      .sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { auth: sub.auth, p256dh: sub.p256dh },
        },
        JSON.stringify({
          title: "Novo pedido disponível!",
          body: "Toque para ver o pedido",
          url: `https://rangooo-ads.vercel.app/${slug}`,
        }),
      )
      .catch((err) => console.error("Erro ao enviar push:", err)),
  )

  await Promise.all(notifications)
}
