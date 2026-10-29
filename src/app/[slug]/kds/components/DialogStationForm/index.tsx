"use client"

import { createStationKds } from "@/app/actions/kds/create-station-kds"
import { updateStationKds } from "@/app/actions/kds/update-station-kds"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  StationKdsFormInput,
  StationKdsFormValues,
  stationKdsSchema,
} from "@/schemas/kds.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

interface DialogStationFormProps {
  slug: string
  station?: {
    id: string
    name: string
    order: number
    active: boolean
  }
  open: boolean
  onOpenChange: (nextOpen: boolean) => void
}

const DialogStationForm = ({
  slug,
  station,
  open,
  onOpenChange,
}: DialogStationFormProps) => {
  const [isPending, startTransition] = useTransition()

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<StationKdsFormInput, unknown, StationKdsFormValues>({
    resolver: zodResolver(stationKdsSchema),
    defaultValues: {
      name: station?.name ?? "",
      order: station?.order ?? undefined,
      active: station?.active ?? true,
    },
  })

  const onSubmit = (data: StationKdsFormValues) => {
    startTransition(async () => {
      const result = station?.id
        ? await updateStationKds(station.id, slug, data)
        : await createStationKds(slug, data)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        station?.id
          ? "Etapa atualizada com sucesso!"
          : "Etapa criada com sucesso!",
      )
      reset()
      onOpenChange(false)
    })
  }

  const labelButton = station?.id ? "Editar Etapa" : "Criar Etapa"

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) reset()
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {station?.id ? "Editar" : "Criar"} Etapa de Preparo
            </DialogTitle>
            <DialogDescription>
              Informe o nome da etapa para a linha de produção da cozinha.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="active">Etapa Ativa</FieldLabel>
                <FieldDescription>
                  Caso precise desativar temporariamente essa etapa da produção.
                </FieldDescription>
              </FieldContent>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Nome da Etapa</FieldLabel>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: Forno, Montagem, Embalagem..."
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="order">Ordem do Processo</FieldLabel>
              <FieldDescription>
                A posição dessa etapa no processo de produção.
              </FieldDescription>
              <Input
                id="order"
                type="number"
                min={0}
                {...register("order", { valueAsNumber: true })}
                placeholder="Digite um número"
              />
              <FieldError>{errors.order?.message}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : labelButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogStationForm
