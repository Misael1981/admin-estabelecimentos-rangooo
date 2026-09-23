import { db } from "@/lib/prisma"

export async function getEstablishmentDataAndContractBySlug(slug: string) {
  try {
    const [establishment, activeContract] = await Promise.all([
      db.restaurant.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
          plan: true,
          subscription: true,
        },
      }),

      db.contractTemplate.findFirst({
        where: {
          isActive: true,
        },
      }),
    ])

    if (!establishment) {
      return {
        establishment: null,
        activeContract: null,
        error: "Estabelecimento não encontrado.",
      }
    }

    return { establishment, activeContract, error: null }
  } catch (error) {
    console.error("Erro ao buscar dados do estabelecimento e contrato:", error)
    return {
      establishment: null,
      activeContract: null,
      error: "Erro ao carregar os dados.",
    }
  }
}
