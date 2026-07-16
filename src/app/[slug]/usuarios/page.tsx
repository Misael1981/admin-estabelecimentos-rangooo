import GenericHeader from "@/components/GenericHeader"
import { TrafficCone } from "lucide-react"
import Image from "next/image"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function UsuariosPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className="space-y-6">
      <GenericHeader title="Página em Construção" icon={TrafficCone} />

      <div className="flex justify-center">
        <Image
          src="/page-under-construction.png"
          alt="Página em Cobtrução"
          width={500}
          height={300}
        />
      </div>
    </div>
  )
}
