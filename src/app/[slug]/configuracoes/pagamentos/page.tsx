import { Card } from "@/components/ui/card"
import { getSubscriptionBySlug } from "@/data/payments/get-subscription-by-slug.queries"
import { notFound } from "next/navigation"
import HeaderEstablishmentsPage from "@/components/HeaderEstablishmentsPage"
import { TicketCheck } from "lucide-react"
import PaymentDescription from "./components/PaymentDescription"
import ReceiptCard from "./components/ReceiptCard"

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
    <div className="space-y-6">
      <Card className="p-4">
        <PaymentDescription establishment={establishment} />
      </Card>

      <HeaderEstablishmentsPage
        title="Recibos"
        description="Confira/imprima os comprovantes dos últimos 6 meses"
        icon={<TicketCheck />}
      />

      <section className="flex flex-wrap justify-center gap-4">
        {establishment.subscription.receipts.map((r) => (
          <ReceiptCard receipt={r} key={r.id} />
        ))}
      </section>
    </div>
  )
}
