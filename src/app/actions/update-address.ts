"use server"

import { prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

interface UpdateAddressParams {
  restaurantId: string
  slug: string
  street: string
  number: string
  neighborhood: string
  complement?: string
  city: string
  state: string
  zipCode?: string
  country?: string
}

export async function updateRestaurantAddress({
  restaurantId,
  slug,
  ...addressData
}: UpdateAddressParams) {
  try {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: addressData,
    })

    revalidatePath(`/${slug}/dashboard/perfil`)

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar endereço:", error)
    return { success: false, error: "Falha ao salvar o endereço." }
  }
}
