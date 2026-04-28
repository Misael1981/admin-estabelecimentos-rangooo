"use client"

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

const CardForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginWithGoogleClick = async () => {
    setIsLoading(true)
    try {
      const slug = window.location.pathname.split("/")[1]
      const callbackUrl = `/${slug}/dashboard`

      await signIn("google", { callbackUrl })

      // NOTA: Se você usar redirect: true (padrão), o código abaixo não será executado
      // porque a página vai mudar. Por isso, não precisa de toast de sucesso aqui.
    } catch (error) {
      toast.error("Erro ao fazer login")
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <section className="flex w-full flex-col justify-between gap-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Faça seu login</h2>
        <p className="text-muted-foreground text-sm">
          Use o seu e-mail que foi cadastrado no sistema.
        </p>
      </div>

      <Button
        className="w-full cursor-pointer"
        variant="outline"
        size="sm"
        onClick={handleLoginWithGoogleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          "Aguarde..."
        ) : (
          <>
            <FcGoogle className="mr-2" /> Entrar com Google
          </>
        )}
      </Button>
    </section>
  )
}

export default CardForm
