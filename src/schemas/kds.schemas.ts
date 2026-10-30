import { KdsRole } from "@/constants/enums"
import { z } from "zod"

export const stationKdsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(40, "Máximo de 40 caracteres"),
  order: z.number().int().min(0, "Ordem inválida"),
  estimatedMinutes: z.number().int().default(5),
  active: z.boolean().default(true),
})

export type StationKdsFormInput = z.input<typeof stationKdsSchema>
export type StationKdsFormValues = z.output<typeof stationKdsSchema>

export const kdsUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(50, "Máximo de 50 caracteres"),
  username: z
    .string()
    .trim()
    .min(3, "O usuário deve ter pelo menos 3 caracteres")
    .max(20, "Máximo de 20 caracteres"),

  role: z.enum(KdsRole, {
    message: "Selecione um plano válido",
  }),

  pinHash: z
    .string()
    .trim()
    .min(4, "O PIN deve ter no mínimo 4 dígitos")
    .max(6, "Máximo de 6 dígitos"),

  active: z.boolean().default(true),
})

export type kdsUserFormInput = z.input<typeof kdsUserSchema>
export type kdsUserFormValues = z.output<typeof kdsUserSchema>
