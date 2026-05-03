"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

const RestaurantCategoryOptions = [
  "RESTAURANT",
  "PIZZARIA",
  "HAMBURGUERIA",
  "SORVETERIA",
  "ADEGA",
] as const

type RestaurantCategoryType = (typeof RestaurantCategoryOptions)[number]

interface UpdateProfileParams {
  id: string
  name: string
  category: RestaurantCategoryType // O enum do Prisma
  slug: string
}

export async function updateRestaurantProfile({
  id,
  ...data
}: UpdateProfileParams) {
  try {
    await prisma.restaurant.update({
      where: { id },
      data,
    })

    revalidatePath(`/(admin)/[slug]/perfil`, "page")

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Erro ao atualizar perfil." }
  }
}
