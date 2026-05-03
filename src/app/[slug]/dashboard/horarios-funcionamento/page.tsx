import HeaderEstablishmentsPage from "@/components/HeaderEstablishmentsPage"
import { Clock } from "lucide-react"
import OpeningHours, { TimeSlotDTO } from "./components/OpeningHours"
import { notFound } from "next/navigation"
import { getOpeningHoursBySlug } from "@/data/get-opening-hours-by-slug"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function HorariosFuncionamentoPage({ params }: PageProps) {
  const { slug } = await params

  const establishment = await getOpeningHoursBySlug(slug)

  if (!establishment) {
    return notFound()
  }

  const { businessHours, id } = establishment

  const formattedHours = businessHours.map((hour) => ({
    ...hour,
    timeSlots: hour.timeSlots as unknown as TimeSlotDTO[],
  }))

  return (
    <div className="space-y-8">
      <HeaderEstablishmentsPage
        title="Horários de Funcionamento"
        icon={<Clock />}
        description="Gerencie os horários de funcionamento do seu estabelecimento para garantir que seus clientes saibam quando podem visitá-lo ou fazer pedidos. Mantenha seus horários atualizados para evitar confusões e garantir uma experiência positiva para seus clientes."
        notice="Lembre-se de revisar e atualizar os horários de funcionamento regularmente, especialmente durante feriados ou eventos especiais, para garantir que seus clientes tenham informações precisas sobre quando seu estabelecimento está aberto."
      />

      <div className="flex items-center justify-center">
        <OpeningHours
          slug={slug}
          restaurantId={id}
          openingHours={formattedHours}
        />
      </div>
    </div>
  )
}
