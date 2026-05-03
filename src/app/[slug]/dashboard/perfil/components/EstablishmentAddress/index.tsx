"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateRestaurantAddress } from "@/app/actions/update-address"

type AddressFormValues = z.infer<typeof establishmentAddressSchema>

interface EstablishmentAddressProps {
  initialData: AddressFormValues
  restaurantId: string
  slug: string
}

const establishmentAddressSchema = z.object({
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  complement: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2).max(2, "Use apenas a sigla (ex: SP)"),
  country: z.string().optional(),
  zipCode: z.string().optional(),
})

const EstablishmentAddress = ({
  initialData,
  restaurantId,
  slug,
}: EstablishmentAddressProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(establishmentAddressSchema),
    defaultValues: initialData,
  })

  // Função para buscar CEP
  const handleZipCodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const cep = e.target.value.replace(/\D/g, "")
    if (cep.length === 8) {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setValue("street", data.logradouro)
        setValue("neighborhood", data.bairro)
        setValue("city", data.localidade)
        setValue("state", data.uf)
        // Coloca o foco no número para o usuário continuar
        document.getElementById("number")?.focus()
      }
    }
  }

  const onSubmit = async (data: AddressFormValues) => {
    try {
      const result = await updateRestaurantAddress({
        restaurantId,
        ...data,
        slug,
      })

      if (result.success) {
        toast.success("Endereço atualizado com sucesso!")
      } else {
        toast.error(result.error || "Erro ao atualizar endereço.")
      }
    } catch (error) {
      toast.error("Erro crítico ao salvar dados.")
      console.error(error)
    }
  }

  return (
    <section className="flex items-center justify-center py-4">
      <Card className="w-full max-w-3xl border-2">
        <CardHeader>
          <CardTitle className="text-xl">Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel>CEP</FieldLabel>
                <Input
                  {...register("zipCode")}
                  onChange={handleZipCodeChange}
                  placeholder="00000-000"
                />
                {errors.zipCode && (
                  <p className="text-xs text-red-500">
                    {errors.zipCode.message}
                  </p>
                )}
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Rua/Logradouro</FieldLabel>
                <Input {...register("street")} />
                {errors.street && (
                  <p className="text-xs text-red-500">
                    {errors.street.message}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel>Número</FieldLabel>
                <Input id="number" {...register("number")} />
                {errors.number && (
                  <p className="text-xs text-red-500">
                    {errors.number.message}
                  </p>
                )}
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel>Complemento</FieldLabel>
                <Input
                  {...register("complement")}
                  placeholder="Apto, Bloco, etc."
                />
                {errors.complement && (
                  <p className="text-xs text-red-500">
                    {errors.complement.message}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel>Bairro</FieldLabel>
                <Input {...register("neighborhood")} />
                {errors.neighborhood && (
                  <p className="text-xs text-red-500">
                    {errors.neighborhood.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel>Cidade</FieldLabel>
                <Input {...register("city")} />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel>Estado</FieldLabel>
                <Input {...register("state")} />
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state.message}</p>
                )}
              </Field>
            </div>

            <Button type="submit" className="w-full">
              Salvar Endereço
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default EstablishmentAddress
