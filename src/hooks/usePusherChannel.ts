"use client"

import { useEffect } from "react"
import { getPusherClient } from "@/lib/pusher"

const refCounts = new Map<string, number>()

export function usePusherChannel(
  channelName: string,
  eventName: string,
  callback: (data: unknown) => void,
) {
  useEffect(() => {
    const pusher = getPusherClient()
    if (!pusher) return

    const channel = pusher.subscribe(channelName)
    channel.bind(eventName, callback)

    refCounts.set(channelName, (refCounts.get(channelName) ?? 0) + 1)

    return () => {
      channel.unbind(eventName, callback)

      const current = (refCounts.get(channelName) ?? 1) - 1
      refCounts.set(channelName, current)

      if (current <= 0) {
        refCounts.delete(channelName)
        pusher.unsubscribe(channelName)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, eventName])
}
