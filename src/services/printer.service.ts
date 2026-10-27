import { OrderForPrinting } from "@/app/actions/manual-order/create-order"
import { parseJsonArray } from "@/helpers/parse-json-array"
import { sendOrderToPrint } from "@/lib/printer/send-order-to-print"
import { db } from "@/lib/prisma"

type OrderExtraDTO = {
  id?: string
  name?: string
  title?: string
  price?: number
}

export async function processOrderPrinting(order: OrderForPrinting) {
  try {
    const printData = {
      id: order.id,
      restaurantName: order.restaurant.name,
      number: `#${String(order.orderNumber).padStart(2, "0")}`,
      customerName: order.customer?.name || "Cliente",
      customerPhone: order.customer?.phone || "",
      method: order.consumptionMethod,
      deliveryFee: Number(order.deliveryFee),
      payment: order.paymentMethod,
      items: order.items.map((item) => mapPrinterItem(item)),
      total: Number(order.totalAmount),
      details: order.deliveryAddress,
    }

    // Log para Debug
    console.log(
      "DADOS ENVIADOS PARA O ELECTRON:",
      JSON.stringify(printData, null, 2),
    )

    // Lógica de Timeout e Envio
    let timeoutId: NodeJS.Timeout
    const timeoutPromise = new Promise(
      (_, reject) =>
        (timeoutId = setTimeout(
          () => reject(new Error("Timeout Impressora")),
          15000,
        )),
    )

    // Executa a corrida
    const printId = await Promise.race([
      sendOrderToPrint(order.restaurantId, printData),
      timeoutPromise,
    ]).finally(() => clearTimeout(timeoutId)) // Limpa o timer para não prender processo no Render

    if (printId) {
      console.log(
        `✅ Pedido ${printData.number} enviado e confirmado pelo Electron. ID: ${printId}`,
      )

      await db.order.update({
        where: { id: order.id },
        data: { printId: printId as string },
      })
      return { success: true, printId }
    }

    return { success: false, error: "Nenhum ID de impressão retornado" }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.warn(
      `⚠️ Falha na impressora (#${order.orderNumber}):`,
      errorMessage,
    )
    return { success: false, error: errorMessage }
  }
}

function mapPrinterItem(item: OrderForPrinting["items"][number]) {
  let flavor1Info = null
  let flavor2Info = null

  if (item.isDouble) {
    if (item.flavor1Name) {
      const f1Extras = Array.isArray(item.flavor1additionalIngredients)
        ? (item.flavor1additionalIngredients as OrderExtraDTO[])
            .map((e) => e.name || e.title)
            .filter((e): e is string => !!e)
        : []

      flavor1Info = {
        name: item.flavor1Name,
        extras: f1Extras,
        removed: parseJsonArray<string>(item.flavor1Removed),
      }
    }

    if (item.flavor2Name) {
      const f2Extras = Array.isArray(item.flavor2additionalIngredients)
        ? (item.flavor2additionalIngredients as OrderExtraDTO[])
            .map((e) => e.name || e.title)
            .filter((e): e is string => !!e)
        : []

      flavor2Info = {
        name: item.flavor2Name,
        extras: f2Extras,
        removed: parseJsonArray<string>(item.flavor2Removed),
      }
    }
  } else {
    // ITEM DE SABOR ÚNICO — o que estava faltando
    const simpleExtras = parseJsonArray<OrderExtraDTO>(item.extras)
      .map((e) => e.name || e.title)
      .filter((e): e is string => !!e)

    const simpleRemoved = parseJsonArray<string>(item.removedIngredients)

    flavor1Info = {
      name: item.customName,
      extras: simpleExtras,
      removed: simpleRemoved,
    }
  }

  return {
    name: item.customName,
    category: item.product?.menuCategory?.name || "Geral",
    quantity: item.quantity,
    price: Number(item.priceAtOrder),

    isDouble: item.isDouble,
    flavor1: flavor1Info,
    flavor2: flavor2Info,
  }
}
