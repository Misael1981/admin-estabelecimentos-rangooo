import GenericHeader from "@/components/GenericHeader"
import { ShieldHalf, Trophy, Medal } from "lucide-react"
import SearchesPerMonthButtons from "./components/SearchesPerMonthButtons"
import Link from "next/link"
import { getRestaurantRanking } from "@/data/get-restaurant-ranking"

interface RankingPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ month?: string }>
}

export default async function RankingPage({
  params,
  searchParams,
}: RankingPageProps) {
  const { slug } = await params
  const { month } = await searchParams

  const currentMonth =
    month || String(new Date().getMonth() + 1).padStart(2, "0")
  const currentYear = String(new Date().getFullYear())

  // Chama a nossa query brilhante do Prisma
  const ranking = await getRestaurantRanking({
    slug,
    month: currentMonth,
    year: currentYear,
  })

  const renderMedal = (position: number) => {
    if (position === 1)
      return <Trophy className="h-6 w-6 animate-bounce text-amber-500" />
    if (position === 2) return <Medal className="h-6 w-6 text-slate-400" />
    if (position === 3) return <Medal className="h-6 w-6 text-amber-700" />
    return (
      <span className="text-muted-foreground w-6 text-center text-sm font-bold">
        #{position}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      <GenericHeader
        title="Ranking do Mês"
        description="Acompanhe o ranking dos clientes que mais compraram em seu estabelecimento neste mês."
        icon={ShieldHalf}
      />

      <SearchesPerMonthButtons />

      <section className="space-y-4">
        <p className="text-muted-foreground bg-muted/40 rounded-md py-2 text-center text-sm font-medium">
          Mostrando resultados para o período de {currentMonth}/{currentYear}
        </p>

        {ranking.length === 0 ? (
          <div className="bg-card text-muted-foreground rounded-lg border py-12 text-center text-sm">
            Nenhum pedido concluído encontrado para este mês.
          </div>
        ) : (
          <div className="space-y-2">
            {ranking.map((client) => (
              <Link
                key={client.userId}
                href={`/${slug}/clientes/${client.userId}`}
              >
                <div className="bg-card hover:bg-muted/50 mb-2 flex items-center justify-between gap-4 rounded-lg border p-4 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Medalha ou Posição */}
                    <div className="flex w-8 items-center justify-center">
                      {renderMedal(client.position)}
                    </div>

                    {/* Nome do Cliente */}
                    <div>
                      <h4 className="max-w-45 truncate text-sm font-semibold sm:max-w-xs lg:text-base">
                        {client.name}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {client.totalOrders}{" "}
                        {client.totalOrders === 1 ? "pedido" : "pedidos"} no mês
                      </p>
                    </div>
                  </div>

                  {/* Valor acumulado no mês */}
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Total Gasto</p>
                    <p className="text-sm font-bold text-emerald-500 lg:text-base">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(client.totalSpent)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
