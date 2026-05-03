import { prisma } from "@misael1981/rangooo-database"

export async function getRestaurantForPerfil(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      avatarImageUrl: true,
      coverImageUrl: true,
      socialMedia: true,
      street: true,
      number: true,
      complement: true,
      neighborhood: true,
      city: true,
      state: true,
      zipCode: true,
      description: true,
      category: true,
      contacts: {
        select: { type: true, number: true, isPrimary: true },
        orderBy: { isPrimary: "desc" },
      },
      businessHours: {
        select: { dayOfWeek: true, timeSlots: true, isClosed: true },
      },
      menuCategories: {
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      },
    },
  })

  if (!restaurant) {
    return null
  }

  return restaurant
}
