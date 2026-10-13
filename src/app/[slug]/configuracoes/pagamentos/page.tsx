import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { slug } = await params

  return (
    <Card>
      <CardHeader>
        <CardTitle>{slug}</CardTitle>
      </CardHeader>
    </Card>
  )
}
