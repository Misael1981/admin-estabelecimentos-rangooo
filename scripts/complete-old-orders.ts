import { prisma } from "@misael1981/rangooo-database"
import { OrderStatus } from "@misael1981/rangooo-database"

async function main() {
  console.log("🧹 Iniciando o limpa geral de pedidos antigos...")

  // 1. Busca todos os pedidos que ficaram "abertos" (tudo que não é DELIVERED e nem CANCELED)
  const openOrders = await prisma.order.findMany({
    where: {
      NOT: {
        status: {
          in: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
        },
      },
    },
    select: { id: true },
  })

  const totalToUpdate = openOrders.length

  if (totalToUpdate === 0) {
    console.log("✨ Nenhum pedido antigo pendente encontrado. Tudo limpo!")
    return
  }

  console.log(
    `📦 Encontrados ${totalToUpdate} pedidos antigos pendentes. Atualizando para DELIVERED...`,
  )

  // 2. Atualiza todos em massa usando o updateMany para voar baixo em performance
  const orderIds = openOrders.map((o) => o.id)

  const result = await prisma.order.updateMany({
    where: {
      id: { in: orderIds },
    },
    data: {
      status: OrderStatus.DELIVERED,
    },
  })

  console.log(
    `✅ ${result.count} pedidos antigos foram marcados como DELIVERED com sucesso!`,
  )
  console.log(
    "⚠️ ATENÇÃO: Agora você precisa rodar novamente o script de migração do CRM para recalcular os valores corretos!",
  )
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar a limpeza de pedidos:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
