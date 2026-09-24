"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import { acceptContractAction } from "@/app/actions/accept-contract"
import { toast } from "sonner"

type ContractAcceptanceSectionProps = {
  restaurantId: string
  contractVersion: string
  isAlreadyAccepted: boolean
  acceptedAt?: Date | null
  slug: string
}

const ContractAcceptanceSection = ({
  restaurantId,
  contractVersion,
  isAlreadyAccepted,
  acceptedAt,
  slug,
}: ContractAcceptanceSectionProps) => {
  const [accepted, setAccepted] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Se o contrato dessa versão já foi assinado/aceito pelo estabelecimento
  if (isAlreadyAccepted) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">Termos de uso e contrato aceitos</p>
          {acceptedAt && (
            <p className="text-muted-foreground text-xs">
              Assinado digitalmente em:{" "}
              {new Date(acceptedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
    )
  }

  const handleAccept = () => {
    startTransition(async () => {
      const response = await acceptContractAction({
        restaurantId,
        contractVersion,
        slug,
      })

      if (!response.success) {
        toast.error(response.message)
      }

      toast.success(response.message)
    })
  }

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(Boolean(checked))}
        />
        <label
          htmlFor="terms"
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Li, compreendo e concordo com todos os termos descritos na versão{" "}
          <span className="font-bold">{contractVersion}</span> do contrato de
          prestação de serviços do Rangooo.
        </label>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleAccept}
          disabled={!accepted || isPending}
          className="w-full sm:w-auto"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          {isPending
            ? "Registrando Aceite..."
            : "Aceitar e Assinar Digitalmente"}
        </Button>
      </div>
    </div>
  )
}

export default ContractAcceptanceSection
