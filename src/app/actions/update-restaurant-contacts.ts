"use server"

import { ContactType, prisma } from "@misael1981/rangooo-database"
import { revalidatePath } from "next/cache"

interface ContactInput {
  type: ContactType
  number: string
  isPrimary: boolean
}

interface UpdateContactsParams {
  restaurantId: string
  contacts: ContactInput[]
}

export async function updateRestaurantContacts({
  restaurantId,
  contacts,
}: UpdateContactsParams) {
  try {
    const cleanedContacts = contacts.map((c) => ({
      ...c,
      number: c.number.replace(/\D/g, ""),
    }))

    await prisma.$transaction([
      prisma.contactNumber.deleteMany({
        where: { restaurantId },
      }),
      prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          contacts: {
            create: cleanedContacts,
          },
        },
      }),
    ])

    revalidatePath("/perfil")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar contatos:", error)
    return { success: false, error: "Falha ao salvar contatos no banco." }
  }
}
