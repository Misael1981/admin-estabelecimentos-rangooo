export const PlanType = {
  BASICO: "BASICO",
  PRO: "PRO",
} as const

export type PlanType = (typeof PlanType)[keyof typeof PlanType]

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
  TRIALING: "TRIALING",
} as const

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]

export const PaymentReceiptStatus = {
  PAID: "PAID",
  PENDING: "PENDING",
  OVERDUE: "OVERDUE",
  CANCELED: "CANCELED",
} as const

export type PaymentReceiptStatus =
  (typeof PaymentReceiptStatus)[keyof typeof PaymentReceiptStatus]

export const ConsumptionMethod = {
  DELIVERY: "DELIVERY",
  PICKUP: "PICKUP",
  DINE_IN: "DINE_IN",
} as const

export type ConsumptionMethod =
  (typeof ConsumptionMethod)[keyof typeof ConsumptionMethod]

export const AreaType = {
  URBAN: "URBAN",
  RURAL: "RURAL",
  DISTRICT: "DISTRICT",
} as const

export type AreaType = (typeof AreaType)[keyof typeof AreaType]

export const PaymentMethod = {
  CASH: "CASH",
  PIX: "PIX",
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]
