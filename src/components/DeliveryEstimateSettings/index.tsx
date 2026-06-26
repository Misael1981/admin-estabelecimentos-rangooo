"use client"

import { FormProvider, useForm } from "react-hook-form"
import EstimatedMinutes from "./components/EstimatedMinutes"
import EstimateModeCard from "./components/EstimateModeCard"
import MovementLevelCard from "./components/MovementLevelCard"
import {
  DeliveryEstimateForm,
  deliveryEstimateSchema,
} from "@/schemas/delivery-estimate-settings-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { Button } from "../ui/button"
import { DeliveryEstimateDTO } from "@/dtos/delivery-estimate.dto"
import { updateDeliveryEstimate } from "@/app/actions/update-delivery-estimate"
import { toast } from "sonner"

type DeliveryEstimateSettingsProps = {
  deliveryEstimate: DeliveryEstimateDTO | null
  restaurantId: string
  slug: string
}

const DeliveryEstimateSettings = ({
  deliveryEstimate,
  restaurantId,
  slug,
}: DeliveryEstimateSettingsProps) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<DeliveryEstimateForm>({
    resolver: zodResolver(deliveryEstimateSchema),

    defaultValues: {
      mode: deliveryEstimate?.mode ?? "FIXED",
      movementLevel: deliveryEstimate?.movementLevel ?? "NORMAL",
      fallbackMinutes: deliveryEstimate?.fallbackMinutes ?? 40,
    },
  })

  async function onSubmit(values: DeliveryEstimateForm) {
    startTransition(async () => {
      try {
        const result = await updateDeliveryEstimate({
          restaurantId,
          slug,
          values,
        })
        if (result.success) {
          toast.success("Tempo de entrega atualizado com sucesso!")
        } else {
          toast.error(result.error || "Erro ao atualizar tempo de entrega.")
        }
      } catch (error) {
        toast.error("Erro crítico de conexão.")
        console.error(error)
      }
    })
  }

  return (
    <FormProvider {...form}>
      <section className="w-full space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            Configuração da Estimativa de Entrega
          </h3>
          <p className="text-muted-foreground text-sm">
            Defina como o Rangooo calcula o tempo estimado de entrega dos
            pedidos. Você pode utilizar um tempo fixo ou permitir que o sistema
            ajuste automaticamente as estimativas com base no histórico de
            entregas e no nível de movimento da operação.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col justify-center gap-8 lg:flex-row lg:justify-between">
            <EstimateModeCard />
            <MovementLevelCard />
            <EstimatedMinutes />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </section>
    </FormProvider>
  )
}

export default DeliveryEstimateSettings
