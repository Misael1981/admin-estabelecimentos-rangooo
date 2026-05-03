import { parseAddress } from "@/helpers/parse-address"
import { ConsumptionMethod, prisma } from "@misael1981/rangooo-database"

export async function getOrdersData(slug: string, method?: ConsumptionMethod) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      consumptionMethods: true,
      paymentMethods: true,
      deliveryFee: true,
    },
  })

  if (!restaurant) return null

  // Lógica de Turno (Mantenha a sua ou use a de Brasília que fizemos)
  const now = new Date()
  const cutoffHour = 6
  const startOfShift = new Date(now)
  if (now.getHours() < cutoffHour)
    startOfShift.setDate(startOfShift.getDate() - 1)
  startOfShift.setHours(cutoffHour, 0, 0, 0)
  const endOfShift = new Date(startOfShift)
  endOfShift.setDate(endOfShift.getDate() + 1)

  const orders = await prisma.order.findMany({
    where: {
      restaurantId: restaurant.id,
      consumptionMethod: method,
      status: { not: "CANCELED" },
      createdAt: { gte: startOfShift, lt: endOfShift },
    },
    include: {
      user: { select: { name: true, phone: true } },
      items: {
        include: {
          product: {
            select: {
              name: true,
              menuCategory: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // NORMALIZAÇÃO DIRETO NO SERVER
  const normalizedOrders = orders.map((order) => ({
    id: order.id,
    customerName: order.user?.name ?? "Cliente Final",
    customerPhone: order.user?.phone ?? "",
    totalAmount: Number(order.totalAmount),
    orderNumber: Number(order.orderNumber),
    status: order.status,
    method: order.consumptionMethod,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt.toISOString(),
    address: parseAddress(order.deliveryAddress),
    items: order.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      price: Number(i.priceAtOrder),
      name: i.customName || i.product.name,
      extras: i.extras,
      removedIngredients: i.removedIngredients,
      additionalIngredients: (i.additionalIngredients as string[]) || undefined,
      category: i.product.menuCategory?.name ?? "Geral",
      // SABOR 2:
      isDouble: i.isDouble,
      flavor2Name: i.flavor2Name || undefined,
      flavor2Removed: i.flavor2Removed
        ? JSON.parse(i.flavor2Removed as string)
        : undefined,
      flavor2additionalIngredients:
        (i.flavor2additionalIngredients as string[]) || undefined,
    })),
  }))

  return {
    restaurant: {
      ...restaurant,
      deliveryFee: Number(restaurant.deliveryFee),
    },
    orders: normalizedOrders,
  }
}
