"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"
import z from "zod"

const createCategorySchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres."),
  isDouble: z.boolean().default(false),
  slug: z.string().min(1),
  displayOrder: z.number().int().min(0).optional(),
})

export type CreateCategoryInput = z.input<typeof createCategorySchema>

const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres."),
  isDouble: z.boolean(),
  slug: z.string().min(1),
  displayOrder: z.number().int().min(0),
})

export async function createCategory(input: CreateCategoryInput) {
  try {
    const parsed = createCategorySchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { name, isDouble, slug, displayOrder } = parsed.data

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
      select: { displayOrder: true },
    })

    const nextOrder =
      displayOrder ?? (lastCategory ? lastCategory.displayOrder + 1 : 0)

    const newCategory = await prisma.menuCategory.create({
      data: {
        name,
        isDouble,
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

export async function updateCategory(
  input: z.input<typeof updateCategorySchema>,
) {
  try {
    const parsed = updateCategorySchema.safeParse(input)

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { id, name, isDouble, slug, displayOrder } = parsed.data

    const result = await prisma.menuCategory.updateMany({
      where: { id, restaurant: { slug } },
      data: { name, isDouble, displayOrder },
    })

    if (result.count === 0) {
      return { success: false, error: "Tabela não encontrada." }
    }

    revalidatePath(`/${slug}/dashboard/cardapio`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error)
    return { success: false, error: "Falha ao atualizar categoria" }
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
