"use client"

import { buttonVariants } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { ConsumptionMethod } from "@/constants/enums"
import { CONSUMPTION_METHOD_LABEL } from "@/constants/labels"
import { ManualOrderFormValue } from "@/schemas/manual-order.schemas"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"

type ConsumptionMethodProps = {
  consumptionMethods: {
    id: string
    method: ConsumptionMethod
    isActive: boolean
  }[]
  slug: string
}

const ConsumptionMethodFields = ({
  consumptionMethods,
  slug,
}: ConsumptionMethodProps) => {
  const searchParams = useSearchParams()
  const form = useFormContext<ManualOrderFormValue>()
  const {
    formState: { errors },
  } = form

  const currentMethod = form.watch("consumptionMethod")
  const selectedMethod = searchParams.get("consumptionMethod") ?? currentMethod

  return (
    <Field>
      <h4 className="text-muted-foreground text-center text-sm font-medium">
        Método de consumo
      </h4>

      <div className="flex justify-center gap-2">
        {consumptionMethods
          .filter((method) => method.isActive)
          .map((method) => {
            const isSelected = selectedMethod === method.method

            return (
              <Link
                key={method.id}
                href={`/${slug}/pedidos/manual?consumptionMethod=${method.method}`}
                className={buttonVariants({
                  variant: isSelected ? "default" : "outline",
                })}
              >
                {CONSUMPTION_METHOD_LABEL[method.method]}
              </Link>
            )
          })}
      </div>

      <FieldError>{errors.consumptionMethod?.message}</FieldError>
    </Field>
  )
}

export default ConsumptionMethodFields
