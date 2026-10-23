"use client"

import { Card, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AREA_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/constants/options"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { maskState } from "@/helpers/mask-state"
import { ManualOrderFormValue } from "@/schemas/manual-order.schemas"
import { Controller, useFormContext } from "react-hook-form"

type DeliveryFormValue = Extract<
  ManualOrderFormValue,
  { consumptionMethod: "DELIVERY" }
>

const DeliveryFields = () => {
  const form = useFormContext<DeliveryFormValue>()

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form

  const paymentMethod = form.watch("paymentMethod")

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

        <div className="flex flex-col gap-4 lg:flex-row">
          <Field className="lg:max-w-1/2">
            <FieldLabel>Método de Pagamento</FieldLabel>
            <Controller
              name="paymentMethod"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHOD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.paymentMethod?.message}</FieldError>
          </Field>

          {/* Renderiza o input de troco APENAS se o método de pagamento for CASH */}
          {paymentMethod === "CASH" && (
            <Controller
              control={control}
              name="changeAmount"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Troco para: </FieldLabel>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={
                      field.value != null
                        ? Number(field.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : ""
                    }
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "")
                      const num = digits ? Number(digits) / 100 : undefined
                      field.onChange(num)
                    }}
                    onBlur={field.onBlur}
                    placeholder="R$ 0,00 (Opcional)"
                  />
                  <FieldError>{errors.changeAmount?.message}</FieldError>
                </Field>
              )}
            />
          )}
        </div>

        <CardTitle>Endereço</CardTitle>

        <div className="flex justify-end">
          <Field className="max-w-xs">
            <FieldLabel>Área de Entrega</FieldLabel>
            <Controller
              name="areaType"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {AREA_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.areaType?.message}</FieldError>
          </Field>
        </div>

        <div className="flex gap-4 lg:col-span-2">
          <Field>
            <FieldLabel>Rua</FieldLabel>
            <Input
              placeholder="Ex: rua Principal"
              {...register("address.street")}
            />
            <FieldError>{errors.address?.street?.message}</FieldError>
          </Field>

          <Field className="w-1/4">
            <FieldLabel>Número</FieldLabel>
            <Input {...register("address.number")} />
            <FieldError>{errors.address?.number?.message}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel>Complemento (campo opcional)</FieldLabel>
          <Input {...register("address.complement")} />
          <FieldError>{errors.address?.complement?.message}</FieldError>
        </Field>

        <div className="gap-4 space-y-4 lg:flex">
          <Field>
            <FieldLabel>Bairro</FieldLabel>
            <Input {...register("address.neighborhood")} />
            <FieldError>{errors.address?.neighborhood?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Cidade</FieldLabel>
            <Input {...register("address.city")} />
            <FieldError>{errors.address?.city?.message}</FieldError>
          </Field>

          <Field className="max-w-50">
            <FieldLabel>Estado</FieldLabel>
            <Input
              {...register("address.state", {
                onChange: (event) => {
                  event.target.value = maskState(event.target.value)
                },
              })}
              maxLength={2}
            />
            <FieldError>{errors.address?.state?.message}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel>Referência (campo opcional)</FieldLabel>
          <Textarea
            className="min-h-24 resize-y"
            placeholder="Descreva alguma referência para ajudar o entregador a localizar o endereço..."
            {...register("address.reference")}
          />
        </Field>
      </FieldGroup>
    </Card>
  )
}

export default DeliveryFields
