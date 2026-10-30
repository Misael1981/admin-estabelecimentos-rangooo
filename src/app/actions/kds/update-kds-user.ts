"use server"

import { db } from "@/lib/prisma"
import { kdsUserFormInput, kdsUserSchema } from "@/schemas/kds.schemas"
import { Prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

type ActionResult = { success: true } | { success: false; error: string }

export async function updateKdsUser(
  id: string,
  slug: string,
  input: kdsUserFormInput,
): Promise<ActionResult> {
  const parsed = kdsUserSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." }
  }

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (!restaurant) {
    return { success: false, error: "Estabelecimento não encontrado." }
  }

  try {
    await db.kdsUser.update({
      where: {
        id,
        restaurantId: restaurant.id,
      },
      data: parsed.data,
    })
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return { success: false, error: "Já existe um usuário com esse nome." }
    }
    console.error("Erro ao atualizar acesso ao usuário:", e)
    return { success: false, error: "Erro ao atualizar acesso ao usuário." }
  }

  revalidatePath(`/${slug}/kds`)
  return { success: true }
}
