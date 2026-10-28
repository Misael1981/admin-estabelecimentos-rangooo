import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Check,
  CircleDashed,
  CirclePlus,
  GripVertical,
  ListOrdered,
} from "lucide-react"

type CardStationProps = {
  stations: {
    name: string
    id: string
    order: number
    active: boolean
  }[]
}

const CardStation = ({ stations }: CardStationProps) => {
  const orderedStations = [...stations].sort((a, b) => a.order - b.order)

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start gap-3">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
            <ListOrdered className="text-muted-foreground size-5" />
          </div>

          <div className="space-y-1">
            <CardTitle>Etapas de produção</CardTitle>
            <CardDescription>
              Configure o fluxo de preparo dos seus pedidos. Defina as etapas e
              a ordem em que os produtos devem avançar durante a produção.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {orderedStations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
              <CircleDashed className="text-muted-foreground size-6" />
            </div>

            <div className="space-y-1">
              <p className="font-medium">Nenhuma etapa cadastrada</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Organize o fluxo de trabalho da sua cozinha adicionando a
                primeira etapa de produção.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {orderedStations.map((station) => (
              <div
                key={station.id}
                className="hover:bg-muted/40 flex items-center gap-3 rounded-xl border p-3 transition-colors"
              >
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold tabular-nums">
                  {String(station.order).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-medium">{station.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Etapa {station.order} da sequência
                  </p>
                </div>

                <Badge
                  variant={station.active ? "secondary" : "outline"}
                  className="shrink-0 gap-1"
                >
                  {station.active ? <Check className="size-3" /> : null}
                  {station.active ? "Ativa" : "Inativa"}
                </Badge>

                <GripVertical className="text-muted-foreground/50 size-5 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end border-t pt-4">
        {/* Abrir Dialog de cadastro de etapa */}
        <Button>
          <CirclePlus className="size-4" />
          Adicionar etapa
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CardStation
