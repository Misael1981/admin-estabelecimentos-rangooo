"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { urlBase64ToUint8Array } from "@/helpers/urlBase64ToUint8Array"

export function PushInitializer() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.id) return

    async function initPush() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push notification não suportada neste navegador.")
        return
      }

      try {
        // 1. Verifica/Solicita a permissão do usuário
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission()
          if (permission !== "granted") {
            console.warn("Permissão de notificação negada pelo usuário.")
            return
          }
        }

        if (Notification.permission === "denied") {
          console.warn("Notificações estão bloqueadas no navegador.")
          return
        }

        // 2. Registra e aguarda o Service Worker ficar pronto
        await navigator.serviceWorker.register("/sw.js")
        const activeRegistration = await navigator.serviceWorker.ready

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!publicKey) {
          console.error(
            "❌ NEXT_PUBLIC_VAPID_PUBLIC_KEY não configurada no .env",
          )
          return
        }

        // 3. Obtém ou cria a inscrição no PushManager
        let subscription =
          await activeRegistration.pushManager.getSubscription()

        if (!subscription) {
          subscription = await activeRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          })
        }

        // 4. Salva a inscrição no backend para poder enviar pushes do servidor
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription,
            userId: session?.user.id,
          }),
        })
      } catch (error) {
        console.error("❌ Erro ao inicializar o Web Push:", error)
      }
    }

    initPush()
  }, [session?.user?.id])

  return null
}
