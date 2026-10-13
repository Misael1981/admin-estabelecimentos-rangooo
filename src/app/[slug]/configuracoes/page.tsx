import DeliveryEstimateSettings from "@/components/DeliveryEstimateSettings"
import GenericHeader from "@/components/GenericHeader"
import HeaderEstablishmentsPage from "@/components/HeaderEstablishmentsPage"
import { getDeliveryEstimateSettings } from "@/data/get-delivery-estimate-settings"
import { getEstablishmentForPlansAndMethodsBySlug } from "@/data/get-establishment-for-plans-and-methods-by-slug"
import { Settings, SlidersHorizontal } from "lucide-react"
import { notFound } from "next/navigation"
import PlansSection from "./components/PlansSection"
import { getSystemReleases } from "@/data/impression/get-systemRelease.queries"
import AgentVersionGrid from "./components/AgentVersionGrid"
import SubscriptionPaymentsSection from "./components/SubscriptionPaymentsSection"

interface SettingsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { slug } = await params

  const [establishment, releases] = await Promise.all([
    getEstablishmentForPlansAndMethodsBySlug(slug),
    getSystemReleases(),
  ])

  if (!establishment) {
    return notFound()
  }

  const deliveryEstimate = await getDeliveryEstimateSettings(establishment.id)

  const {
    plan,
    useRangoooDelivery,
    deliveryAreas,
    systemSettings,
    subscription,
  } = establishment

  return (
    <div className="space-y-8">
      <GenericHeader
        title="Configurações"
        description="Gerencie as configurações gerais do sistema"
        icon={Settings}
      />

      <SubscriptionPaymentsSection
        slug={slug}
        subscription={subscription}
        createdAt={establishment.createdAt}
      />

      <div className="space-y-8">
        <HeaderEstablishmentsPage
          title="Configure o Plano e Tempo de Entrega"
          icon={<SlidersHorizontal />}
          description="Gerencie o plano de assinatura e métodos de pagamento e consumo
            disponíveis para seus clientes . Mantenha suas opções atualizadas
            para garantir uma experiência de compra fluida e satisfatória."
          notice="Mudança de planos pode
          afetar a disponibilidade de recursos e métodos para seus clientes.
          Revise as opções cuidadosamente antes de confirmar alterações."
        />

        <div className="flex w-full flex-col items-center justify-center gap-6">
          <PlansSection
            plan={plan}
            useRangoooDelivery={useRangoooDelivery}
            deliveryAreas={deliveryAreas}
            systemSettings={systemSettings}
            restaurantId={establishment.id}
            slug={slug}
          />
        </div>

        <DeliveryEstimateSettings
          deliveryEstimate={deliveryEstimate}
          restaurantId={establishment.id}
          slug={slug}
        />
      </div>

      <AgentVersionGrid releases={releases} />
    </div>
  )
}
