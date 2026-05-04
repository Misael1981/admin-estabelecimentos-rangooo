import { ShoppingBasket } from "lucide-react"

const HeaderCardapio = () => {
  return (
    <header className="">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <ShoppingBasket className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Gerencie seu Cardápio
        </h1>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground">
          Crie e exclua produtos e tabelas para exibir no seu cardápio.
        </p>
      </div>
    </header>
  )
}

export default HeaderCardapio
