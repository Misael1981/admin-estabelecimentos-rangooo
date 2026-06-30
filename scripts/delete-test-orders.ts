import { prisma } from "@misael1981/rangooo-database"

// 🚨 COLOQUE O SEU USER_ID DE TESTE AQUI!
// Procure no seu banco o ID do seu usuário que tem os 142 pedidos e substitua essa string.
const MY_TEST_USER_ID = "c20fa87f-df31-43d6-bf28-d3b6b4237dda"

async function main() {
  console.log("🚀 Iniciando a remoção de pedidos de teste...")

  // 1. Deleta os pedidos em massa (O Prisma vai cuidar do cascade se estiver configurado,
  // mas o deleteMany direto na Order usando o userId é tiro certeiro)
  const deletedOrders = await prisma.order.deleteMany({
    where: {
      userId: MY_TEST_USER_ID,
    },
  })

  console.log(
    `🗑️  Sucesso: ${deletedOrders.count} pedidos de teste foram apagados do banco!`,
  )

  // 2. Reseta o CRM do seu usuário de teste em todos os restaurantes
  // Em vez de deletar o vínculo do cliente (o que sumiria com suas notas internas se houver),
  // a gente zera os contadores dele para os restaurantes onde ele testou.
  const updatedCRM = await prisma.restaurantClient.updateMany({
    where: {
      userId: MY_TEST_USER_ID,
    },
    data: {
      totalOrders: 0,
      totalSpent: 0,
    },
  })

  console.log(
    `🔄 CRM Atualizado: ${updatedCRM.count} perfis de restaurante do seu usuário foram zerados.`,
  )
  console.log("✨ Banco de dados limpo e pronto para novos testes reais!")
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar o script de limpeza:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
