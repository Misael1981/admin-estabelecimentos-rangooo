"use client"

import { updateRestaurantPlans } from "@/app/actions/update-plans"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { PLANS_DETAILS } from "@/constants/maps-options"
import { plansSchema } from "@/schemas/establishments-schemas"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { AreaType, PlanType } from "@/constants/database-enums"

type PlansSectionProps = {
  plan: PlanType
  useRangoooDelivery: boolean
  deliveryAreas: {
    areaType: AreaType
    fee: number
  }[]
  systemSettings: {
    URBAN: number
    RURAL: number
    DISTRICT: number
  } | null
  restaurantId: string
  slug: string
}

const PlansSection = ({
  plan,
  useRangoooDelivery,
  deliveryAreas,
  systemSettings,
  restaurantId,
  slug,
}: PlansSectionProps) => {
  /* ---------------------------------- */
  /* 🧠 INITIAL FEES */
  /* ---------------------------------- */
  const initialFees = [AreaType.URBAN, AreaType.RURAL, AreaType.DISTRICT].map(
    (type) => ({
      areaType: type,
      fee: deliveryAreas.find((a) => a.areaType === type)?.fee || 0,
    }),
  )

  /* ---------------------------------- */
  /* 🧠 FORM */
  /* ---------------------------------- */
  const form = useForm<z.infer<typeof plansSchema>>({
    resolver: zodResolver(plansSchema),
    mode: "onChange",
    defaultValues: {
      plan,
      useRangoooDelivery,
      deliveryFees: initialFees,
    },
  })

  const selectedPlan = form.watch("plan")
  const isRangooo = form.watch("useRangoooDelivery")

  async function onSubmit(data: z.infer<typeof plansSchema>) {
    const finalData = {
      ...data,
      deliveryFees:
        data.useRangoooDelivery && systemSettings
          ? [
              { areaType: AreaType.URBAN, fee: systemSettings.URBAN },
              { areaType: AreaType.RURAL, fee: systemSettings.RURAL },
              { areaType: AreaType.DISTRICT, fee: systemSettings.DISTRICT },
            ]
          : data.deliveryFees,
    }

    try {
      const result = await updateRestaurantPlans(restaurantId, finalData, slug)

      if (result.success) {
        toast.success("Dados atualizados com sucesso! 🚀")
      } else {
        toast.error(result.error || "Erro ao atualizar perfil.")
      }
    } catch (error) {
      toast.error("Erro crítico de conexão.")
      console.error(error)
    }
  }

  /* ---------------------------------- */
  /* 🎨 RENDER */
  /* ---------------------------------- */

  return (
    <Card className="w-full shadow-lg sm:max-w-md md:max-w-xl lg:max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações de Plano e Entrega</CardTitle>
        <CardDescription>Gerencie como sua logística funciona.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="form-rhf-plans"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* ============================= */}
          {/* 📦 PLANOS */}
          {/* ============================= */}
          <Controller
            name="plan"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-4"
              >
                {PLANS_DETAILS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                      field.value === p.id
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    }`}
                  >
                    <RadioGroupItem value={p.id} className="mt-1" />
                    <div>
                      <p className="font-bold">{p.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {p.description}
                      </p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            )}
          />

          {/* ============================= */}
          {/* 🚚 LOGÍSTICA PRO */}
          {/* ============================= */}
          {selectedPlan === PlanType.PRO && (
            <Controller
              name="useRangoooDelivery"
              control={form.control}
              render={({ field }) => (
                <Field
                  orientation="horizontal"
                  className="justify-between rounded-md border border-orange-200 bg-orange-50/50 p-3"
                >
                  <FieldContent>
                    <FieldTitle className="text-orange-900">
                      Entregadores Rangooo
                    </FieldTitle>
                    <FieldDescription>
                      Ative para usar nossa frota parceira.
                    </FieldDescription>
                  </FieldContent>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          )}

          {/* ============================= */}
          {/* 💰 TAXAS PERSONALIZADAS */}
          {/* ============================= */}
          {(!isRangooo || selectedPlan === PlanType.BASICO) && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-semibold">Suas Taxas de Entrega</h4>

              {initialFees.map((item, index) => (
                <Controller
                  key={item.areaType}
                  name={`deliveryFees.${index}.fee`}
                  control={form.control}
                  render={({ field }) => (
                    <Field
                      orientation="horizontal"
                      className="flex w-full items-center justify-between rounded-md border p-3"
                    >
                      <FieldLabel>
                        {item.areaType === "URBAN"
                          ? "Urbana"
                          : item.areaType === "RURAL"
                            ? "Rural"
                            : "Distrito"}
                      </FieldLabel>

                      <div className="relative flex items-center">
                        <span className="text-muted-foreground absolute left-3 text-sm">
                          R$
                        </span>
                        <Input
                          className="w-28 pl-8 text-right"
                          type="number"
                          step="0.01"
                          value={field.value ? field.value / 100 : ""}
                          onChange={(e) => {
                            const rawValue = e.target.value
                            const sanitizedValue = rawValue.replace(",", ".")
                            const floatValue = parseFloat(sanitizedValue) || 0
                            const intValue = Math.round(floatValue * 100)
                            field.onChange(intValue)
                          }}
                          onFocus={(e) => e.target.select()}
                        />
                      </div>
                    </Field>
                  )}
                />
              ))}
            </div>
          )}

          {/* ============================= */}
          {/* 🚀 LOGÍSTICA RANGOOO ATIVA */}
          {/* ============================= */}
          {isRangooo && selectedPlan === PlanType.PRO && systemSettings && (
            <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-bold">🚀 Logística Rangooo Ativada</p>
              <p>Seus clientes pagarão as taxas oficiais:</p>

              <div className="grid grid-cols-3 gap-2 font-medium">
                <div>Urbana: R$ {(systemSettings.URBAN / 100).toFixed(2)}</div>
                <div>
                  Distrito: R$ {(systemSettings.DISTRICT / 100).toFixed(2)}
                </div>
                <div>Rural: R$ {(systemSettings.RURAL / 100).toFixed(2)}</div>
              </div>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t pt-6">
        <Button variant="outline" onClick={() => form.reset()} type="button">
          Cancelar
        </Button>

        <Button
          type="submit"
          form="form-rhf-plans"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PlansSection
