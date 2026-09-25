"use client"

import { PushInitializer } from "@/components/PushInitializer"
import { useOrderNotification } from "@/hooks/use-order-notification"

export function DashboardNotifications({
  restaurantId,
}: {
  restaurantId: string
}) {
  const { audioEnabled, enableAudio } = useOrderNotification(restaurantId)

  return (
    <>
      <PushInitializer />
      {!audioEnabled && (
        <button
          onClick={enableAudio}
          className="fixed right-4 bottom-4 z-50 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          🔔 Clique para ativar o som de novos pedidos
        </button>
      )}
    </>
  )
}
