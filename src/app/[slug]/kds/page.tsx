import GenericHeader from "@/components/GenericHeader"
import { Monitor } from "lucide-react"
import { getDataKds } from "@/data/kds/get-data-kds.querie"
import CardStations from "./components/CardStations"
import ListKdsUsers from "./components/ListKdsUsers"

interface KdsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function KdsPage({ params }: KdsPageProps) {
  const { slug } = await params

  const kdsData = await getDataKds(slug)

  if (!kdsData?.stations) {
    return null
  }

  return (
    <div className="space-y-8">
      <GenericHeader
        title="Sistema KDS"
        description="Gerencie as configurações e senhas de acesso ao seu Sistema KDS"
        icon={Monitor}
      />

      <CardStations stations={kdsData?.stations} slug={slug} />

      <ListKdsUsers slug={slug} users={kdsData.users} />
    </div>
  )
}
