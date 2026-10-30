import {
  AreaType,
  ConsumptionMethod,
  KdsRole,
  PaymentMethod,
  PaymentReceiptStatus,
  PlanType,
  SubscriptionStatus,
} from "./enums"
import {
  AREA_TYPE_LABEL,
  CONSUMPTION_METHOD_LABEL,
  KDS_ROLE_LABELS,
  PAYMENT_METHOD_LABEL,
  PAYMENT_RECEIPT_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
} from "./labels"

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

export const CONSUMPTION_METHOD_OPTIONS = [
  {
    value: ConsumptionMethod.DELIVERY,
    label: CONSUMPTION_METHOD_LABEL[ConsumptionMethod.DELIVERY],
  },
  {
    value: ConsumptionMethod.PICKUP,
    label: CONSUMPTION_METHOD_LABEL[ConsumptionMethod.PICKUP],
  },
  {
    value: ConsumptionMethod.DINE_IN,
    label: CONSUMPTION_METHOD_LABEL[ConsumptionMethod.DINE_IN],
  },
]

export const AREA_TYPE_OPTIONS = [
  {
    value: AreaType.URBAN,
    label: AREA_TYPE_LABEL[AreaType.URBAN],
  },
  {
    value: AreaType.RURAL,
    label: AREA_TYPE_LABEL[AreaType.RURAL],
  },
  {
    value: AreaType.DISTRICT,
    label: AREA_TYPE_LABEL[AreaType.DISTRICT],
  },
]

export const PAYMENT_METHOD_OPTIONS = [
  {
    value: PaymentMethod.CASH,
    label: PAYMENT_METHOD_LABEL[PaymentMethod.CASH],
  },
  {
    value: PaymentMethod.PIX,
    label: PAYMENT_METHOD_LABEL[PaymentMethod.PIX],
  },
  {
    value: PaymentMethod.CREDIT_CARD,
    label: PAYMENT_METHOD_LABEL[PaymentMethod.CREDIT_CARD],
  },
  {
    value: PaymentMethod.DEBIT_CARD,
    label: PAYMENT_METHOD_LABEL[PaymentMethod.DEBIT_CARD],
  },
]

export const KDS_ROLE_OPTIONS = [
  {
    value: KdsRole.OPERATOR,
    label: KDS_ROLE_LABELS[KdsRole.OPERATOR],
  },
  {
    value: KdsRole.CHEF,
    label: KDS_ROLE_LABELS[KdsRole.CHEF],
  },
  {
    value: KdsRole.MANAGER,
    label: KDS_ROLE_LABELS[KdsRole.MANAGER],
  },
]
