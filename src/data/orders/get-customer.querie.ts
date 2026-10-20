import "server-only"

import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/rangooo-database"

type Props = {
  restaurantId: string
  name?: string
  customerCode?: number
}

export async function searchCustomers({
  restaurantId,
  name,
  customerCode,
}: Props) {
  try {
    const trimmedName = name?.trim()

    const filters: Prisma.RestaurantCustomerWhereInput[] = []

    if (trimmedName) {
      filters.push({ name: { contains: trimmedName, mode: "insensitive" } })
    }

    if (customerCode !== undefined && !Number.isNaN(customerCode)) {
      filters.push({ customerCode })
    }

    if (filters.length === 0) return []

    return await db.restaurantCustomer.findMany({
      where: {
        restaurantId,
        OR: filters,
      },
      include: { addresses: true },
      orderBy: { name: "asc" },
      take: 10,
    })
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }
}
