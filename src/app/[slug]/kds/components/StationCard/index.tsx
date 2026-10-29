"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Edit, GripVertical, Trash2 } from "lucide-react"
import DialogStationForm from "../DialogStationForm" // O nosso dialog unificado
import DialogAlertDelete from "@/components/DialogAlertDelete"
import { deleteStationKds } from "@/app/actions/kds/delete-station-kds"

type StationCardProps = {
  station: {
    name: string
    id: string
    order: number
    active: boolean
  }
  slug: string
}

const StationCard = ({ station, slug }: StationCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)

  const handleOpenDialogDelete = () => {
    setIsDialogDeleteOpen(true)
  }

  const handleSubmitDelete = async () => {
    await deleteStationKds(station.id, slug)
  }

  return (
    <>
      <div className="hover:bg-muted/40 flex items-center gap-3 rounded-xl border p-3 transition-colors">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <GripVertical className="text-muted-foreground/50 size-5 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Ao clicar, apenas abrimos o estado do modal, evitando o conflito do Radix */}
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleOpenDialogDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DialogStationForm
        slug={slug}
        station={station}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DialogAlertDelete
        isOpen={isDialogDeleteOpen}
        onOpenChange={setIsDialogDeleteOpen}
        title="Etapa"
        onDelete={handleSubmitDelete}
        description="Ao deletar esta etapa, todo o processo produtivo será afetado."
      />
    </>
  )
}

export default StationCard
