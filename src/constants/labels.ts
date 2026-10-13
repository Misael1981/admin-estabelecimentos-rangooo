import { PaymentReceiptStatus, PlanType, SubscriptionStatus } from "./enums"

export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  BASICO: "Básico",
  PRO: "Pró",
}

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: "Ativo",
  PAST_DUE: "Atrasado",
  CANCELED: "Cancelado",
  EXPIRED: "Expirado",
  TRIALING: "Em teste",
}

export const PAYMENT_RECEIPT_LABELS: Record<PaymentReceiptStatus, string> = {
  PAID: "Pago",
  PENDING: "Pendente",
  OVERDUE: "Vencido",
  CANCELED: "Cancelado",
}
