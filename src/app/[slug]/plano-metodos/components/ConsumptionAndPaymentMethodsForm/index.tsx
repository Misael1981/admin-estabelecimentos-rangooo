"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  CONSUMPTION_METHODS,
  ConsumptionMethodValue,
  PAYMENT_METHODS,
  PaymentMethodValue,
} from "@/constants/database-enums"
import { updateRestaurantMethods } from "@/app/actions/update-restaurant-methods"

const methodsSchema = z.object({
  consumptionMethods: z.array(
    z.enum(["DINE_IN", "PICKUP", "DELIVERY"] as const),
  ),
  paymentMethods: z.array(
    z.enum(["CASH", "PIX", "CREDIT_CARD", "DEBIT_CARD"] as const),
  ),
  deliveryFee: z.coerce
    .number()
    .min(0)
    .optional()
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
})

type MethodsFormData = z.infer<typeof methodsSchema>

interface ConsumptionAndPaymentMethodsFormProps {
  initialConsumptionMethods: ConsumptionMethodValue[]
  initialPaymentMethods: PaymentMethodValue[]
  restaurantId: string
  slug: string
}

const ConsumptionAndPaymentMethodsForm = ({
  initialConsumptionMethods,
  initialPaymentMethods,
  restaurantId,
  slug,
}: ConsumptionAndPaymentMethodsFormProps) => {
  const form = useForm({
    resolver: zodResolver(methodsSchema),
    defaultValues: {
      consumptionMethods: initialConsumptionMethods,
      paymentMethods: initialPaymentMethods,
    },
  })

  const onSubmit = async (data: MethodsFormData) => {
    try {
      const result = await updateRestaurantMethods({
        ...data,
        restaurantId,
        slug,
      })

      if (result.success) {
        toast.success("Configurações atualizadas com sucesso!")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Erro crítico ao salvar.")
      console.error(error)
    }
  }

  return (
    <section className="w-full">
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-300 p-6 shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FieldGroup className="flex flex-col justify-center gap-8 md:flex-row">
            {/* SEÇÃO: MÉTODOS DE CONSUMO */}
            <FieldSet className="w-full max-w-xs">
              <FieldLegend variant="label" className="text-lg font-bold">
                Métodos de consumo
              </FieldLegend>
              <FieldDescription className="mb-4">
                Quais métodos estarão ativos hoje?
              </FieldDescription>
              <Controller
                name="consumptionMethods"
                control={form.control}
                render={({ field }) => (
                  <FieldGroup className="gap-3">
                    {CONSUMPTION_METHODS.map((method) => (
                      <Field
                        orientation="horizontal"
                        key={method.value}
                        className="items-center gap-3"
                      >
                        <Checkbox
                          className="border border-gray-300"
                          id={`consume-${method.value}`}
                          checked={field.value?.includes(method.value)}
                          onCheckedChange={(checked) => {
                            const value = method.value
                            const updatedValue = checked
                              ? [...field.value, value]
                              : field.value.filter((v) => v !== value)
                            field.onChange(updatedValue)
                          }}
                        />
                        <FieldLabel
                          htmlFor={`consume-${method.value}`}
                          className="cursor-pointer font-normal"
                        >
                          {method.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                )}
              />
            </FieldSet>
            {/* SEÇÃO: MÉTODOS DE PAGAMENTO */}
            <FieldSet className="w-full max-w-xs">
              <FieldLegend variant="label" className="text-lg font-bold">
                Métodos de pagamento
              </FieldLegend>
              <FieldDescription className="mb-4">
                Quais formas de pagamento aceitar?
              </FieldDescription>
              <Controller
                name="paymentMethods"
                control={form.control}
                render={({ field }) => (
                  <FieldGroup className="gap-3">
                    {PAYMENT_METHODS.map((method) => (
                      <Field
                        orientation="horizontal"
                        key={method.value}
                        className="items-center gap-3"
                      >
                        <Checkbox
                          className="border border-gray-300"
                          id={`pay-${method.value}`}
                          checked={field.value?.includes(method.value)}
                          onCheckedChange={(checked) => {
                            const value = method.value
                            const updatedValue = checked
                              ? [...field.value, value]
                              : field.value.filter((v) => v !== value)
                            field.onChange(updatedValue)
                          }}
                        />
                        <FieldLabel
                          htmlFor={`pay-${method.value}`}
                          className="cursor-pointer font-normal"
                        >
                          {method.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </FieldGroup>
                )}
              />
            </FieldSet>
          </FieldGroup>
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="w-full max-w-md"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Salvando..."
                : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ConsumptionAndPaymentMethodsForm
