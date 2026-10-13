import InfoField from "@/components/InfoField"
import LinkButtonDefault from "@/components/LinkButtonDefault"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PAYMENT_RECEIPT_CONFIG,
  SUBSCRIPTION_STATUS_CONFIG,
} from "@/constants/config"
import { PaymentReceiptStatus, SubscriptionStatus } from "@/constants/enums"
import { formatCurrency } from "@/helpers/format-currency"
import { formatDateDay, formatDateDayMonthYear } from "@/helpers/format-data"
import { CreditCard, FileText } from "lucide-react"

type SubscriptionPaymentsSectionProps = {
  slug: string
  subscription: {
    id: string
    plan: {
      name: string
      price: number
    }
    status: SubscriptionStatus
    currentPeriodEnd: Date
    contractAcceptedAt: Date | null
    contractVersion: string | null
    receipts: {
      status: PaymentReceiptStatus
      dueDate: Date
    }[]
  } | null
  createdAt: Date
}

const SubscriptionPaymentsSection = ({
  slug,
  subscription,
  createdAt,
}: SubscriptionPaymentsSectionProps) => {
  const currentStatus =
    (subscription?.status as SubscriptionStatus) || "EXPIRED"
  const statusConfig = SUBSCRIPTION_STATUS_CONFIG[currentStatus]

  const currentReceipt = subscription?.receipts?.[0]

  const dueDate = subscription?.currentPeriodEnd

  const currentPaymentStatus = currentReceipt?.status || "PENDING"
  const statusPaymentConfig = PAYMENT_RECEIPT_CONFIG[currentPaymentStatus]

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div>
          <CardTitle>Assinatura e Pagamento</CardTitle>
          <CardDescription>
            Cliente desde: <strong>{formatDateDayMonthYear(createdAt)}</strong>
          </CardDescription>
        </div>

        <InfoField
          label="Status do contrato"
          value={
            <Badge className={`border font-medium ${statusConfig.badgeStyle}`}>
              {statusConfig.label}
            </Badge>
          }
          classNameValue="flex justify-center "
        />
      </CardHeader>

      <CardContent>
        <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <div className="flex w-full flex-wrap justify-between gap-4 lg:justify-around">
            <InfoField label="Plano Atual" value={subscription?.plan.name} />
            <InfoField
              label="Valor do plano"
              value={
                subscription?.plan.price
                  ? formatCurrency(subscription?.plan.price)
                  : "Plano não informado"
              }
              classNameValue="text-green-600"
            />
          </div>

          <div className="flex w-full flex-wrap justify-between gap-4 lg:justify-around">
            <InfoField
              label="Vencimento"
              value={
                dueDate
                  ? `Todo dia ${formatDateDay(subscription?.currentPeriodEnd)}`
                  : "Vencimento não definido"
              }
            />
            <InfoField
              label="Status do Pagamento"
              value={
                <Badge
                  className={`border font-medium ${statusPaymentConfig.badgeStyle}`}
                >
                  {statusPaymentConfig.label}
                </Badge>
              }
              classNameValue="flex justify-center"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-4 border-t pt-6">
        <LinkButtonDefault
          url={`/${slug}/configuracoes/contrato`}
          label="Ver Contrato Vigente"
          icon={<FileText />}
        />

        <LinkButtonDefault
          url={`/${slug}/configuracoes/pagamentos`}
          label="Acessar Pagamentos"
          icon={<CreditCard />}
        />
      </CardFooter>
    </Card>
  )
}

export default SubscriptionPaymentsSection
