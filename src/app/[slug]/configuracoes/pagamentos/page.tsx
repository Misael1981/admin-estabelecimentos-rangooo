import PixQRCode from "@/components/PixQRCode"
import { Card } from "@/components/ui/card"
import { getSubscriptionBySlug } from "@/data/payments/get-subscription-by-slug.queries"

interface PaymentsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { slug } = await params

  const establishment = await getSubscriptionBySlug(slug)

  if (!establishment) {
    return null
  }

  return (
    <Card>
      <PixQRCode plan={establishment?.subscription?.plan} />
    </Card>
  )
}
