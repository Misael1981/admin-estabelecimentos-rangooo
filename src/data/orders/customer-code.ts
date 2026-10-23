import type { Prisma } from "@misael1981/rangooo-database"
import "server-only"
// import type { Prisma } from "@prisma/client"

const MIN_CUSTOMER_CODE = 2100

export async function getNextCustomerCode(
  tx: Prisma.TransactionClient,
  restaurantId: string,
) {
  const { _max } = await tx.restaurantCustomer.aggregate({
    where: { restaurantId },
    _max: { customerCode: true },
  })

  return Math.max((_max.customerCode ?? 0) + 1, MIN_CUSTOMER_CODE)
}
