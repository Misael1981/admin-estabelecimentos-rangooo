import { getManualOrderData } from "@/data/orders/manual-order.queries"
import HeaderOrdersPage from "../components/HeaderOrdersPage"
import { notFound } from "next/navigation"
import ManualOrderForm from "./componets/ManualOrderForm"

interface ManualOrderProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ManualOrderPage({ params }: ManualOrderProps) {
  const { slug } = await params

  const establishment = await getManualOrderData(slug)

  if (!establishment) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <HeaderOrdersPage slug={slug} />

      <ManualOrderForm establishment={establishment} />
    </div>
  )
}
