"use client"

import { deleteKdsUser } from "@/app/actions/kds/delete-kds-user"
import DialogAlertDelete from "@/components/DialogAlertDelete"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KdsRole } from "@/constants/enums"
import {
  Edit,
  GripVertical,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react"
import { useState } from "react"
import DialogKdsUserForm from "../DialogKdsUserForm"
import { KDS_ROLE_LABELS } from "@/constants/labels"

type CardUserProps = {
  user: {
    name: string
    id: string
    role: KdsRole
    username: string
    active: boolean
    pinHash: string
  }
  slug: string
}

const CardUser = ({ user, slug }: CardUserProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)

  const handleOpenDialogDelete = () => {
    setIsDialogDeleteOpen(true)
  }

  const handleSubmitDelete = async () => {
    await deleteKdsUser(user.id, slug)
  }

  return (
    <>
      <div className="hover:bg-muted/40 rounded-xl border p-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
            <UserRound className="text-muted-foreground size-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate font-medium">{user.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              @{user.username}
            </p>
          </div>

          <Badge
            variant={user.active ? "secondary" : "outline"}
            className="shrink-0"
          >
            {user.active ? "Ativo" : "Inativo"}
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

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-sm">
              {KDS_ROLE_LABELS[user.role]}
            </span>
          </div>

          <span className="text-muted-foreground text-xs">Acesso ao KDS</span>
        </div>
      </div>

      <DialogKdsUserForm
        slug={slug}
        user={user}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DialogAlertDelete
        isOpen={isDialogDeleteOpen}
        onOpenChange={setIsDialogDeleteOpen}
        title="Colaborador"
        onDelete={handleSubmitDelete}
        description="Ao deletar este colaborador, ele não terá acesso do Sistema KDS."
      />
    </>
  )
}

export default CardUser
