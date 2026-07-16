import GenericHeader from "@/components/GenericHeader"
import { hasFeature } from "@/constants/options"
import { getEstablishmentForPlan } from "@/data/establishments.queries"
import { Motorbike } from "lucide-react"
import PlansSection from "../configuracoes/components/PlansSection"
import { getDeliveryPersonnelOnline } from "@/data/delivery-workers.queries"
import DeliveryPersonCard from "./components/DeliveryPersonCard"

interface DeliveryDriversPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function DeliveryDriversPage({
  params,
}: DeliveryDriversPageProps) {
  const { slug } = await params

  const [establishment, deliveryPersonnel] = await Promise.all([
    getEstablishmentForPlan(slug),
    getDeliveryPersonnelOnline(),
  ])

  if (!establishment) {
    return (
      <div className="p-6 font-medium text-red-500">
        Estabelecimento não encontrado.
      </div>
    )
  }

  const canUseDelivery = hasFeature(establishment.plan, "canUseDeliverySystem")

  return (
    <div className="space-y-6">
      <GenericHeader
        title="Painel de Entregadores do Rangooo Delivery"
        icon={Motorbike}
        description={
          canUseDelivery
            ? "Veja quais entregadores estão online no momento."
            : "Este estabelecimento ainda não possui acesso ao sistema de entregas. Faça upgrade para o plano Pró."
        }
      />

      {!canUseDelivery ? (
        <section className="flex w-full justify-center">
          <PlansSection
            plan={establishment.plan}
            useRangoooDelivery={establishment.useRangoooDelivery}
            deliveryAreas={establishment.deliveryAreas}
            systemSettings={establishment.systemSettings}
            restaurantId={establishment.id}
            slug={slug}
          />
        </section>
      ) : (
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold text-green-500">
            Entregadores online
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {deliveryPersonnel?.map((person) => (
              <DeliveryPersonCard
                key={person.id}
                deliveryPerson={person}
                restaurantId={establishment.id}
                slug={slug}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
