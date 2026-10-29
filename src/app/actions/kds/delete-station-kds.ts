"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/rangooo-database"

type ActionResult = { success: true } | { success: false; error: string }

export async function deleteStationKds(
  id: string,
  slug: string,
): Promise<ActionResult> {
  if (!id || !slug) {
    return { success: false, error: "Parâmetros inválidos." }
  }

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (!restaurant) {
    return { success: false, error: "Estabelecimento não encontrado." }
  }

  try {
    await db.kdsStation.delete({
      where: {
        id,
        restaurantId: restaurant.id,
      },
    })
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return {
        success: false,
        error:
          "Não é possível excluir esta etapa pois existem pedidos vinculados a ela.",
      }
    }

    console.error("Erro ao deletar etapa do KDS:", e)
    return { success: false, error: "Erro ao excluir etapa." }
  }

  revalidatePath(`/${slug}/kds`)
  return { success: true }
}
