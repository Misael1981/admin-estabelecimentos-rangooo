"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

interface GalleryWithDescriptionEstablishmentProps {
  description: string
  avatarImageUrl: string
  coverImageUrl: string
  restaurantId: string
  slug: string
}

export async function updateGalleryDescription({
  restaurantId,
  description,
  avatarImageUrl,
  coverImageUrl,
  slug,
}: GalleryWithDescriptionEstablishmentProps) {
  try {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        description,
        avatarImageUrl,
        coverImageUrl,
      },
    })

    revalidatePath(`/${slug}/dashboard/perfil`)

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar identidade visual:", error)
    return { success: false, error: "Falha ao salvar a identidade visual." }
  }
}
