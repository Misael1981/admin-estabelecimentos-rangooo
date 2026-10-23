import { ManageableIngredientDTO } from "@/dtos/manual-order.dto"

export const toAdded = (list: ManageableIngredientDTO[]) =>
  list.flatMap((i) => (i.id ? [{ id: i.id, name: i.name }] : []))
