"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { FcGoogle } from "react-icons/fc"

const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginWithGoogleClick = async () => {
    setIsLoading(true)
    try {
      const slug = window.location.pathname.split("/")[1]
      const callbackUrl = `/${slug}/dashboard`

      await signIn("google", { callbackUrl })
    } catch (error) {
      toast.error("Erro ao fazer login")
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="w-full bg-[#1B3D54] text-white hover:bg-[#1B3D54]/90"
      onClick={handleLoginWithGoogleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        "Aguarde..."
      ) : (
        <>
          <FcGoogle className="mr-2" size={20} /> Entrar com Google
        </>
      )}
    </Button>
  )
}

export default LoginButton
