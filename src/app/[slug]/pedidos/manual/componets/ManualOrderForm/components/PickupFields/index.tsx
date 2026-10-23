"use client"

import { Card, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { formatTime } from "@/helpers/format-time"
import { ManualOrderFormValue } from "@/schemas/manual-order.schemas"
import { useFormContext } from "react-hook-form"

type PickupFormValue = Extract<
  ManualOrderFormValue,
  { consumptionMethod: "PICKUP" }
>

const PickupFields = () => {
  const form = useFormContext<PickupFormValue>()

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const pickupTimeField = register("pickupTime")

  return (
    <Card className="space-y-6 p-4">
      <CardTitle>Dados do Cliente</CardTitle>

      <FieldGroup className="space-y-4">
        <div className="flex justify-end">
          <div className="bg-muted/50 flex max-w-xs items-center justify-between rounded-lg border p-3">
            <p className="text-muted-foreground text-sm font-medium">
              Código do Cliente:{" "}
              <strong className="text-primary text-base font-bold">
                {watch("customerCode")}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <Field>
            <FieldLabel>Nome</FieldLabel>
            <Input
              {...register("customerName")}
              placeholder="Nome do Cliente"
            />
            <FieldError>{errors.customerName?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Telefone de Contato</FieldLabel>
            <Input
              {...register("customerPhone")}
              placeholder="00 0 0000-0000"
              onChange={(e) => {
                e.target.value = formatPhoneNumber(e.target.value)
              }}
            />
            <FieldError>{errors.customerPhone?.message}</FieldError>
          </Field>
        </div>

        <div className="flex justify-center">
          <Field className="max-w-xs">
            <FieldLabel>Horário de Retirada</FieldLabel>

            <Input
              {...pickupTimeField}
              placeholder="HH:mm"
              maxLength={5}
              onChange={(event) => {
                const value = formatTime(event.target.value)

                setValue("pickupTime", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
            />

            <FieldError>{errors.pickupTime?.message}</FieldError>
          </Field>
        </div>
      </FieldGroup>
    </Card>
  )
}

export default PickupFields
