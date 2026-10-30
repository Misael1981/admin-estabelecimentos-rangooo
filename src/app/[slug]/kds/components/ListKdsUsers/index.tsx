"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KdsRole } from "@/constants/enums"
import { CircleDashed, CirclePlus, UsersRound } from "lucide-react"
import { useState } from "react"
import DialogKdsUserForm from "./components/DialogKdsUserForm"
import CardUser from "./components/CardUser"

type ListKdsUsersProps = {
  slug: string
  users: {
    name: string
    id: string
    role: KdsRole
    username: string
    active: boolean
    pinHash: string
  }[]
}

const ListKdsUsers = ({ slug, users }: ListKdsUsersProps) => {
  const [openDialog, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
              <UsersRound className="text-muted-foreground size-5" />
            </div>

            <div className="space-y-1">
              <CardTitle>Equipe de produção</CardTitle>
              <CardDescription>
                Cadastre seus colaboradores, defina suas funções e gerencie os
                acessos ao sistema KDS.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
              <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                <CircleDashed className="text-muted-foreground size-6" />
              </div>

              <div className="space-y-1">
                <p className="font-medium">Nenhum colaborador cadastrado</p>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Sua equipe ainda não possui acessos ao KDS. Cadastre seus
                  colaboradores para organizar e acompanhar a produção.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <CardUser key={user.id} user={user} slug={slug} />
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end border-t pt-4">
          <Button type="button" onClick={handleOpenDialog}>
            <CirclePlus className="size-4" />
            Adicionar colaborador
          </Button>
        </CardFooter>
      </Card>

      <DialogKdsUserForm
        slug={slug}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </>
  )
}

export default ListKdsUsers
