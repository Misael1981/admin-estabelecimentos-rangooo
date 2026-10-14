import { db } from "@/lib/prisma"
import "server-only"

export async function getSubscriptionBySlug(slug: string) {
  try {
    const establishment = await db.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        subscription: {
          select: {
            id: true,
            status: true,
            contractAcceptedAt: true,
            contractVersion: true,
            currentPeriodEnd: true,
            plan: {
              select: {
                name: true,
                price: true,
              },
            },
            receipts: {
              select: {
                dueDate: true,
                status: true,
                amount: true,
                paymentMethod: true,
                notes: true,
              },
            },
          },
        },
      },
    })

    if (!establishment) return null

    return {
      ...establishment,
      subscription: establishment.subscription
        ? {
            ...establishment.subscription,
            plan: {
              ...establishment.subscription.plan,
              price: establishment.subscription.plan.price.toNumber(),
            },
            receipts: establishment.subscription.receipts.map((receipt) => ({
              ...receipt,
              amount: receipt.amount.toNumber(),
            })),
          }
        : null,
    }
  } catch (error) {
    console.error(
      "Erro ao buscar os dados de plano e pagamento do estabelecimento: ",
      error,
    )
    return null
  }
}
