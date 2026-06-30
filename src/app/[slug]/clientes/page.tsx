import GenericHeader from "@/components/GenericHeader"
import { Button } from "@/components/ui/button"
import { getRestaurantClients } from "@/data/get-restaurantClients"
import { UserStar } from "lucide-react"
import Link from "next/link"
import SearchCustomers from "./components/SearchCustomers"
import CustomerCard from "./components/CustomerCard"
import PaginationButtons from "@/components/PaginationButtons"

interface ClientsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function ClientsPage({
  params,
  searchParams,
}: ClientsPageProps) {
  const { slug } = await params
  const { page, search } = await searchParams

  const currentPage = Number(page) || 1
  const currentSearch = search || ""

  const { clients, meta } = await getRestaurantClients({
    slug,
    page: currentPage,
    search: currentSearch,
  })

  return (
    <div className="space-y-8">
      <GenericHeader
        title="Gerencie seus clientes"
        description="Gerencie seus clientes, fique por dentro do que seus clientes andam pedindo..."
        icon={UserStar}
      />

      <section className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-lg border p-5">
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm">Total de Clientes</p>

          <p className="text-3xl font-bold tracking-tight">{meta.totalCount}</p>
        </div>

        <Link href={`/${slug}/clientes/ranking`}>
          <Button>Acessar Ranking</Button>
        </Link>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Lista de Clientes Ativos</h3>
        </div>

        <SearchCustomers />

        <div className="space-y-2">
          {clients.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center text-sm">
              Nenhum cliente encontrado para essa busca.
            </div>
          ) : (
            clients.map((client) => (
              <CustomerCard key={client.id} client={client} slug={slug} />
            ))
          )}
        </div>

        <PaginationButtons
          queryParams={(novaPagina) => {
            const params = new URLSearchParams()
            if (currentSearch) params.set("search", currentSearch)
            params.set("page", novaPagina.toString())
            return `?${params.toString()}`
          }}
          pagination={{
            paginaAtual: meta.currentPage,
            temPaginaAnterior: meta.hasPrevPage,
            temProximaPagina: meta.hasNextPage,
          }}
        />
      </section>
    </div>
  )
}
