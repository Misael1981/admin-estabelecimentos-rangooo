import Pusher from "pusher-js"

let client: Pusher | null = null

export const getPusherClient = () => {
  if (!client) {
    if (process.env.NODE_ENV === "development") {
      Pusher.logToConsole = true
    }

    client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    })
  }

  return client
}
