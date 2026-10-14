import { Card } from "@/components/ui/card"
import { getSubscriptionBySlug } from "@/data/payments/get-subscription-by-slug.queries"
import { notFound } from "next/navigation"
import PaymentDescription from "./PaymentDescription"

interface PaymentsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { slug } = await params

  const establishment = await getSubscriptionBySlug(slug)

  if (!establishment) {
    notFound()
  }

  if (!establishment.subscription) {
    notFound()
  }

  return (
    <Card className="p-4">
      <PaymentDescription establishment={establishment} />
    </Card>
  )
}
