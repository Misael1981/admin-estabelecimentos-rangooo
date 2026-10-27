import WebSocket from "ws"
import { db } from "../prisma"
const { default: WebSocketNode } = await import("ws")

/* ---------------- Types ---------------- */
type PrintOrderItem = {
  name?: string | null
  category?: string
  quantity: number
  price: number
  extras?: string[]
}

export type PrintOrderPayload = {
  id: string
  restaurantName: string
  number: string
  customerName: string
  customerPhone: string
  method: string
  items: PrintOrderItem[]
  total: number
  details?: unknown
}

/* ---------------- Server Print Sender ---------------- */

export async function sendOrderToPrint(
  restaurantId: string,
  orderData: PrintOrderPayload,
  attempt = 1,
  printId: string | null = null,
): Promise<string | null> {
  if (typeof window !== "undefined") return null

  try {
    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
      select: { printingToken: true, name: true, printerStatus: true },
    })

    if (
      !restaurant?.printingToken ||
      restaurant.printerStatus !== "connected"
    ) {
      console.warn(
        `⚠️ Impressora do ${restaurant?.name || restaurantId} offline`,
      )
      return null
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SAAS_WS_URL ||
      "wss://rangooo-ws-server.onrender.com"
    const wsUrl = `${baseUrl}?token=${process.env.WS_SECRET}&restaurantId=${restaurantId}&role=saas`
    const maxAttempts = 3

    return new Promise((resolve, reject) => {
      const ws = new WebSocketNode(wsUrl) as unknown as WebSocket

      const timeout = setTimeout(() => {
        ws.terminate?.()
        if (attempt < maxAttempts) {
          return resolve(
            sendOrderToPrint(restaurantId, orderData, attempt + 1, printId),
          )
        }
        reject(new Error("Timeout servidor impressão"))
      }, 10000)

      const currentPrintId = printId ?? `print_${orderData.id}_${Date.now()}`
      let responded = false
      let sent = false

      const doSend = () => {
        if (sent) return
        sent = true

        const message = {
          type: "print_order",
          order: { ...orderData, printId: currentPrintId, restaurantId },
        }

        // Aqui o TS agora aceita 2 argumentos porque 'ws' foi tipado como WebSocket do Node
        ws.send(JSON.stringify(message), (err) => {
          if (!err) return
          if (!responded) {
            responded = true
            clearTimeout(timeout)
            if (attempt < maxAttempts) {
              resolve(
                sendOrderToPrint(
                  restaurantId,
                  orderData,
                  attempt + 1,
                  currentPrintId,
                ),
              )
            } else {
              reject(err)
            }
          }
        })
      }

      ws.on("open", () => {
        const fallback = setTimeout(() => {
          if (!sent) doSend()
        }, 500)

        ws.on("message", (data) => {
          try {
            const rawData = JSON.parse(data.toString())
            const type = rawData.type as string // Pegamos o tipo primeiro

            if (type === "welcome") {
              clearTimeout(fallback)
              doSend()
            } else if (type === "print_ack") {
              const msg = rawData as { type: "print_ack"; printId: string } // Forçamos o tipo aqui
              responded = true
              clearTimeout(timeout)
              ws.close()
              resolve(msg.printId)
            } else if (type === "print_error") {
              const msg = rawData as { type: "print_error"; reason?: string } // Forçamos o tipo aqui
              responded = true
              clearTimeout(timeout)
              ws.close()
              reject(new Error(msg.reason ?? "print_error"))
            }
          } catch (e) {
            console.error(e)
          }
        })
      })

      ws.on("error", (err) => {
        if (responded) return
        responded = true
        clearTimeout(timeout)
        if (attempt < maxAttempts) {
          resolve(
            sendOrderToPrint(
              restaurantId,
              orderData,
              attempt + 1,
              currentPrintId,
            ),
          )
        } else {
          reject(err)
        }
      })
    })
  } catch (error) {
    console.error("💥 Erro fatal impressão:", error)
    return null
  }
}

/* ---------------- Client WS (Browser Only) ---------------- */

let clientSocket: globalThis.WebSocket | null = null

export function connectPrintWS({
  serverUrl,
  token,
}: {
  serverUrl: string
  token: string
}): globalThis.WebSocket | null {
  if (typeof window === "undefined") return null

  if (!token || !serverUrl || clientSocket?.readyState === WebSocket.OPEN) {
    return clientSocket
  }

  try {
    const socket = new window.WebSocket(`${serverUrl}?token=${token}&saas=true`)

    socket.onopen = () => console.log("🟢 SaaS conectado ao Print WS")

    socket.onclose = () => {
      clientSocket = null
    }

    clientSocket = socket

    return socket
  } catch (error) {
    console.error("Erro ao conectar WS do cliente", error)
    return null
  }
}

export function sendPrintOrder(order: unknown) {
  if (!clientSocket || clientSocket.readyState !== 1)
    throw new Error("WS Offline")
  clientSocket.send(
    JSON.stringify({
      type: "print_order",
      order,
      timestamp: new Date().toISOString(),
    }),
  )
}
