export const PlanType = {
  BASICO: "BASICO",
  PRO: "PRO",
}

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
