import { ManageableIngredientDTO } from "@/dtos/manual-order.dto"

export const toIngredientList = (value: unknown) =>
  (value ?? []) as ManageableIngredientDTO[]

export const ingredientNames = (list: ManageableIngredientDTO[]) =>
  list.map((i) => i.name).join(", ")
