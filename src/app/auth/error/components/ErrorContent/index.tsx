"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const ErrorContent = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    Configuration: "Ocorreu um problema na configuração do servidor.",
    AccessDenied:
      "Você não tem permissão para acessar este painel. Verifique se o e-mail é o mesmo cadastrado.",
    Verification: "O link de verificação expirou ou já foi usado.",
    Default: "Ocorreu um erro inesperado no login.",
  }

  const message = errorMessages[error as string] || errorMessages.Default
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATS_ADMIN
  const messageWhats = encodeURIComponent(
    "Olá! Estou tentando acessar o painel do Rangooo e recebi um erro de permissão. Pode me ajudar?",
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${messageWhats}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">Ops! Algo deu errado</h1>
      <p className="text-muted-foreground mt-2">{message}</p>

      <div className="mt-4 flex flex-col gap-2">
        <Button
          asChild
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Falar com suporte no WhatsApp
          </a>
        </Button>

        <Button asChild variant="ghost">
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  )
}

export default ErrorContent
