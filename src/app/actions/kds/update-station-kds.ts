// app/actions/kds/update-station-kds.ts
"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/prisma"
import { StationKdsFormInput, stationKdsSchema } from "@/schemas/kds.schemas"
import { Prisma } from "@misael1981/rangooo-database"

type ActionResult = { success: true } | { success: false; error: string }

export async function updateStationKds(
  id: string,
  slug: string,
  input: StationKdsFormInput,
): Promise<ActionResult> {
  const parsed = stationKdsSchema.safeParse(input)
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
    await db.kdsStation.update({
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
      return { success: false, error: "Já existe uma etapa com esse nome." }
    }
    console.error("Erro ao atualizar etapa:", e)
    return { success: false, error: "Erro ao atualizar etapa." }
  }

  revalidatePath(`/${slug}/kds`)
  return { success: true }
}
