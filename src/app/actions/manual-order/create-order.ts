"use server"

import { db } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import {
  manualOrderSchema,
  ManualOrderFormInput,
} from "@/schemas/manual-order.schemas"
import {
  calculateItemTotal,
  calculateItemsSubtotal,
  calculateOrderTotal,
  PriceCatalog,
} from "@/lib/pricing/order-total"
import { Prisma } from "@misael1981/rangooo-database"
import { getNextCustomerCode } from "@/data/orders/customer-code"
import { generateOrderNumber } from "@/services/order-number.service"
import { AreaType } from "@/constants/enums"
import { getDeliveryFees } from "@/data/orders/delivery-fees"

class OrderError extends Error {}

const onlyDigits = (v: string) => v.replace(/\D/g, "")

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn()
    } catch (e) {
      const conflict =
        e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
      if (!conflict || i >= attempts) throw e
    }
  }
}

export async function createManualOrder(
  slug: string,
  input: ManualOrderFormInput,
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Não autenticado." }

    const parsed = manualOrderSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }
    const data = parsed.data
    const areaType =
      data.consumptionMethod === "DELIVERY"
        ? (data.areaType as AreaType)
        : undefined

    const restaurant = await db.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        deliveryEstimateSettings: { select: { fallbackMinutes: true } },
      },
    })
    if (!restaurant)
      return { success: false, error: "Restaurante não encontrado." }

    //Futuramente
    // TODO: conferir que session.user é dono/funcionário DESTE restaurante
    // await assertCanManageRestaurant(session.user.id, restaurant.id)

    // 1) Catálogo vindo do BANCO (nunca do form)
    const productIds = [
      ...new Set(
        data.items
          .flatMap((i) => [i.productId, i.flavor1Id, i.flavor2Id])
          .filter((id): id is string => !!id),
      ),
    ]
    const extraIds = [
      ...new Set(
        data.items.flatMap((i) =>
          [
            ...i.additionalIngredients,
            ...i.flavor1additionalIngredients,
            ...i.flavor2additionalIngredients,
          ]
            .map((e) => e?.id)
            .filter((id): id is string => !!id),
        ),
      ),
    ]

    const [products, extras] = await Promise.all([
      db.product.findMany({
        where: {
          id: { in: productIds },
          menuCategory: { restaurantId: restaurant.id },
        },
        select: { id: true, name: true, price: true },
      }),
      // TODO: nome do model de adicionais + filtro de ativo/restaurante
      db.additionalIngredient.findMany({
        where: { id: { in: extraIds } },
        select: { id: true, name: true, price: true },
      }),
    ])

    if (
      products.length !== productIds.length ||
      extras.length !== extraIds.length
    ) {
      return { success: false, error: "Item inválido no pedido." }
    }

    const productsById = new Map(products.map((p) => [p.id, p]))
    const extrasById = new Map(
      extras.map((e) => [e.id, { name: e.name, price: Number(e.price) }]),
    )

    const catalog: PriceCatalog = {
      productPrices: new Map(products.map((p) => [p.id, Number(p.price)])),
      additionalPrices: new Map(extras.map((e) => [e.id, Number(e.price)])),
    }

    // 2) Taxa e total
    let deliveryFeeCents = 0
    if (data.consumptionMethod === "DELIVERY") {
      const fees = await getDeliveryFees(slug)
      const fee = fees[data.areaType]
      if (fee === undefined) {
        return { success: false, error: "Não atendemos esta área de entrega." }
      }
      deliveryFeeCents = fee
    }

    const subtotal = calculateItemsSubtotal(data.items, catalog)
    const total = calculateOrderTotal(subtotal, deliveryFeeCents)

    const toExtras = (list: Array<{ id?: string | null }>) =>
      list.flatMap((e) => {
        const id = e?.id
        if (!id) return []
        const extra = extrasById.get(id)
        if (!extra) throw new OrderError("Item inválido no pedido.")
        return [extra]
      })

    // 3) Transaction (com retry em volta)
    const { order, isNewCustomer } = await withRetry(() =>
      db.$transaction(async (tx) => {
        let customerId: string | null = null
        let isNewCustomer = false

        if (data.consumptionMethod !== "DINE_IN") {
          if (data.customerCode) {
            const existing = await tx.restaurantCustomer.findUnique({
              where: {
                restaurantId_customerCode: {
                  restaurantId: restaurant.id,
                  customerCode: data.customerCode,
                },
              },
            })
            if (!existing) throw new OrderError("Cliente não encontrado.")
            customerId = existing.id
          } else {
            const phone = onlyDigits(data.customerPhone)
            const byPhone = await tx.restaurantCustomer.findFirst({
              where: { restaurantId: restaurant.id, phone },
            })

            if (byPhone) {
              customerId = byPhone.id
            } else {
              const created = await tx.restaurantCustomer.create({
                data: {
                  restaurantId: restaurant.id,
                  name: data.customerName,
                  phone,
                  customerCode: await getNextCustomerCode(tx, restaurant.id),
                  addresses:
                    data.consumptionMethod === "DELIVERY"
                      ? {
                          create: {
                            ...data.address,
                            areaType: areaType as AreaType,
                            isDefault: true,
                          },
                        }
                      : undefined,
                },
              })
              customerId = created.id
              isNewCustomer = true
            }
          }
        }

        const orderNumber = await generateOrderNumber(tx, restaurant.id)

        const order = await tx.order.create({
          data: {
            restaurantId: restaurant.id,
            customerId,
            userId: null,
            orderNumber,
            status: "CONFIRMED",
            consumptionMethod: data.consumptionMethod,
            paymentMethod:
              data.consumptionMethod === "DELIVERY" ? data.paymentMethod : null,
            changeAmount:
              data.consumptionMethod === "DELIVERY" &&
              data.paymentMethod === "CASH"
                ? (data.changeAmount ?? null)
                : null,
            notes: data.notes ?? null,
            deliveryFee: deliveryFeeCents / 100,
            totalAmount: total,
            estimatedDeliveryMinutes:
              data.consumptionMethod === "DELIVERY"
                ? (restaurant.deliveryEstimateSettings?.fallbackMinutes ?? 40)
                : null,
            // TODO: igualar ao formato que o Rangooo grava em cada método
            deliveryAddress:
              data.consumptionMethod === "DELIVERY"
                ? { ...data.address, areaType: areaType as AreaType }
                : data.consumptionMethod === "DINE_IN"
                  ? {
                      tableNumber: data.tableNumber,
                      peopleCount: data.peopleCount,
                    }
                  : { pickupTime: data.pickupTime },

            items: {
              create: data.items.map((item) => {
                const unit = calculateItemTotal(
                  { ...item, quantity: 1 },
                  catalog,
                )
                const name = (id?: string | null) =>
                  productsById.get(id ?? "")?.name ?? null

                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  priceAtOrder: unit,
                  customName: item.isDouble
                    ? `½ ${name(item.flavor1Id)} + ½ ${name(item.flavor2Id)}`
                    : name(item.productId),
                  extras: JSON.stringify(
                    item.isDouble ? [] : toExtras(item.additionalIngredients),
                  ),
                  removedIngredients: JSON.stringify(item.removedIngredients),
                  isDouble: item.isDouble,

                  flavor1Id: item.isDouble ? item.flavor1Id : null,
                  flavor1Name: item.isDouble ? name(item.flavor1Id) : null,
                  flavor1Removed: item.isDouble
                    ? JSON.stringify(item.flavor1Removed)
                    : null,
                  flavor1additionalIngredients: item.isDouble
                    ? toExtras(item.flavor1additionalIngredients)
                    : Prisma.JsonNull,

                  flavor2Id: item.isDouble ? item.flavor2Id : null,
                  flavor2Name: item.isDouble ? name(item.flavor2Id) : null,
                  flavor2Removed: item.isDouble
                    ? JSON.stringify(item.flavor2Removed)
                    : null,
                  flavor2additionalIngredients: item.isDouble
                    ? toExtras(item.flavor2additionalIngredients)
                    : Prisma.JsonNull,

                  additionalIngredients: item.isDouble
                    ? Prisma.JsonNull
                    : toExtras(item.additionalIngredients),
                }
              }),
            },
          },
          include: {
            customer: true,
            restaurant: true,
            items: {
              include: { product: { include: { menuCategory: true } } },
            },
          },
        })

        return { order, isNewCustomer }
      }),
    )

    // TODO: waitUntil(processOrderPrinting(...)) e notifyNewOrder
    revalidatePath(`/${slug}/pedidos`)

    return {
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerCode: order.customer?.customerCode ?? null,
        isNewCustomer,
      },
    }
  } catch (error) {
    if (error instanceof OrderError)
      return { success: false, error: error.message }
    console.error("Erro ao criar pedido manual:", error)
    return { success: false, error: "Falha ao criar pedido." }
  }
}
