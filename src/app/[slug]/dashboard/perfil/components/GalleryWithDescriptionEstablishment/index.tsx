"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import imageCompression from "browser-image-compression"
import { updateGalleryDescription } from "@/app/actions/update-gallery-description"
import ImageUpload from "@/components/ImageUpload"

type GalleryWithDescriptionValue = z.infer<typeof galleryWithDescriptionSchema>

interface GalleryWithDescriptionEstablishmentProps {
  description: string
  avatarImageUrl: string
  coverImageUrl: string
  restaurantId: string
  slug: string
}

const galleryWithDescriptionSchema = z.object({
  avatarImageUrl: z
    .union([z.string(), z.any()])
    .refine((val) => val, "Imagem de perfil obrigatória"),
  coverImageUrl: z
    .union([z.string(), z.any()])
    .refine((val) => val, "Imagem de capa obrigatória"),
  description: z.string().optional(),
})

const GalleryWithDescriptionEstablishment = ({
  description,
  avatarImageUrl,
  coverImageUrl,
  restaurantId,
  slug,
}: GalleryWithDescriptionEstablishmentProps) => {
  const form = useForm<GalleryWithDescriptionValue>({
    resolver: zodResolver(galleryWithDescriptionSchema),
    defaultValues: {
      description,
      avatarImageUrl,
      coverImageUrl,
    },
  })

  const uploadToCloudinaryClient = async (file: File) => {
    const options = {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1080,
      useWebWorker: true,
    }

    try {
      const compressedFile = await imageCompression(file, options)

      const formData = new FormData()
      formData.append("file", compressedFile)
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      )

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )

      const data = await response.json()
      return {
        url: data.secure_url,
        publicId: data.public_id,
      }
    } catch (error) {
      console.error("Erro na compressão ou upload:", error)
      throw error
    }
  }

  const onSubmit = async (data: GalleryWithDescriptionValue) => {
    try {
      let finalAvatarUrl = avatarImageUrl as string
      let finalCoverUrl = coverImageUrl as string

      // Fazer upload da imagem de perfil se for um arquivo
      if (data.avatarImageUrl instanceof File) {
        try {
          const uploadResult = await uploadToCloudinaryClient(
            data.avatarImageUrl,
          )
          finalAvatarUrl = uploadResult.url
        } catch (err) {
          toast.error("Falha ao subir a imagem de perfil para a nuvem.")
          console.error("Erro ao subir avatar:", err)
          return
        }
      }

      // Fazer upload da imagem de capa se for um arquivo
      if (data.coverImageUrl instanceof File) {
        try {
          const uploadResult = await uploadToCloudinaryClient(
            data.coverImageUrl,
          )
          finalCoverUrl = uploadResult.url
        } catch (err) {
          toast.error("Falha ao subir a imagem de capa para a nuvem.")
          console.error("Erro ao subir capa:", err)
          return
        }
      }

      // Salvar os dados no banco
      const result = await updateGalleryDescription({
        restaurantId,
        description: data.description ?? "",
        avatarImageUrl: finalAvatarUrl,
        coverImageUrl: finalCoverUrl,
        slug,
      })

      if (result.success) {
        toast.success("Identidade visual atualizada com sucesso!")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Erro ao processar as imagens.")
      console.error(error)
    }
  }

  return (
    <section className="flex items-center justify-center py-4">
      <Card className="w-full max-w-3xl border-2">
        <CardHeader>
          <CardTitle className="text-xl">Identidade Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Upload da Logo */}
              <div className="space-y-2">
                <FieldLabel>Logo do Estabelecimento</FieldLabel>
                <ImageUpload
                  name="avatarImageUrl"
                  form={form}
                  initialUrl={avatarImageUrl}
                />
              </div>

              {/* Upload da Capa */}
              <div className="space-y-2">
                <FieldLabel>Imagem de Capa</FieldLabel>
                <ImageUpload
                  name="coverImageUrl"
                  form={form}
                  initialUrl={coverImageUrl}
                />
              </div>
            </div>

            <Field>
              <FieldLabel>Descrição / Sobre nós</FieldLabel>
              <Textarea
                {...form.register("description")}
                placeholder="Conte um pouco sobre a história do seu restaurante..."
                className="h-32"
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </Field>

            <Button type="submit" className="w-full">
              Salvar Identidade Visual
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default GalleryWithDescriptionEstablishment
