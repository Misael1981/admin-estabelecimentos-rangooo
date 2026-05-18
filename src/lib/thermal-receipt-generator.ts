// ajuste o caminho para onde sua DTO está

import { OrderDTO, OrderItemDTO } from "@/dtos/order.dto"

// Configurações da loja
export interface StoreConfig {
  name: string
  cnpj?: string
  phone?: string
  address?: string
  footer?: string
}

// Extra vindo do campo `extras` (JSON serializado)
interface ExtraItem {
  id: string
  name: string
  price: number
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getMethodLabel(method: OrderDTO["method"]): string {
  if (method === "DELIVERY") return "ENTREGA"
  if (method === "PICKUP") return "RETIRADA"
  if (method === "DINE_IN") return "MESA"
  return ""
}

function formatPaymentMethod(method: string | null): string {
  if (!method) return "Não informado"
  const map: Record<string, string> = {
    pix: "PIX",
    credit_card: "Cartão de Crédito",
    debit_card: "Cartão de Débito",
    cash: "Dinheiro",
    money: "Dinheiro",
  }
  return map[method.toLowerCase()] ?? method
}

/** Faz parse seguro do campo `extras` (vem como string JSON ou null) */
function parseExtras(extras: string | null | undefined): ExtraItem[] {
  if (!extras) return []
  try {
    const parsed = JSON.parse(extras)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Faz parse seguro do campo `removedIngredients` */
function parseRemoved(removed: string | null | undefined): string[] {
  if (!removed) return []
  try {
    const parsed = JSON.parse(removed)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ─── Geração do HTML de cada item ───────────────────────────────────────────

function renderItem(item: OrderItemDTO): string {
  const extras = parseExtras(item.extras)
  const removed = parseRemoved(item.removedIngredients)

  // Adicionais da primeira metade (extras) + additionalIngredients
  const allAddons = [
    ...extras.map((e) => ({ name: e.name, price: e.price })),
    ...(item.additionalIngredients ?? []).map((name) => ({ name, price: 0 })),
  ]

  // Adicionais da segunda metade (pizza dupla)
  const flavor2Addons = item.isDouble
    ? (item.flavor2additionalIngredients ?? []).map((a) =>
        typeof a === "string" ? { name: a, price: 0 } : a,
      )
    : []

  const addonsTotalPrice = allAddons.reduce((s, a) => s + a.price, 0)
  const flavor2AddonsTotalPrice = flavor2Addons.reduce(
    (s, a) =>
      s +
      (typeof a === "object" && "price" in a
        ? (a as { price: number }).price
        : 0),
    0,
  )
  const itemTotal =
    (item.price + addonsTotalPrice + flavor2AddonsTotalPrice) * item.quantity

  // Nome do item — para pizza dupla mostra ambos os sabores
  const displayName =
    item.isDouble && item.flavor2Name
      ? `1/2 ${item.name} | 1/2 ${item.flavor2Name}`
      : item.name

  const addonsHtml =
    allAddons.length > 0
      ? allAddons
          .map(
            (a) =>
              `<div class="item-addon">
              <span>+ ${a.name}</span>
              ${a.price > 0 ? `<span>${formatCurrency(a.price)}</span>` : "<span></span>"}
            </div>`,
          )
          .join("")
      : ""

  const flavor2AddonsHtml =
    item.isDouble && flavor2Addons.length > 0
      ? `<div class="item-obs">Adicionais (${item.flavor2Name}):</div>` +
        flavor2Addons
          .map((a) => {
            const addon = a as { name: string; price: number }
            return `<div class="item-addon">
              <span>+ ${addon.name}</span>
              ${addon.price > 0 ? `<span>${formatCurrency(addon.price)}</span>` : "<span></span>"}
            </div>`
          })
          .join("")
      : ""

  const removedHtml =
    removed.length > 0
      ? `<div class="item-obs">Sem: ${removed.join(", ")}</div>`
      : ""

  return `
    <div class="item-row">
      <div class="item-line">
        <div class="item-qty-name">
          <span class="item-qty">${item.quantity}x</span>
          <span class="item-name">${displayName}</span>
        </div>
        <span class="item-price">${formatCurrency(itemTotal)}</span>
      </div>
      <div class="item-obs" style="font-size:8px;color:#555">${item.category}</div>
      ${removedHtml}
      ${addonsHtml}
      ${flavor2AddonsHtml}
    </div>
  `
}

// ─── Função principal ────────────────────────────────────────────────────────

export function generateThermalReceiptHtml(
  order: OrderDTO,
  restaurantName: string | undefined,
): string {
  const itemsHtml = order.items.map(renderItem).join("")

  const addressHtml =
    order.method === "DELIVERY" && order.address
      ? `<div class="delivery-section">
          <div class="label">ENDEREÇO DE ENTREGA:</div>
          <div>${order.address.street}, ${order.address.number}${
            order.address.complement ? ` - ${order.address.complement}` : ""
          }</div>
          ${order.address.neighborhood ? `<div>${order.address.neighborhood}</div>` : ""}
          <div>${order.address.city}</div>
          ${order.address.reference ? `<div>Ref: ${order.address.reference}</div>` : ""}
        </div>`
      : ""

  return `
    <div class="thermal-receipt">

      <!-- Cabeçalho -->
      <div class="receipt-header">
        <div class="store-name">${restaurantName}</div>
      </div>

      <!-- Número do pedido -->
      <div class="order-number">
        PEDIDO ${String(order.orderNumber).padStart(3, "0")}
      </div>

      <!-- Meta -->
      <div class="order-meta">
        <div class="meta-row">
          <span>${formatDate(order.createdAt)}</span>
          <span><b>${getMethodLabel(order.method)}</b></span>
        </div>
        <div class="meta-row">
          <span>${order.customerName}</span>
          ${order.customerPhone ? `<span>${order.customerPhone}</span>` : ""}
        </div>
      </div>

      <hr class="divider" />

      <!-- Itens -->
      <div class="items-header">
        <span>ITEM</span>
        <span>TOTAL</span>
      </div>

      ${itemsHtml}

      <hr class="divider-solid" />

      <!-- Total -->
      <div class="totals">
        <div class="total-row grand-total">
          <span>TOTAL</span>
          <span>${formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <hr class="divider" />

      <!-- Pagamento -->
      <div class="payment-section">
        <div class="payment-row">
          <span>Pagamento</span>
          <span><b>${formatPaymentMethod(order.paymentMethod)}</b></span>
        </div>
      </div>

      ${addressHtml ? `<hr class="divider" />${addressHtml}` : ""}

      <!-- Rodapé -->
      <div class="receipt-footer">
        ${"Obrigado pela preferência!"}
      </div>

    </div>
  `
}
