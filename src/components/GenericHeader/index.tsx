import type { LucideIcon } from "lucide-react"

type GenericHeaderProps = {
  title: string
  description?: string
  icon: LucideIcon
}

const GenericHeader = ({
  title,
  description,
  icon: Icon,
}: GenericHeaderProps) => {
  return (
    <header className="space-y-2 border-b-2 pb-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Icon className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground">{description}</p>
      </div>
    </header>
  )
}

export default GenericHeader
