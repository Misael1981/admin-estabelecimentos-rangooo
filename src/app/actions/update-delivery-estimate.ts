"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { deliveryEstimateSchema } from "@/schemas/delivery-estimate-settings-schemas"
import { revalidatePath } from "next/cache"

export async function updateDeliveryEstimate(params: {
  restaurantId: string
  slug: string
  values: unknown
}) {
  const { restaurantId, slug, values } = params

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { success: false, error: "Não autenticado." }
  }

  const ownsRestaurant = await db.restaurant.findFirst({
    where: {
      id: restaurantId,
      slug: slug,
      ownerId: session.user.id,
    },
    select: { id: true },
  })

  if (!ownsRestaurant && session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Acesso não autorizado a este restaurante.",
    }
  }

  const parsed = deliveryEstimateSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." }
  }

  await db.deliveryEstimateSettings.upsert({
    where: { restaurantId },
    create: { restaurantId, ...parsed.data },
    update: { ...parsed.data },
  })

  revalidatePath(`/${slug}/dashboard/pedidos`)

  return { success: true }
}
