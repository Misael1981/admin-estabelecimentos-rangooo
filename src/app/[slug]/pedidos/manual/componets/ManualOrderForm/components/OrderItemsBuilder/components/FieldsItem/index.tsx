"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { MenuCategoryDTO } from "@/dtos/manual-order.dto"
import { ManualOrderFormInput } from "@/schemas/manual-order.schemas"
import { FieldArrayWithId, useFormContext } from "react-hook-form"

type FieldsItemProps = {
  fields: FieldArrayWithId<ManualOrderFormInput, "items">[]
  onRemove: (index: number) => void
  menuCategories: MenuCategoryDTO[]
}

const FieldsItem = ({ menuCategories, fields, onRemove }: FieldsItemProps) => {
  const { formState } = useFormContext<ManualOrderFormInput>()

  const productsById = useMemo(
    () =>
      new Map(menuCategories.flatMap((c) => c.products).map((p) => [p.id, p])),
    [menuCategories],
  )

  return (
    <section className="mx-auto w-full max-w-xl space-y-2">
      {fields.map((field, index) => {
        const name1 = productsById.get(field.flavor1Id ?? "")?.name
        const name2 = productsById.get(field.flavor2Id ?? "")?.name

        const title = field.isDouble
          ? `½ ${name1 ?? "Sabor 1"} + ½ ${name2 ?? "Sabor 2"}`
          : (productsById.get(field.productId)?.name ?? "Produto")

        return (
          <div
            key={field.id}
            className="flex items-center justify-between rounded-md border p-2 text-sm"
          >
            <span>
              {field.quantity}x {title}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
            >
              Remover
            </Button>
          </div>
        )
      })}

      {formState.errors.items?.message && (
        <p className="text-destructive text-sm">
          {formState.errors.items.message}
        </p>
      )}
    </section>
  )
}

export default FieldsItem
