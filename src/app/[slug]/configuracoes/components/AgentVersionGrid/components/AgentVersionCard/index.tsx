import SubCard from "@/components/ui/sub-card"
import { Download, Clock, PackageCheck } from "lucide-react"

type AgentVersionCardProps = {
  version: {
    id: string
    createdAt: Date
    updatedAt: Date
    publishedAt: Date
    appName: string
    version: string
    downloadUrl: string
    changelog: string | null
    isCurrent: boolean
  }
}

const AgentVersionCard = ({ version }: AgentVersionCardProps) => {
  return (
    <SubCard>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {version.appName}
            </p>

            <h2 className="text-xl font-semibold tracking-tight">
              {version.version}
            </h2>
          </div>

          {version.isCurrent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFDE7] px-3 py-1 text-xs font-medium text-yellow-800">
              <PackageCheck className="size-3.5" />
              Versão atual
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">
            Novidades desta versão
          </p>

          <p className="text-sm leading-relaxed whitespace-pre-line">
            {version.changelog || "Nenhuma alteração descrita."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Clock className="size-3.5" />
            Publicada em{" "}
            {new Intl.DateTimeFormat("pt-BR").format(version.publishedAt)}
          </div>

          <a
            href={version.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <Download className="size-4" />
            Baixar versão
          </a>
        </div>
      </div>
    </SubCard>
  )
}

export default AgentVersionCard
