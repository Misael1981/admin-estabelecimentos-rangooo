import { PlanType } from "./enums"

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
