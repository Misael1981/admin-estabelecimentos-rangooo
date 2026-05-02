import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"
import WelcomeMessage from "./components/WelcomeMessage"
import { getRestaurantDashboardData } from "@/data/get-restaurant-dashboard-data"
import StatusOpenSwitch from "./components/StatusOpenSwitch"
import { Card } from "@/components/ui/card"
import DailySalesSummary from "./components/DailySalesSummary"

interface DashboardPageProps {
  params: Promise<{ slug: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${slug}/login`)
  }

  const restaurantData = await getRestaurantDashboardData(slug)

  if (!restaurantData) {
    return notFound()
  }

  return (
    <div className="space-y-8">
      <section className="mb-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <WelcomeMessage userName={session.user.name} />

        <StatusOpenSwitch
          key={restaurantData.isOpen ? "open" : "closed"}
          initialIsOpen={restaurantData.isOpen}
          restaurantId={restaurantData.id}
          restaurantSlug={slug}
        />
      </section>

      <section className="h-full">
        {!restaurantData.isOpen ? (
          <Card className="flex w-full flex-col items-center justify-center gap-4 border-yellow-300 bg-yellow-50 p-8 text-center shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">⚠️</span>

              <h2 className="text-xl font-semibold text-yellow-800">
                Estabelecimento fechado
              </h2>

              <p className="max-w-md text-sm text-yellow-700">
                Seu estabelecimento está fechado no momento. Abra para começar a
                receber pedidos.
              </p>
            </div>

            <div className="mt-4">
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                Nenhum pedido será recebido enquanto estiver fechado
              </span>
            </div>
          </Card>
        ) : (
          <>
            <DailySalesSummary todayOrders={restaurantData.orders} />
          </>
        )}
      </section>
    </div>
  )
}
