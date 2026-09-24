import AppSidebar from "@/components/AppSidebar"
import BreadcrumbDashboarding from "@/components/BreadcrumbDashboarding"
import ContractWarningBanner from "@/components/ContractWarningBanner"
import ModeToggle from "@/components/ModeToggle"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { db } from "@/lib/prisma"

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
        },
      },
    },
  })

  const CURRENT_CONTRACT_VERSION = "v1.0"

  const isContractPending =
    !restaurant?.subscription?.contractAcceptedAt ||
    restaurant?.subscription?.contractVersion !== CURRENT_CONTRACT_VERSION

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        {isContractPending && <ContractWarningBanner slug={slug} />}
        <SidebarTrigger />
        <header className="flex w-full items-center justify-between px-4">
          <BreadcrumbDashboarding />
          <ModeToggle />
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}
