import {
  AreaType,
  ConsumptionMethod,
  PaymentReceiptStatus,
  PlanType,
  SubscriptionStatus,
} from "./enums"

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

export const CONSUMPTION_METHOD_LABEL: Record<ConsumptionMethod, string> = {
  DELIVERY: "Entrega",
  PICKUP: "Retirada",
  DINE_IN: "Consumo no Local",
}

export const AREA_TYPE_LABEL: Record<AreaType, string> = {
  URBAN: "Perímetro Urbano",
  RURAL: "Zona Rural",
  DISTRICT: "Distrito",
}
