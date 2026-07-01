import GenericHeader from "@/components/GenericHeader"
import { getCustomerDetails } from "@/data/get-customer-details"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { User, UserStar } from "lucide-react"
import { notFound } from "next/navigation"
import NotesForm from "./components/NotesForm"

interface ClientIdPageProps {
  params: Promise<{ slug: string; userId: string }>
}

export default async function ClientIdPage({ params }: ClientIdPageProps) {
  const { slug, userId } = await params

  const data = await getCustomerDetails({ slug, customerId: userId })

  if (!data) {
    return notFound()
  }

  const { profile, orders } = data

  return (
    <div className="space-y-8">
      <GenericHeader
        title="Perfil do Cliente"
        description="Um resumo com o perfil do Usuário."
        icon={UserStar}
      />

      <section className="bg-card flex flex-wrap items-center justify-between gap-4 rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-full">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight lg:text-2xl">
              {profile.user.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {profile.user.email}
            </p>
            {profile.user.phone && (
              <p className="text-muted-foreground text-sm">
                {formatPhoneNumber(profile.user.phone)}
              </p>
            )}
          </div>
        </div>

        {/* Métricas Consolidadas */}
        <div className="flex gap-8 border-l pl-8 max-sm:border-l-0 max-sm:pl-0">
          <div className="text-center">
            <p className="text-muted-foreground text-xs lg:text-sm">
              Pedidos Totais
            </p>
            <p className="text-primary text-xl font-bold lg:text-3xl">
              {profile.totalOrders}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs lg:text-sm">
              Total Gasto
            </p>
            <p className="text-xl font-bold text-emerald-500 lg:text-3xl">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(profile.totalSpent)}
            </p>
          </div>
        </div>
      </section>

      {/* Grid: Esquerda Notas / Direita Histórico */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <NotesForm
            initialNotes={profile.internalNotes}
            customerId={userId}
            restaurantId={profile.restaurantId}
            slug={slug}
          />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold">
            Histórico dos Últimos Pedidos no Estabelecimento
          </h3>

          {orders.length === 0 ? (
            <p className="text-muted-foreground py-4 text-sm">
              Nenhum pedido registrado.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Pedido #{order.orderNumber}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.totalAmount ?? 0)}
                    </p>
                    <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
