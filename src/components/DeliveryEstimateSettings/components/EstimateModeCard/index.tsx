import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DeliveryEstimateForm } from "@/schemas/delivery-estimate-settings-schemas"
import { Controller, useFormContext } from "react-hook-form"

const EstimateModeCard = () => {
  const { control, watch } = useFormContext<DeliveryEstimateForm>()
  const mode = watch("mode")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel className="text-lg">
          Como o tempo de entrega será calculado?
        </FieldLabel>
        <FieldDescription>
          Escolha entre um tempo fixo definido por você ou um cálculo automático
          baseado no histórico de entregas.
        </FieldDescription>
      </div>
      <Controller
        control={control}
        name="mode"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            <Field orientation="horizontal">
              <RadioGroupItem value="FIXED" id="fixed" />
              <FieldLabel>
                {mode === "FIXED" ? "Tempo de Entrega" : "Tempo de Fallback"}
              </FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <RadioGroupItem value="AUTOMATIC" id="automatic" />
              <FieldLabel htmlFor="automatic">Cálculo Automático</FieldLabel>
            </Field>
          </RadioGroup>
        )}
      />
      <FieldDescription>
        {mode === "FIXED"
          ? "Esse será o tempo informado em todos os pedidos."
          : "Usado apenas quando não houver histórico de entregas suficiente para o cálculo automático."}
      </FieldDescription>
    </div>
  )
}

export default EstimateModeCard
