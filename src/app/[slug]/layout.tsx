import AppSidebar from "@/components/AppSidebar"
import BreadcrumbDashboarding from "@/components/BreadcrumbDashboarding"
import ModeToggle from "@/components/ModeToggle"
import { DashboardNotifications } from "@/components/DashboardNotifications"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { db } from "@/lib/prisma"
import WarningBanner from "@/components/WarningBanner"
import { notFound } from "next/navigation"

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      subscription: {
        select: {
          contractAcceptedAt: true,
          contractVersion: true,
          currentPeriodEnd: true,
          status: true,
        },
      },
    },
  })

  if (!restaurant) {
    notFound()
  }

  const CURRENT_CONTRACT_VERSION = "v1.0"

  const isContractPending =
    !restaurant?.subscription?.contractAcceptedAt ||
    restaurant?.subscription?.contractVersion !== CURRENT_CONTRACT_VERSION

  const currentDate = new Date()
  const currentPeriodEnd = restaurant?.subscription?.currentPeriodEnd
    ? new Date(restaurant.subscription.currentPeriodEnd)
    : null

  const isPaymentOverdue = currentPeriodEnd
    ? currentDate > currentPeriodEnd
    : false

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="min-w-0 flex-1">
        {isPaymentOverdue && (
          <WarningBanner
            label="Prezado cliente, identificamos que ainda não consta em nosso sistema a confirmação do pagamento da assinatura. Pedimos, por gentileza, que regularize o pagamento o quanto antes para evitar possíveis restrições no acesso à plataforma Rangooo. Caso o pagamento já tenha sido realizado, desconsidere este aviso."
            url={`/${slug}/configuracoes/pagamentos`}
            labelLink="Acessar Fatura"
          />
        )}
        {isContractPending && (
          <WarningBanner
            label=" O contrato de prestação de serviços (v1.0) ainda não foi assinado pelo
          responsável."
            url={`/${slug}/configuracoes/contrato`}
            labelLink="Revisar e Assinar"
          />
        )}
        <SidebarTrigger />
        <header className="flex w-full items-center justify-between px-4">
          <BreadcrumbDashboarding />
          <ModeToggle />
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
      <DashboardNotifications restaurantId={restaurant.id} />
    </SidebarProvider>
  )
}
