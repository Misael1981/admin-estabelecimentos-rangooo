import GenericHeader from "@/components/GenericHeader"
import { UserStar } from "lucide-react"

interface ClientsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ClientsPage({ params }: ClientsPageProps) {
  const { slug } = await params

  return (
    <div className="space-y-8">
      <GenericHeader
        title="Gerencie seus clientes"
        description="Gerencie seus clientes, fique por dentro do que seus clientes andam pedindo..."
        icon={UserStar}
      />
    </div>
  )
}
