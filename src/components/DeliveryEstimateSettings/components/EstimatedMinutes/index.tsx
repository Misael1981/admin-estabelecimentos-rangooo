import { FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DeliveryEstimateForm } from "@/schemas/delivery-estimate-settings-schemas"
import { useFormContext } from "react-hook-form"

const EstimatedMinutes = () => {
  const { register } = useFormContext<DeliveryEstimateForm>()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FieldLabel className="text-lg">Tempo Estimado</FieldLabel>
        <FieldDescription>
          Informe um tempo padrão ou utilize o histórico de entregas para obter
          uma sugestão automática.
        </FieldDescription>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          {...register("fallbackMinutes", { valueAsNumber: true })}
        />
        <span>minutos</span>
      </div>
    </div>
  )
}

export default EstimatedMinutes
