import { AreaType } from "@/constants/enums"

export interface AddressDTO {
  number: string
  id: string
  city: string
  complement: string | null
  neighborhood: string
  state: string
  street: string
  reference: string | null
  areaType: AreaType
}

export interface CustomerDTO {
  name: string
  id: string
  phone: string | null
  customerCode: number
  addresses: AddressDTO[]
}

export interface OrderItem {
  id: string
  isDouble: boolean
}

export interface ProductDTO {
  id: string
  name: string
  price: number
  description: string | null
  imageUrl: string | null
  ingredients: string[] | null
  orderItems: OrderItem[]
}

export interface MenuCategoryDTO {
  id: string
  name: string
  displayOrder: number
  isDouble: boolean
  products: ProductDTO[]
  additionalIngredients: ManageableIngredientDTO[]
}

export type ManageableIngredientDTO = {
  id?: string
  name: string
  price?: number
  isActive?: boolean
}
