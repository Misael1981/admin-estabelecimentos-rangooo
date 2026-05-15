"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_LABELS, RestaurantCategory } from "@/constants/maps-options"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import z from "zod"
import { convertToSlug } from "@/helpers/convert-to-slug"
import { updateRestaurantProfile } from "@/app/actions/update-restaurant-profile"

const generalInfoSchema = z.object({
  name: z.string().min(2, "Nome obrigatório."),
  category: z.enum(RestaurantCategory, {
    message: "Selecione uma categoria válida",
  }),
  slug: z.string().min(2, "Campo obrigatório."),
})

interface GeneralInformationProps {
  name: string
  category: (typeof RestaurantCategory)[number]
  slug: string
  id: string
}

const GeneralInformation = ({
  name,
  category,
  slug,
  id,
}: GeneralInformationProps) => {
  const form = useForm<z.infer<typeof generalInfoSchema>>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      name,
      category,
      slug,
    },
  })

  const watchName = form.watch("name")

  useEffect(() => {
    if (watchName) {
      const newSlug = convertToSlug(watchName)
      form.setValue("slug", newSlug, { shouldValidate: true })
    }
  }, [watchName, form])

  const onSubmit = async (data: z.infer<typeof generalInfoSchema>) => {
    try {
      const result = await updateRestaurantProfile({
        id,
        ...data,
      })

      if (result.success) {
        toast.success("Dados atualizados com sucesso!")
      } else {
        toast.error(result.error || "Erro ao atualizar perfil.")
      }
    } catch (error) {
      toast.error("Erro crítico de conexão.")
      console.error(error)
    }
  }

  return (
    <section className="flex items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl">Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="grid gap-6 md:grid-cols-2">
              <Field>
                <FieldLabel>Nome do Estabelecimento</FieldLabel>
                <Input {...form.register("name")} />
                {form.formState.errors.name && (
                  <span className="text-xs text-red-500">
                    {form.formState.errors.name.message}
                  </span>
                )}
              </Field>

              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {RestaurantCategory.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {CATEGORY_LABELS[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Slug (Link da vitrine)</FieldLabel>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    rangooo.com/
                  </span>
                  <Input {...form.register("slug")} />
                </div>
              </Field>
            </FieldGroup>

            <div className="flex justify-end">
              <Button type="submit" className="cursor-pointer">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default GeneralInformation
