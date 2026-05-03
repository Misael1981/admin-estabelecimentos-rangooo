export const AreaType = {
  URBAN: "URBAN",
  RURAL: "RURAL",
  DISTRICT: "DISTRICT",
} as const

export const PlanType = {
  BASICO: "BASICO",
  PRO: "PRO",
} as const

export type AreaType = (typeof AreaType)[keyof typeof AreaType]
export type PlanType = (typeof PlanType)[keyof typeof PlanType]

export const CONSUMPTION_METHODS = [
  { value: "DINE_IN", label: "Comer no local" },
  { value: "PICKUP", label: "Pegar no local" },
  { value: "DELIVERY", label: "Entrega" },
] as const

export const PAYMENT_METHODS = [
  { value: "CREDIT_CARD", label: "Cartão de Crédito" },
  { value: "DEBIT_CARD", label: "Cartão de Débito" },
  { value: "PIX", label: "PIX" },
  { value: "CASH", label: "Dinheiro" },
] as const

export type ConsumptionMethodValue =
  (typeof CONSUMPTION_METHODS)[number]["value"]
export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"]
