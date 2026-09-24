"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

interface ContractWarningBannerProps {
  slug: string
}

const ContractWarningBanner = ({ slug }: ContractWarningBannerProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-amber-500/30 bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-900 transition-all dark:text-amber-200">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          O contrato de prestação de serviços (v1.0) ainda não foi assinado pelo
          responsável.
        </span>
      </div>

      <Link
        href={`/${slug}/configuracoes/contrato`}
        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
      >
        <span>Revisar e Assinar</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

export default ContractWarningBanner
