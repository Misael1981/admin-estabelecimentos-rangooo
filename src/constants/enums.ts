export const PlanType = {
  BASICO: "BASICO",
  PRO: "PRO",
}

export type PlanType = (typeof PlanType)[keyof typeof PlanType]
