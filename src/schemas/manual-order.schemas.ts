import { AreaType } from "@/constants/enums"
import { emptyToNull } from "@/helpers/empty-to-null"
import z from "zod"

// 1. Schema para os itens do carrinho/pedido
const orderItemSchema = z.object({
  productId: z.string().min(1, "Produto obrigatório"),
  quantity: z.number().int().positive("A quantidade deve ser maior que zero"),

  // Customizações do item
  customName: z.string().optional().nullable(),
  extras: z.string().optional().nullable(),
  removedIngredients: z.string().optional().nullable(),

  // Se o seu sistema suporta 2 sabores de pizza, por exemplo:
  isDouble: z.boolean().default(false),
  flavor1Id: z.string().optional().nullable(),
  flavor1Name: z.string().optional().nullable(),
  flavor1Removed: z.string().optional().nullable(),
  flavor1additionalIngredients: z.any().optional().nullable(), // ou seu tipo customizado de adicionais

  flavor2Id: z.string().optional().nullable(),
  flavor2Name: z.string().optional().nullable(),
  flavor2Removed: z.string().optional().nullable(),
  flavor2additionalIngredients: z.any().optional().nullable(),

  // Adicionais gerais do item
  additionalIngredients: z.any().optional().nullable(),
})

const baseOrderSchema = {
  items: z
    .array(orderItemSchema)
    .min(1, "O pedido precisa ter pelo menos um item"),
  notes: z.string().optional().nullable(),
}

const deliverySchema = z.object({
  ...baseOrderSchema,

  consumptionMethod: z.literal("DELIVERY"),
  customerName: z.string().min(1, "Nome é obrigatório"),
  customerPhone: z.string().min(1, "Telefone é obrigatório"),
  customerCode: z.number().min(1, "O código é obrigatório"),

  // Endereço
  areaType: z.enum(AreaType).default("URBAN"),
  address: z
    .object({
      street: emptyToNull,
      number: emptyToNull,
      complement: emptyToNull,
      neighborhood: emptyToNull,
      city: emptyToNull,
      state: emptyToNull,
      reference: emptyToNull,
    })
    .optional()
    .nullable(),
})

const tableSchema = z.object({
  ...baseOrderSchema,

  consumptionMethod: z.literal("DINE_IN"),
  tableNumber: z.string().min(1),
  peopleCount: z.number().int().positive().optional(),
})

export const pickupSchema = z.object({
  ...baseOrderSchema,

  consumptionMethod: z.literal("PICKUP"),
  customerName: z.string().min(1, "Nome é obrigatório"),
  customerPhone: z.string().min(1, "Telefone é obrigatório"),
  customerCode: z.number().min(1, "O código é obrigatório"),

  pickupTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido (use HH:mm)"),
})

export const manualOrderSchema = z.discriminatedUnion("consumptionMethod", [
  deliverySchema,
  tableSchema,
  pickupSchema,
])

export type ManualOrderFormInput = z.input<typeof manualOrderSchema>
export type ManualOrderFormValue = z.output<typeof manualOrderSchema>
