import { getCustomers } from "@/data/orders/get-customers.queries"
import HeaderOrdersPage from "../components/HeaderOrdersPage"
import Link from "next/link"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PaginationButtons from "@/components/PaginationButtons"

interface ClientsPageProps {
  params: Promise<{
    slug: string
  }>
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

  const { customers, meta } = await getCustomers({
    slug,
    page: currentPage,
    search: currentSearch,
  })

  return (
    <div className="space-y-8">
      <HeaderOrdersPage
        slug={slug}
        title="Lista de Clientes do Estabelecimento"
      />

      <section className="space-y-4">
        {customers.map((cust) => (
          <Link
            key={cust.id}
            href={`/${slug}/pedidos/clientes/${cust.id}`}
            className="mx-auto block w-full max-w-xl"
          >
            <Card className="flex flex-row justify-between p-4">
              <CardTitle>{cust.name}</CardTitle>

              <Badge>{cust.customerCode}</Badge>
            </Card>
          </Link>
        ))}
      </section>

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
    </div>
  )
}
