import Image from "next/image"

const CardLogo = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <div className="relative h-60 w-60">
        <Image
          src="/logo-rangooo.png"
          alt="Rangooo"
          fill
          priority
          className="object-contain"
        />
      </div>

      <h1 className="text-muted-foreground max-w-xs text-center text-sm font-medium">
        Conectando sua fome aos melhores sabores da cidade
      </h1>
    </section>
  )
}

export default CardLogo
