import { $Enums } from "@misael1981/rangooo-database"

export interface DeliveryEstimateDTO {
  restaurantId: string
  mode: $Enums.EstimateMode
  id: string
  createdAt: Date
  updatedAt: Date
  sampleSize: number
  fallbackMinutes: number
  manualAdjustment: number
  movementLevel: $Enums.MovementLevel
}
