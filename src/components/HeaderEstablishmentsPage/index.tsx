import { Separator } from "../ui/separator"

type HeaderEstablishmentsPageProps = {
  title: string
  description: string
  icon: React.ReactNode
  notice?: string
}

const HeaderEstablishmentsPage = ({
  title,
  description,
  icon,
  notice,
}: HeaderEstablishmentsPageProps) => {
  return (
    <header className="space-y-4 pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              {icon}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      {notice && (
        <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4">
          <p className="text-xs leading-relaxed text-amber-800">
            <span className="font-bold">Atenção:</span> {notice}
          </p>
        </div>
      )}

      <Separator />
    </header>
  )
}

export default HeaderEstablishmentsPage
