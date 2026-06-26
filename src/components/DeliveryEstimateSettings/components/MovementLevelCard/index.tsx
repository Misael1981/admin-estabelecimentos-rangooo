import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DeliveryEstimateForm } from "@/schemas/delivery-estimate-settings-schemas"
import { Controller, useFormContext } from "react-hook-form"

const MovementLevelCard = () => {
  const { control } = useFormContext<DeliveryEstimateForm>()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel className="text-lg"> Movimento Atual</FieldLabel>
        <FieldDescription>
          Ajuste o nível de movimento da operação para refletir a demanda atual
          e melhorar a precisão das estimativas.
        </FieldDescription>
      </div>
      <Controller
        control={control}
        name="movementLevel"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            <Field orientation="horizontal">
              <RadioGroupItem value="LOW" id="low" />
              <FieldLabel htmlFor="low">Baixo</FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <RadioGroupItem value="NORMAL" id="normal" />
              <FieldLabel htmlFor="normal">Médio</FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <RadioGroupItem value="HIGH" id="high" />
              <FieldLabel htmlFor="high">Alto</FieldLabel>
            </Field>
          </RadioGroup>
        )}
      />
    </div>
  )
}

export default MovementLevelCard
