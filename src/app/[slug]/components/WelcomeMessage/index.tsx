import { UserCircle } from "lucide-react"

type WelcomeMessageProps = {
  userName: string | null | undefined
}

const WelcomeMessage = ({ userName }: WelcomeMessageProps) => {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        Visão Geral
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <UserCircle size={20} />
        </div>
        <div>
          <p className="text-sm font-medium">
            Bem-vindo, {userName?.split(" ")[0]}!
          </p>
          <p className="text-xs text-gray-500">
            Gerencie seus pedidos e a operação da sua loja em tempo real.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeMessage
