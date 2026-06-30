import { formatPhoneNumber } from "@/helpers/format-phone-number"
import Link from "next/link"

type CustomerCardProps = {
  client: {
    id: string
    restaurantId: string
    userId: string
    totalOrders: number
    totalSpent: number
    internalNotes: string | null
    createdAt: Date
    updatedAt: Date
    user: {
      id: string
      name: string
      email: string
      image: string | null
      phone: string | null
    }
  }
  slug: string
}

const CustomerCard = ({ client, slug }: CustomerCardProps) => {
  return (
    <div>
      <Link href={`/${slug}/clientes/${client.id}`}>
        <div className="hover:bg-muted/50 space-y-4 rounded-lg border p-3 transition-all">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="truncate text-sm font-medium lg:text-lg">
                {client.user.name}
              </h4>
              {client.user.phone && (
                <span className="text-muted-foreground text-xs">
                  {formatPhoneNumber(client.user.phone)}
                </span>
              )}
            </div>

            <div className="flex gap-6 text-center">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs lg:text-sm">
                  Pedidos
                </p>
                <p className="text-primary text-base font-bold lg:text-xl">
                  {client.totalOrders}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs lg:text-sm">
                  Total Gasto
                </p>
                <p className="text-base font-bold text-emerald-500 lg:text-xl">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(client.totalSpent)}
                </p>
              </div>
            </div>
          </div>

          {client.internalNotes && (
            <div className="bg-muted/50 rounded-md border p-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Notas Internas
              </p>
              <p className="text-sm font-medium">{client.internalNotes}</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default CustomerCard
