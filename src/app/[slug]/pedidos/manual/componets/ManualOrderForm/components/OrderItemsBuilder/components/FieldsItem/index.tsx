"use client"

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

  return (
    <section className="mx-auto w-full max-w-xl space-y-2">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex items-center justify-between rounded-md border p-2 text-sm"
        >
          <span>
            {field.quantity}x{" "}
            {field.isDouble
              ? `½ ${field.flavor1Name} + ½ ${field.flavor2Name}`
              : (menuCategories
                  .flatMap((c) => c.products)
                  .find((p) => p.id === field.productId)?.name ?? "Produto")}
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
      ))}

      {formState.errors.items?.message && (
        <p className="text-destructive text-sm">
          {formState.errors.items.message}
        </p>
      )}
    </section>
  )
}

export default FieldsItem
