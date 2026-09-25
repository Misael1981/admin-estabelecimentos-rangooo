"use client"

import { useEffect, useRef, useState } from "react"
import { usePusherChannel } from "./usePusherChannel"

export function useOrderNotification(restaurantId: string) {
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bell-notification.wav")
  }, [])

  const enableAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current?.pause()
          if (audioRef.current) audioRef.current.currentTime = 0
          setAudioEnabled(true)
        })
        .catch((err) => console.log("Erro ao destravar áudio:", err))
    }
  }

  usePusherChannel(`restaurant-${restaurantId}`, "order:created", (data) => {
    console.log("🔔 Novo pedido recebido via Pusher:", data)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => {
        console.error("Autoplay bloqueado pelo navegador:", err)
      })
    }
  })

  return { audioEnabled, enableAudio }
}
