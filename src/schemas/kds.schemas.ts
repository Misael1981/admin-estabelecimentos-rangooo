import { z } from "zod"

export const stationKdsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(40, "Máximo de 40 caracteres"),
  order: z.number().int().min(0, "Ordem inválida"),
  active: z.boolean().default(true),
})

export type StationKdsFormInput = z.input<typeof stationKdsSchema>
export type StationKdsFormValues = z.output<typeof stationKdsSchema>
