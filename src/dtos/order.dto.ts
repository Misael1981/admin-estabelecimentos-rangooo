import { AreaType, OrderStatus } from "@misael1981/rangooo-database"

export type OrderAddress = {
  street: string
  number: string
  neighborhood?: string
  complement?: string
  reference?: string
  city: string
  areaType?: AreaType
}

export type OrderItemDTO = {
  id?: string
  name: string
  price: number
  quantity: number
  category: string

  extras?: string | null
  removedIngredients?: string | null
  additionalIngredients?: string[]

  isDouble?: boolean
  flavor1Name?: string
  flavor1Removed?: string[]
  flavor1additionalIngredients?: {
    name: string
    price: number
  }[]
  flavor2Name?: string
  flavor2Removed?: string[]
  flavor2additionalIngredients?: {
    name: string
    price: number
  }[]
}

export type OrderItemPrintDTO = {
  id: string
  name: string
  quantity: number
  price: number
  product: {
    name: string
    category: string
  }
}

export type OrderDTO = {
  id: string
  customerName: string
  customerPhone: string
  paymentMethod: string | null
  orderNumber: number
  totalAmount: number
  status: OrderStatus
  method: "DELIVERY" | "PICKUP" | "DINE_IN"
  createdAt: Date
  items: OrderItemDTO[]
  address?:
    | {
        street: string
        number: string
        city: string
        neighborhood?: string
        complement?: string
        reference?: string
        areaType?: AreaType
      }
    | undefined
}
