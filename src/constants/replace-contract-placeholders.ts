import { PlanType } from "./enums"
import { PLANS_DETAILS } from "./maps-options"

export function replaceContractPlaceholders(
  content: string,
  establishment: {
    name: string
    plan: PlanType
    owner?: { name: string } | null
  },
) {
  const planInfo = PLANS_DETAILS.find((p) => p.id === establishment.plan)

  const formattedPrice = planInfo
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(planInfo.price)
    : "A consultar"

  const planTitle = planInfo ? planInfo.title : establishment.plan

  // 4. Data atual formatada (DD/MM/AAAA)
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  // 5. Substitui todas as variáveis no texto do contrato
  return content
    .replace(/\{\{nome_estabelecimento\}\}/g, establishment.name)
    .replace(/\{\{cnpj_cpf\}\}/g, "Não informado / Pessoa Física")
    .replace(
      /\{\{nome_proprietario\}\}/g,
      establishment.owner?.name || "Responsável Legal",
    )
    .replace(/\{\{plano_nome\}\}/g, planTitle)
    .replace(/\{\{plano_valor\}\}/g, formattedPrice)
    .replace(/\{\{data_aceite\}\}/g, currentDate)
}
