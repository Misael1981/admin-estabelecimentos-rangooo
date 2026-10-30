import "server-only"

import { db } from "@/lib/prisma"

export async function getDataKds(slug: string) {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { id: true, name: true },
  })

  if (!restaurant) return null

  const [users, stations] = await Promise.all([
    db.kdsUser.findMany({
      where: { restaurantId: restaurant.id },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        active: true,
        pinHash: true,
      },
      orderBy: { name: "asc" },
    }),
    db.kdsStation.findMany({
      where: { restaurantId: restaurant.id },
      select: {
        id: true,
        name: true,
        order: true,
        active: true,
        estimatedMinutes: true,
      },
      orderBy: { order: "asc" },
    }),
  ])

  return { restaurant, users, stations }
}
