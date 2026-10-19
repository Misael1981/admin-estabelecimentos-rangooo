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
}
