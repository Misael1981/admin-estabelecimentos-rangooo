// app/actions/create-station-kds.ts
"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/prisma"
import { StationKdsFormInput, stationKdsSchema } from "@/schemas/kds.schemas"
import { Prisma } from "@misael1981/rangooo-database"

type ActionResult = { success: true } | { success: false; error: string }

export async function createStationKds(
  slug: string,
  input: StationKdsFormInput,
): Promise<ActionResult> {
  // Valida de novo no servidor: nunca confie só na validação do client
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

  // TODO: aqui confirme que o usuário logado no painel admin
  // realmente é dono/gerente desse restaurante.

  try {
    await db.kdsStation.create({
      data: { ...parsed.data, restaurantId: restaurant.id },
    })
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return { success: false, error: "Já existe uma etapa com esse nome." }
    }
    console.error("Erro ao criar etapa:", e)
    return { success: false, error: "Erro ao criar etapa." }
  }

  revalidatePath(`/${slug}/kds`) // ajuste pra rota real do seu painel
  return { success: true }
}
