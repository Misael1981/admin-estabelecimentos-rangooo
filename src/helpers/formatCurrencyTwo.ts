export function formatCurrencyBRL(value: string) {
  const numeric = value.replace(/\D/g, "")

  const numberValue = Number(numeric) / 100

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })
}

export function parseCurrencyBRL(value: string) {
  // Remove tudo que não é dígito ou vírgula, e troca a vírgula por ponto
  const cleanValue = value.replace(/[^\d,]/g, "").replace(",", ".")
  return Number(cleanValue)
}
