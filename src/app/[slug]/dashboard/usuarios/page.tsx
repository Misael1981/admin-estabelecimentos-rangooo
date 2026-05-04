import Image from "next/image"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function UsuariosPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Gerenciar Usuários - {slug}
      </h1>
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
