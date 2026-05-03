"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

interface UpdateSocialMediaParams {
  restaurantId: string
  email: string
  socialMedia: Array<{ name: string; url: string }>
}

export async function updateSocialMediaAction({
  restaurantId,
  email,
  socialMedia,
}: UpdateSocialMediaParams) {
  try {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        email,
        socialMedia: socialMedia,
      },
    })

    revalidatePath("/perfil")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar redes sociais:", error)
    return {
      success: false,
      error: "Não foi possível salvar as redes sociais.",
    }
  }
}
