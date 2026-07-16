import { db } from "@/lib/prisma"

export async function getDeliveryPersonnelOnline() {
  try {
    const deliveryPersonnel = await db.deliveryPerson.findMany({
      where: {
        isOnline: true,
        status: "ACTIVE",
      },
      select: {
        id: true,
        isOnline: true,
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
        deliveryIncidents: {
          select: {
            id: true,
            description: true,
            createdAt: true,
            restaurantId: true,
            restaurant: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return deliveryPersonnel
  } catch (error) {
    console.error("Erro ao buscar entregadores online:", error)
    return null
  }
}
