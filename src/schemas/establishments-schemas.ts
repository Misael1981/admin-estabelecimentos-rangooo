import { AreaType, PlanType } from "@/constants/database-enums"
import z from "zod"

export const plansSchema = z.object({
  plan: z.enum(PlanType, {
    message: "Selecione um plano válido",
  }),
  useRangoooDelivery: z.boolean(),
  deliveryFees: z.array(
    z.object({
      areaType: z.enum(AreaType),
      fee: z.number().min(0),
    }),
  ),
})

export const timeSlotSchema = z
  .object({
    open: z.string().min(1, "Horário inicial obrigatório"),
    close: z.string().min(1, "Horário final obrigatório"),
  })
  .refine((data) => data.open < data.close, {
    message: "Horário inicial deve ser menor que o final",
    path: ["close"],
  })

export const businessHourSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    isClosed: z.boolean(),
    timeSlots: z.array(timeSlotSchema),
  })
  .refine(
    (data) => {
      if (!data.isClosed && data.timeSlots.length === 0) {
        return false
      }
      return true
    },
    {
      message: "Adicione pelo menos um horário ou marque como fechado",
      path: ["timeSlots"],
    },
  )

export const businessHoursSchema = z.object({
  businessHours: z.array(businessHourSchema),
})

export type BusinessHoursFormData = z.infer<typeof businessHoursSchema>
