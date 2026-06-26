import z from "zod"

export const deliveryEstimateSchema = z.object({
  mode: z.enum(["FIXED", "AUTOMATIC"]),

  movementLevel: z.enum(["LOW", "NORMAL", "HIGH"]),
  fallbackMinutes: z
    .number()
    .int()
    .min(10, "O tempo mínimo é de 10 minutos.")
    .max(180, "O tempo máximo é de 180 minutos."),
})

export type DeliveryEstimateForm = z.infer<typeof deliveryEstimateSchema>
