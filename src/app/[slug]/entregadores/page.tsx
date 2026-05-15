interface DeliveryDriversPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function DeliveryDriversPage({
  params,
}: DeliveryDriversPageProps) {
  const { slug } = await params

  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Futura página para entregadores Rangooo- {slug}
      </h1>
    </div>
  )
}
