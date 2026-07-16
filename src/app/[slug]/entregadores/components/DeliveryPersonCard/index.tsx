"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { Phone, User } from "lucide-react"
import ReportIncidentDialog from "../ReportIncidentDialog"

type DeliveryPersonCardProps = {
  deliveryPerson: {
    id: string
    user: {
      name: string
      phone: string | null
    }
    isOnline: boolean
    deliveryIncidents: {
      id: string
      createdAt: Date
      restaurantId: string
      restaurant: {
        name: string
      }
      description: string
    }[]
  }
  restaurantId: string
  slug: string
}

const DeliveryPersonCard = ({
  deliveryPerson,
  slug,
  restaurantId,
}: DeliveryPersonCardProps) => {
  return (
    <Card className="w-full max-w-lg border-0 py-0 shadow-md">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <User className="h-5 w-5 text-orange-600" />
            </div>

            <div>
              <p className="text-muted-foreground text-sm">Entregador</p>
              <h3 className="text-lg font-semibold">
                {deliveryPerson.user.name}
              </h3>
            </div>
          </div>

          {deliveryPerson.user.phone && (
            <div className="bg-muted/40 flex items-center gap-3 rounded-lg p-3">
              <Phone className="text-muted-foreground h-4 w-4" />

              <div>
                <p className="text-muted-foreground text-xs">Telefone</p>
                <p className="font-medium">
                  {formatPhoneNumber(deliveryPerson.user.phone)}
                </p>
              </div>
            </div>
          )}
        </div>

        <ReportIncidentDialog
          deliveryPersonId={deliveryPerson.id}
          deliveryPersonName={deliveryPerson.user.name}
          restaurantId={restaurantId}
          slug={slug}
        />
      </CardContent>
    </Card>
  )
}

export default DeliveryPersonCard
