import HeaderEstablishmentsPage from "@/components/HeaderEstablishmentsPage"
import { getEstablishmentForPlansAndMethodsBySlug } from "@/data/get-establishment-for-plans-and-methods-by-slug"
import { SlidersHorizontal } from "lucide-react"
import { notFound } from "next/navigation"
import PlansSection from "./components/PlansSection"
import ConsumptionAndPaymentMethodsForm from "./components/ConsumptionAndPaymentMethodsForm"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PlanoMetodosPage({ params }: PageProps) {
  const { slug } = await params

  const establishment = await getEstablishmentForPlansAndMethodsBySlug(slug)

  if (!establishment) {
    return notFound()
  }

  const {
    plan,
    useRangoooDelivery,
    deliveryAreas,
    systemSettings,
    consumptionMethods,
    paymentMethods,
  } = establishment

  return (
    <div className="space-y-8">
      <HeaderEstablishmentsPage
        title="Plano e Metodos"
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

        <ConsumptionAndPaymentMethodsForm
          initialConsumptionMethods={consumptionMethods.map((m) => m.method)}
          initialPaymentMethods={paymentMethods.map((m) => m.method)}
          restaurantId={establishment.id}
          slug={slug}
        />
      </div>
    </div>
  )
}
