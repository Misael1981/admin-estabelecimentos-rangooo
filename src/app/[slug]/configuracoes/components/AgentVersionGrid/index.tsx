import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AgentVersionCard from "./components/AgentVersionCard"
import HeaderEstablishmentsPage from "@/components/HeaderEstablishmentsPage"
import { PrinterCheck } from "lucide-react"

type AgentVersionGridProps = {
  releases:
    | {
        id: string
        createdAt: Date
        updatedAt: Date
        publishedAt: Date
        appName: string
        version: string
        downloadUrl: string
        changelog: string | null
        isCurrent: boolean
      }[]
    | null
}

const AgentVersionGrid = ({ releases }: AgentVersionGridProps) => {
  return (
    <div className="space-y-8">
      <HeaderEstablishmentsPage
        title="Agentes de Impressão Rangooo"
        icon={<PrinterCheck />}
        description="Lista com os Apps disponíveis para download."
      />

      <Card>
        <CardHeader>
          <CardTitle>Agente de Impressão Rangooo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {releases === null ? (
            <p className="text-muted-foreground text-sm">
              Não foi possível carregar as versões. Tente novamente.
            </p>
          ) : releases.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma versão cadastrada ainda.
            </p>
          ) : (
            releases.map((v) => <AgentVersionCard key={v.id} version={v} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AgentVersionGrid
