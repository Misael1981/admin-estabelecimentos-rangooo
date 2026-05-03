import { prisma } from "@misael1981/rangooo-database"

export async function getOpeningHoursBySlug(slug: string) {
  const establishment = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      businessHours: {
        orderBy: {
          dayOfWeek: "asc",
        },
        select: {
          id: true,
          dayOfWeek: true,
          timeSlots: true,
          isClosed: true,
        },
      },
    },
  })

  return establishment
}
