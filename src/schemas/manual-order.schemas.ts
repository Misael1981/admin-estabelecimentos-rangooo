import { AreaType, PaymentMethod } from "@/constants/enums"
import { emptyToNull } from "@/helpers/empty-to-null"
import z from "zod"

const additionalIngredientSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
})

const decimalSchema = z.union([
  z.number(),
  z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor numérico inválido"),
])

// 1. Schema para os itens do carrinho/pedido
const orderItemSchema = z
  .object({
    productId: z.string().min(1, "Produto obrigatório"),
    quantity: z.number().int().positive("A quantidade deve ser maior que zero"),
    isDouble: z.boolean().default(false),

    // Customizações do item
    removedIngredients: z.string().optional().nullable(),
    additionalIngredients: z.array(additionalIngredientSchema).default([]),

    customName: z.string().optional().nullable(),
    extras: z.string().optional().nullable(),

    // 2 Sabores
    flavor1Id: z.string().nullish(),
    flavor1Removed: z.array(z.string()).default([]),
    flavor1additionalIngredients: z
      .array(additionalIngredientSchema)
      .default([]),

    flavor2Id: z.string().nullish(),
    flavor2Removed: z.array(z.string()).default([]),
    flavor2additionalIngredients: z
      .array(additionalIngredientSchema)
      .default([]),
  })
  .superRefine((item, ctx) => {
    if (item.isDouble && (!item.flavor1Id || !item.flavor2Id)) {
      ctx.addIssue({
        code: "custom",
        message: "Selecione os 2 sabores",
        path: ["flavor2Id"],
      })
    }
  })

const baseOrderSchema = {
  items: z
    .array(orderItemSchema)
    .min(1, "O pedido precisa ter pelo menos um item"),
  notes: z.string().optional().nullable(),
}

const addressSchema = z.object({
  street: z.string().trim().min(1, "Rua é obrigatória"),
  number: z.string().trim().min(1, "Número é obrigatório"),
  complement: emptyToNull,
  neighborhood: z.string().trim().min(1, "Bairro é obrigatório"),
  city: z.string().trim().min(1, "Cidade é obrigatória"),
  state: z.string().trim().min(1, "Estado é obrigatório"),
  reference: emptyToNull,
})

const deliverySchema = z.object({
  ...baseOrderSchema,

  consumptionMethod: z.literal("DELIVERY"),
  customerName: z.string().min(1, "Nome é obrigatório"),
  customerPhone: z.string().min(1, "Telefone é obrigatório"),
  customerCode: z.number().int().positive().optional(),

  paymentMethod: z.enum(PaymentMethod).default("PIX"),
  changeAmount: decimalSchema.optional().default(0),

  // Endereço
  areaType: z.enum(AreaType).default("URBAN"),
  address: addressSchema,
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
  customerCode: z.number().int().positive().optional(),

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
