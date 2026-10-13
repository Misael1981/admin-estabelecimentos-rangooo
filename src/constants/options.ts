import { PaymentReceiptStatus, PlanType, SubscriptionStatus } from "./enums"
import { PAYMENT_RECEIPT_LABELS, SUBSCRIPTION_STATUS_LABELS } from "./labels"

export const PLAN_FEATURES = {
  [PlanType.BASICO]: {
    canUseDeliverySystem: false,
  },
  [PlanType.PRO]: {
    canUseDeliverySystem: true,
  },
}

export function hasFeature(
  plan: PlanType,
  feature: keyof (typeof PLAN_FEATURES)[PlanType],
) {
  return PLAN_FEATURES[plan]?.[feature] ?? false
}

export const SUBSCRIPTION_STATUS_OPTIONS = [
  {
    value: SubscriptionStatus.ACTIVE,
    label: SUBSCRIPTION_STATUS_LABELS[SubscriptionStatus.ACTIVE],
  },
  {
    value: SubscriptionStatus.CANCELED,
    label: SUBSCRIPTION_STATUS_LABELS[SubscriptionStatus.CANCELED],
  },
  {
    value: SubscriptionStatus.EXPIRED,
    label: SUBSCRIPTION_STATUS_LABELS[SubscriptionStatus.EXPIRED],
  },
  {
    value: SubscriptionStatus.PAST_DUE,
    label: SUBSCRIPTION_STATUS_LABELS[SubscriptionStatus.PAST_DUE],
  },
  {
    value: SubscriptionStatus.TRIALING,
    label: SUBSCRIPTION_STATUS_LABELS[SubscriptionStatus.TRIALING],
  },
]

export const PAYMENT_RECEIPT_OPTIONS = [
  {
    value: PaymentReceiptStatus.PAID,
    label: PAYMENT_RECEIPT_LABELS[PaymentReceiptStatus.PAID],
  },
  {
    value: PaymentReceiptStatus.PENDING,
    label: PAYMENT_RECEIPT_LABELS[PaymentReceiptStatus.PENDING],
  },
  {
    value: PaymentReceiptStatus.OVERDUE,
    label: PAYMENT_RECEIPT_LABELS[PaymentReceiptStatus.OVERDUE],
  },
  {
    value: PaymentReceiptStatus.CANCELED,
    label: PAYMENT_RECEIPT_LABELS[PaymentReceiptStatus.CANCELED],
  },
]
