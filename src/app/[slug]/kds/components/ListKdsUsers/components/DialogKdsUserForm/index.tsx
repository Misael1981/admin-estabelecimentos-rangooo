"use client"

import { createKdsUser } from "@/app/actions/kds/create-kds-user"
import { updateKdsUser } from "@/app/actions/kds/update-kds-user"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { KdsRole } from "@/constants/enums"
import { KDS_ROLE_OPTIONS } from "@/constants/options"
import {
  kdsUserFormInput,
  kdsUserFormValues,
  kdsUserSchema,
} from "@/schemas/kds.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type DialogKdsUserFormProps = {
  slug: string
  user?: {
    name: string
    id: string
    role: KdsRole
    username: string
    active: boolean
    pinHash: string
  }
  open: boolean
  onOpenChange: (nextOpen: boolean) => void
}

const DialogKdsUserForm = ({
  slug,
  user,
  open,
  onOpenChange,
}: DialogKdsUserFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [showPin, setShowPin] = useState(false)

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<kdsUserFormInput, unknown, kdsUserFormValues>({
    resolver: zodResolver(kdsUserSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      role: user?.role || KdsRole.OPERATOR,
      pinHash: user?.pinHash || "",
      active: user?.active ?? true,
    },
  })

  const onSubmit = (data: kdsUserFormInput) => {
    startTransition(async () => {
      const result = user?.id
        ? await updateKdsUser(user.id, slug, data)
        : await createKdsUser(slug, data)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(
        user?.id
          ? "Usuário atualizado com sucesso!"
          : "Usuário criado com sucesso!",
      )
      reset()
      onOpenChange(false)
    })
  }

  const labelButton = user?.id ? "Salvar Alterações" : "Criar Acesso"

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
      <DialogContent className="max-h-[90vh] sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {user?.id ? "Editar Acesso do Colaborador" : "Novo Acesso ao KDS"}
            </DialogTitle>
            <DialogDescription>
              Cadastre as credenciais e defina a função do operador para acesso
              à linha de produção da cozinha.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="scrollbar max-h-[60vh] overflow-x-hidden overflow-y-auto pr-2">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="active">Status do Acesso</FieldLabel>
                <FieldDescription>
                  Desative temporariamente para impedir o login deste
                  colaborador.
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
              <FieldLabel>Função / Cargo no KDS</FieldLabel>
              <FieldDescription>
                Define as permissões e o nível de acesso do colaborador.
              </FieldDescription>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a função..." />
                    </SelectTrigger>
                    <SelectContent>
                      {KDS_ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.role?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Nome do Colaborador</FieldLabel>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: Maria da Silva (Montagem)"
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Usuário de Login</FieldLabel>
              <FieldDescription>
                Nome curto usado para identificar o operador na tela de acesso.
              </FieldDescription>
              <Input
                id="username"
                {...register("username")}
                placeholder="Ex: maria.cozinha"
              />
              <FieldError>{errors.username?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="pinHash">Senha Numérica (PIN)</FieldLabel>
              <FieldDescription>
                Senha rápida de 4 a 6 dígitos para o operador digitar no
                terminal.
              </FieldDescription>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  id="pinHash"
                  {...register("pinHash")}
                  placeholder="Ex: 1234"
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPin ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPin((prev) => !prev)}
                  className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-opacity hover:opacity-80"
                >
                  {showPin ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <FieldError>{errors.pinHash?.message}</FieldError>
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

export default DialogKdsUserForm
