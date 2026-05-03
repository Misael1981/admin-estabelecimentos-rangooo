"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { updateRestaurantContacts } from "@/app/actions/update-restaurant-contacts"

const contactsSchema = z.object({
  contacts: z
    .array(
      z.object({
        type: z.enum(["WHATSAPP", "PHONE"]),
        number: z.string().min(10, "Número inválido"),
        isPrimary: z.boolean(),
      }),
    )
    .min(1, "Adicione ao menos um contato"),
})

type ContactsFormValues = z.infer<typeof contactsSchema>

interface EstablishmentContactsProps {
  restaurantId: string
  initialContacts: ContactsFormValues["contacts"]
}

const EstablishmentContacts = ({
  restaurantId,
  initialContacts,
}: EstablishmentContactsProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactsFormValues>({
    resolver: zodResolver(contactsSchema),
    defaultValues: {
      contacts: initialContacts,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  })

  const onSubmit = async (data: ContactsFormValues) => {
    try {
      const result = await updateRestaurantContacts({
        restaurantId,
        contacts: data.contacts,
      })
      if (result.success) {
        toast.success("Dados atualizados com sucesso!")
      } else {
        toast.error(result.error || "Erro ao atualizar perfil.")
      }
    } catch (error) {
      console.error("Erro ao atualizar contatos:", error)
    }
  }

  return (
    <section className="flex items-center justify-center py-4">
      <Card className="w-full max-w-3xl border-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Canais de Atendimento</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ type: "WHATSAPP", number: "", isPrimary: false })
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group relative grid grid-cols-1 items-end gap-4 rounded-lg border p-4 transition-colors md:grid-cols-12"
              >
                {/* Tipo de Contato */}
                <div className="md:col-span-3">
                  <FieldLabel className="text-xs">Tipo</FieldLabel>
                  <Select
                    defaultValue={field.type}
                    onValueChange={(val) =>
                      register(`contacts.${index}.type`).onChange({
                        target: { value: val },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="PHONE">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Número */}
                <div className="md:col-span-5">
                  <FieldLabel className="text-xs">Número</FieldLabel>
                  <Input
                    placeholder="(00) 0 0000-0000"
                    {...register(`contacts.${index}.number`)}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      e.target.value = formatted
                      register(`contacts.${index}.number`).onChange(e)
                    }}
                  />
                </div>

                {/* Principal */}
                <div className="flex items-center gap-2 pb-3 md:col-span-3">
                  <Checkbox
                    id={`primary-${index}`}
                    {...register(`contacts.${index}.isPrimary`)}
                  />
                  <FieldLabel
                    htmlFor={`primary-${index}`}
                    className="mb-0 cursor-pointer text-xs"
                  >
                    Principal?
                  </FieldLabel>
                </div>

                {/* Botão Remover */}
                <div className="md:col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {errors.contacts?.message && (
              <p className="text-sm text-red-500">{errors.contacts.message}</p>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full md:w-fit">
                Atualizar Contatos
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default EstablishmentContacts
