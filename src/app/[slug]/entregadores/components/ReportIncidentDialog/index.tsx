"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TriangleAlert, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { reportIncidentAction } from "@/app/actions/incidents"

interface ReportIncidentDialogProps {
  deliveryPersonId: string
  deliveryPersonName: string
  onSuccess?: () => void
  restaurantId: string
  slug: string
}

const ReportIncidentDialog = ({
  deliveryPersonId,
  deliveryPersonName,
  restaurantId,
  slug,
  onSuccess,
}: ReportIncidentDialogProps) => {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsSubmitting(true)

    try {
      const result = await reportIncidentAction({
        deliveryPersonId,
        description: description.trim(),
        restaurantId,
        slug,
      })

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success("Incidente registrado com sucesso!")
      setDescription("")
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.")
      console.error("Erro inesperado. Tente novamente.", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <TriangleAlert className="mr-2 h-4 w-4" />
          Relatar Incidente
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-110">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <TriangleAlert className="h-5 w-5" />
              Relatar Incidente
            </DialogTitle>
            <DialogDescription>
              Relate o que aconteceu com <strong>{deliveryPersonName}</strong>.
              Este relatório será enviado diretamente para a administração do
              Rangooo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Textarea
              placeholder="Descreva o ocorrido detalhadamente (ex: atraso grave, falta de educação, problemas com a maquininha...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Confirmar Relato"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ReportIncidentDialog
