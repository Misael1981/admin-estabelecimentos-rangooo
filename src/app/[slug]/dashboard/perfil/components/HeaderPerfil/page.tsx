import { Store } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const HeaderPerfil = () => {
  return (
    <header className="space-y-4 pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <Store className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Perfil do Estabelecimento
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Gerencie as informações públicas e configurações da sua vitrine.
          </p>
        </div>
      </div>

      <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4">
        <p className="text-xs leading-relaxed text-amber-800">
          <span className="font-bold">Atenção:</span> Os dados preenchidos nesta
          página são exibidos diretamente para seus clientes. Mantenha tudo
          atualizado para garantir a melhor experiência.
        </p>
      </div>

      <Separator />
    </header>
  )
}

export default HeaderPerfil
