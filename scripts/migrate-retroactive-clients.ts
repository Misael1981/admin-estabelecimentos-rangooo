import { PrismaClient } from "@misael1981/rangooo-database"

const prisma = new PrismaClient()

async function main() {
  console.log("🔄 Iniciando migração retroativa de clientes...")
  const aggregations = await prisma.order.groupBy({
    by: ["restaurantId", "userId"],
    _count: {
      id: true,
    },
    _sum: {
      totalAmount: true,
    },
    where: {
      // Opcional: Garante que só conta pedidos que foram realmente concluídos/entregues
      status: "DELIVERED",
    },
  })

  console.log(
    `📊 Encontrados ${aggregations.length} vínculos únicos de Cliente x Restaurante para processar.`,
  )

  let criados = 0

  // 2. Itera sobre os agrupamentos e popula a nova tabela
  for (const agg of aggregations) {
    const { restaurantId, userId } = agg
    const totalOrders = agg._count.id
    const totalSpent = agg._sum.totalAmount || 0

    // Usamos o upsert para evitar duplicidade caso o script seja rodado duas vezes por acidente
    await prisma.restaurantClient.upsert({
      where: {
        restaurantId_userId: {
          restaurantId,
          userId,
        },
      },
      update: {
        totalOrders,
        totalSpent,
      },
      create: {
        restaurantId,
        userId,
        totalOrders,
        totalSpent,
      },
    })

    criados++
    if (criados % 50 === 0) {
      console.log(
        `✨ Processados ${criados}/${aggregations.length} registros...`,
      )
    }
  }

  console.log("✅ Migração retroativa concluída com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar a migração retroativa:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
