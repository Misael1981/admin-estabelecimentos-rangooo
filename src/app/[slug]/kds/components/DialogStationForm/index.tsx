"use client"

import { createStationKds } from "@/app/actions/kds/create-station-kds"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { CirclePlus } from "lucide-react"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

interface DialogStationFormProps {
  slug: string
}

const DialogStationForm = ({ slug }: DialogStationFormProps) => {
  const [open, setOpen] = useState(false)
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
      name: "",
      order: undefined,
      active: true,
    },
  })

  const onSubmit = (data: StationKdsFormValues) => {
    startTransition(async () => {
      const result = await createStationKds(slug, data)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Etapa criada com sucesso!")
      reset()
      setOpen(false)
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) reset() // limpa o form ao fechar
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">
          <CirclePlus className="size-4" />
          Adicionar etapa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Nova Etapa de Preparo</DialogTitle>
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
              {isPending ? "Salvando..." : "Criar Etapa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogStationForm
