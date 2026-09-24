import HeaderEstablishmentsPage from "@/components/HeaderEstablishmentsPage"
import { getEstablishmentDataAndContractBySlug } from "@/data/get-contratct.queries"
import { ReceiptText } from "lucide-react"
import CardCurrentContract from "./components/CardCurrentContract"
import ContractAcceptanceSection from "./components/ContractAcceptanceSection"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ContractPage({ params }: PageProps) {
  const { slug } = await params

  const data = await getEstablishmentDataAndContractBySlug(slug)

  if (!data.establishment || !data.activeContract) {
    return null
  }

  // 1. Pega os valores vindos da query do banco
  const currentContractVersion = data.activeContract?.version // Ex: "v1.0"
  const signedVersion = data.establishment.subscription?.contractVersion // Ex: "v1.0" ou "v0.9"
  const acceptedAtDate = data.establishment.subscription?.contractAcceptedAt // Date ou null

  // 2. Calcula o booleano diretamente na Server Component / Página
  const isAlreadyAccepted =
    Boolean(acceptedAtDate) && signedVersion === currentContractVersion

  return (
    <div className="space-y-8">
      <HeaderEstablishmentsPage
        title="Contrato Vigente"
        icon={<ReceiptText />}
        description="Consulte o contrato de uso da plataforma e as condições do seu plano atual."
        notice="este contrato representa os termos vigentes da sua utilização da plataforma Rangooo. Em caso de alteração dos termos, um novo aceite poderá ser solicitado."
      />

      <CardCurrentContract data={data} />

      <ContractAcceptanceSection
        restaurantId={data.establishment?.id}
        contractVersion={data.activeContract?.version}
        isAlreadyAccepted={isAlreadyAccepted}
        slug={slug}
      />
    </div>
  )
}
