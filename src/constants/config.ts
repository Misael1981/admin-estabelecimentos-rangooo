import { PaymentReceiptStatus, SubscriptionStatus } from "./enums"

export interface StatusConfig {
  label: string
  variant: string
  badgeStyle: string
  borderStyle: string
  bgStyle: string
}

export const SUBSCRIPTION_STATUS_CONFIG: Record<
  SubscriptionStatus,
  StatusConfig
> = {
  ACTIVE: {
    label: "Ativo",
    variant: "default",
    badgeStyle:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200",
    borderStyle: "border-l-emerald-500",
    bgStyle: "bg-emerald-500/5 hover:bg-emerald-500/10",
  },
  PAST_DUE: {
    label: "Atrasado",
    variant: "destructive",
    badgeStyle:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 animate-pulse",
    borderStyle: "border-l-amber-500",
    bgStyle: "bg-amber-500/5 hover:bg-amber-500/10",
  },
  CANCELED: {
    label: "Cancelado",
    variant: "destructive",
    badgeStyle: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-200",
    borderStyle: "border-l-red-500",
    bgStyle: "bg-red-500/5 hover:bg-red-500/10 opacity-75",
  },
  EXPIRED: {
    label: "Expirado",
    variant: "destructive",
    badgeStyle:
      "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200",
    borderStyle: "border-l-rose-500",
    bgStyle: "bg-rose-500/5 hover:bg-rose-500/10 opacity-75",
  },
  TRIALING: {
    label: "Em teste",
    variant: "default",
    badgeStyle:
      "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200",
    borderStyle: "border-l-purple-500",
    bgStyle: "bg-purple-500/5 hover:bg-purple-500/10",
  },
}

export const PAYMENT_RECEIPT_CONFIG: Record<
  PaymentReceiptStatus,
  StatusConfig
> = {
  PAID: {
    label: "Pago",
    variant: "default",
    badgeStyle:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200",
    borderStyle: "border-l-emerald-500",
    bgStyle: "bg-emerald-500/5 hover:bg-emerald-500/10",
  },
  PENDING: {
    label: "Pendente",
    variant: "destructive",
    badgeStyle:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 animate-pulse",
    borderStyle: "border-l-amber-500",
    bgStyle: "bg-amber-500/5 hover:bg-amber-500/10",
  },
  CANCELED: {
    label: "Cancelado",
    variant: "outline",
    badgeStyle: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-200",
    borderStyle: "border-l-red-500",
    bgStyle: "bg-red-500/5 hover:bg-red-500/10 opacity-75",
  },
  OVERDUE: {
    label: "Vencida",
    variant: "destructive",
    badgeStyle:
      "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200",
    borderStyle: "border-l-rose-500",
    bgStyle: "bg-rose-500/5 hover:bg-rose-500/10 opacity-75",
  },
}
