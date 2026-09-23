"use server"

import { db } from "@/lib/prisma"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

type AcceptContractInput = {
  restaurantId: string
  contractVersion: string
}

export async function acceptContractAction({
  restaurantId,
  contractVersion,
}: AcceptContractInput) {
  try {
    const headersList = await headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")

    const clientIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "127.0.0.1"

    // Busca o ID do plano padrão (ex: BÁSICO) caso precise criar a Subscription
    const defaultPlan = await db.subscriptionPlan.findFirst({
      where: { isActive: true },
    })

    if (!defaultPlan) {
      return {
        success: false,
        message: "Nenhum plano de assinatura ativo foi encontrado no sistema.",
      }
    }

    // Calcula a data de fim do período (ex: 30 dias a partir de hoje)
    const currentPeriodEnd = new Date()
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30)

    // Usa UPSERT para atualizar se existir, ou criar se não existir
    const updatedSubscription = await db.subscription.upsert({
      where: {
        restaurantId,
      },
      update: {
        contractAcceptedAt: new Date(),
        contractAcceptedIp: clientIp,
        contractVersion,
      },
      create: {
        restaurantId,
        planId: defaultPlan.id,
        contractAcceptedAt: new Date(),
        contractAcceptedIp: clientIp,
        contractVersion,
        currentPeriodEnd,
        status: "ACTIVE",
      },
    })

    revalidatePath("/[slug]/configuracoes/contrato") // Ajuste a rota se necessário

    return {
      success: true,
      message: "Contrato aceito com sucesso!",
      data: updatedSubscription,
    }
  } catch (error) {
    console.error("Erro ao registrar aceite do contrato:", error)
    return {
      success: false,
      message: "Não foi possível registrar o aceite. Tente novamente.",
    }
  }
}
