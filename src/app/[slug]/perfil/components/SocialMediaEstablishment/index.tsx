"use client"

import { z } from "zod"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { updateSocialMediaAction } from "@/app/actions/update-social-media"

type SocialMediaFormValues = z.infer<typeof socialMediaSchema>

interface SocialMediaEstablishmentProps {
  initialSocialMedia: unknown
  initialEmail: string
  restaurantId: string
}

const socialMediaSchema = z.object({
  socialMedia: z.array(
    z.object({
      name: z.string().min(1, "Diga o nome da rede social"),
      url: z.string().url("A URL da rede social é inválida"),
    }),
  ),
  email: z.string().email("O email é inválido"),
})

const SocialMediaEstablishment = ({
  initialSocialMedia,
  initialEmail,
  restaurantId,
}: SocialMediaEstablishmentProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      email: initialEmail,
      socialMedia:
        (initialSocialMedia as unknown as SocialMediaFormValues["socialMedia"]) ||
        [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialMedia",
  })

  const onSubmit = async (data: SocialMediaFormValues) => {
    try {
      const result = await updateSocialMediaAction({
        restaurantId,
        email: data.email,
        socialMedia: data.socialMedia,
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
    <section className="flex items-center justify-center py-4">
      <Card className="w-full max-w-3xl border-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Redes Sociais & Contato</CardTitle>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", url: "" })}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Rede
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo de E-mail (Fora do array) */}
            <div className="space-y-2 border-b pb-6">
              <FieldLabel>E-mail de Contato Público</FieldLabel>
              <Input
                {...register("email")}
                placeholder="contato@restaurante.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Lista Dinâmica de Redes Sociais */}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-end"
                >
                  <div className="flex-1 space-y-2">
                    <FieldLabel>Nome (Ex: Instagram)</FieldLabel>
                    <Input
                      {...register(`socialMedia.${index}.name`)}
                      placeholder="Instagram"
                    />
                  </div>

                  <div className="flex-2 space-y-2">
                    <FieldLabel>URL do Perfil</FieldLabel>
                    <Input
                      {...register(`socialMedia.${index}.url`)}
                      placeholder="https://instagram.com/seu-perfil"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default SocialMediaEstablishment
