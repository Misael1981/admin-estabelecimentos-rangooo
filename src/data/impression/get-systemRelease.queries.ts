import "server-only"

import { db } from "@/lib/prisma"

export async function getSystemReleases() {
  try {
    const releases = await db.systemRelease.findMany({
      where: { appName: "Rangooo Print Agent" },
      orderBy: [
        { isCurrent: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: 3,
    })

    return releases
  } catch (error) {
    console.error("Erro ao buscar novas versões do agente de impressão:", error)
    return null
  }
}
