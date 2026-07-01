"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateCustomerNotes } from "@/app/actions/update-customer-notes"
import { toast } from "sonner"

type NotesFormProps = {
  initialNotes: string | null
  customerId: string
  restaurantId: string
  slug: string
}

export default function NotesForm({
  initialNotes,
  customerId,
  restaurantId,
  slug,
}: NotesFormProps) {
  const [notes, setNotes] = useState(initialNotes || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)

    try {
      const result = await updateCustomerNotes({
        customerId,
        restaurantId,
        notes,
        slug,
      })

      if (result.success) {
        toast.success("✅ Anotação salva com sucesso!")
      } else {
        toast.error(`❌ ${result.error}`)
      }
    } catch (error) {
      toast.error("Erro crítico ao tentar salvar a anotação.")
      console.error("[NOTES_FORM_SAVE_ERROR]:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasChanged = notes.trim() !== (initialNotes || "").trim()

  return (
    <div className="bg-card space-y-3 rounded-lg border p-4">
      <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
        Notas Internas (Privado do estabelecimento)
      </h3>
      <Textarea
        placeholder="Adicione observações sobre esse cliente (ex: Prefere pizza bem passada, cliente VIP...)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading || !hasChanged}>
          {loading ? "Salvando..." : "Salvar Anotação"}
        </Button>
      </div>
    </div>
  )
}
