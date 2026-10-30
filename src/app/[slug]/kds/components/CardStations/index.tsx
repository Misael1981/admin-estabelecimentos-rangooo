"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { CircleDashed, CirclePlus, ListOrdered } from "lucide-react"
import DialogStationForm from "../DialogStationForm"
import StationCard from "../StationCard"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type CardStationsProps = {
  stations: {
    name: string
    id: string
    order: number
    active: boolean
    estimatedMinutes: number
  }[]
  slug: string
}

const CardStations = ({ stations, slug }: CardStationsProps) => {
  const [openDialog, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const orderedStations = [...stations].sort((a, b) => a.order - b.order)

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
              <ListOrdered className="text-muted-foreground size-5" />
            </div>

            <div className="space-y-1">
              <CardTitle>Etapas de produção</CardTitle>
              <CardDescription>
                Configure o fluxo de preparo dos seus pedidos. Defina as etapas
                e a ordem em que os produtos devem avançar durante a produção.
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
                <StationCard key={station.id} station={station} slug={slug} />
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end border-t pt-4">
          <Button type="button" onClick={handleOpenDialog}>
            <CirclePlus className="size-4" />
            Adicionar etapa
          </Button>
        </CardFooter>
      </Card>

      <DialogStationForm
        slug={slug}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </>
  )
}

export default CardStations
