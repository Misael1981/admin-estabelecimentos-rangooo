export interface MenuCategoryDTO {
  id: string
  name: string
  displayOrder: number
  productsCount: number
  products: MenuProductDTO[]
  additionalIngredients: AdditionalIngredientDTO[]
}

export interface MenuProductDTO {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  ingredients: string[]
  isVisible: boolean
}

export interface AdditionalIngredientDTO {
  id: string
  name: string
  price: number
}

export interface MenuCategoryWithProductsDTO {
  id: string
  name: string
  products: {
    id: string
    name: string
    price: number
    description: string | null
    imageUrl: string | null
    ingredients: string[]
    isVisible: boolean
  }[]
}

export interface MenuProductWithCategoryDTO {
  id: string
  name: string
  price: number
  description: string | null
  imageUrl: string | null
  ingredients: string[]
  isVisible: boolean
}
