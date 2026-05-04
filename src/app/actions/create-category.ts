"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

interface CreateCategoryInput {
  name: string
  slug: string
}

export async function createCategory({ name, slug }: CreateCategoryInput) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!restaurant) {
      return { success: false, error: "Restaurante não encontrado." }
    }

    const restaurantId = restaurant.id
    const lastCategory = await prisma.menuCategory.findFirst({
      where: { restaurantId },
      orderBy: { displayOrder: "desc" },
    })

    const nextOrder = lastCategory ? lastCategory.displayOrder + 1 : 0

    const newCategory = await prisma.menuCategory.create({
      data: {
        name,
        restaurantId,
        displayOrder: nextOrder,
      },
    })
    revalidatePath(`/${slug}/dashboard/cardapio`)

    return { success: true, data: newCategory }
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return { success: false, error: "Falha ao criar categoria" }
  }
}

export async function deleteCategory(categoryId: string, slug: string) {
  try {
    await prisma.menuCategory.delete({
      where: { id: categoryId },
    })

    revalidatePath(`/${slug}/dashboard/cardapio`)

    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar:", error)
    return {
      success: false,
      error: "Remova todos os produtos desta categoria antes de excluí-la.",
    }
  }
}
