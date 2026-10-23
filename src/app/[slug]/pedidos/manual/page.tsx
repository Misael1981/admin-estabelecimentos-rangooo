import { getManualOrderData } from "@/data/orders/manual-order.queries"
import HeaderOrdersPage from "../components/HeaderOrdersPage"
import { notFound } from "next/navigation"
import ManualOrderForm from "./componets/ManualOrderForm"
import { getDeliveryFees } from "@/data/orders/delivery-fees"

interface ManualOrderProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ManualOrderPage({ params }: ManualOrderProps) {
  const { slug } = await params

  const [establishment, deliveryFees] = await Promise.all([
    getManualOrderData(slug),
    getDeliveryFees(slug),
  ])

  if (!establishment) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <HeaderOrdersPage slug={slug} />

      <ManualOrderForm
        establishment={establishment}
        deliveryFees={deliveryFees}
        nextCustomerCode={establishment.nextCustomerCode}
      />
    </div>
  )
}
