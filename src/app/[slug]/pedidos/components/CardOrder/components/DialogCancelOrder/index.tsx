"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TriangleAlert } from "lucide-react"

type DialogCancelOrderProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const DialogCancelOrder = ({
  isOpen,
  onClose,
  onConfirm,
}: DialogCancelOrderProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-90 max-w-[95%] rounded-md p-4 shadow-md">
        <TriangleAlert className="mx-auto mb-4 h-16 w-16 text-red-500" />
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-red-500">
            Atenção!
          </DialogTitle>
          <DialogDescription>
            Deseja realmente cancelar o pedido? Essa ação é irreversível.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCancelOrder
