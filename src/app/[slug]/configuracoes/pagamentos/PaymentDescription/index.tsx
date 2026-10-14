"use client"

import { PaymentReceiptStatus, SubscriptionStatus } from "@/constants/enums"
import CopyPixButton from "./components/CopyPixButton"
import PixQRCode from "./components/PixQRCode"
import SubCard from "@/components/ui/sub-card"

type PaymentDescriptionProps = {
  establishment: {
    subscription: {
      plan: {
        price: number
        name: string
      }
      id: string
      status: SubscriptionStatus
      currentPeriodEnd: Date
      contractAcceptedAt: Date | null
      contractVersion: string | null
      receipts: {
        status: PaymentReceiptStatus
        paymentMethod: string | null
        amount: number
        dueDate: Date
        notes: string | null
      }[]
    } | null
    name: string
    id: string
  }
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const PaymentDescription = ({ establishment }: PaymentDescriptionProps) => {
  const subscription = establishment.subscription

  if (!subscription) {
    return (
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-lg font-bold">Pagamento atual</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Este estabelecimento não possui uma assinatura vinculada.
        </p>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-5 rounded-xl border p-5 shadow-sm sm:p-6 lg:flex-row">
      <div className="flex flex-1 flex-col justify-around gap-5">
        <div>
          <h2 className="text-lg font-bold">Pagamento atual</h2>
          <p className="text-muted-foreground text-sm">
            Confira os dados da assinatura e realize o pagamento.
          </p>
        </div>

        <SubCard>
          <p className="text-muted-foreground text-sm">Plano contratado</p>
          <h3 className="mt-1 font-semibold">{subscription.plan.name}</h3>
          <p className="mt-2 text-2xl font-bold">
            {currencyFormatter.format(subscription.plan.price)}
            <span className="text-muted-foreground ml-1 text-sm font-normal">
              / mês
            </span>
          </p>
        </SubCard>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Vencimento</p>
            <p className="mt-1 font-medium">
              {dateFormatter.format(subscription.currentPeriodEnd)}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Estabelecimento</p>
            <p className="mt-1 truncate font-medium">{establishment.name}</p>
          </div>
        </div>

        <CopyPixButton plan={subscription?.plan} />
      </div>

      <div className="flex flex-1 flex-col items-center gap-3 rounded-lg border p-5 text-center">
        <h3 className="font-semibold">Pague com PIX</h3>

        <p className="text-muted-foreground max-w-sm text-sm">
          Escaneie o QR Code com o aplicativo do seu banco.
        </p>

        <PixQRCode plan={subscription.plan} />
      </div>
    </section>
  )
}

export default PaymentDescription
