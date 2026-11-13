import { db } from "@/lib/prisma"
import "server-only"

interface GetCustomersProps {
  slug: string
  page?: number
  limit?: number
  search?: string
}

export async function getCustomers({
  slug,
  page = 1,
  limit = 10,
  search = "",
}: GetCustomersProps) {
  try {
    const skip = (page - 1) * limit

    const where = {
      restaurant: {
        slug,
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          ...(Number.isInteger(Number(search))
            ? [{ customerCode: Number(search) }]
            : []),
        ],
      }),
    }

    const [customers, total] = await db.$transaction([
      db.restaurantCustomer.findMany({
        where,
        select: {
          id: true,
          name: true,
          customerCode: true,
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      }),

      db.restaurantCustomer.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      customers,
      meta: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  } catch (error) {
    console.error("[GET_RESTAURANT_CLIENTS_ERROR]:", error)
    throw new Error("Falha ao buscar clientes do estabelecimento.")
  }
}
