export function parseJsonArray<T>(value: unknown): T[] {
  if (!value) return []

  if (Array.isArray(value)) return value as T[]

  try {
    return JSON.parse(value as string) as T[]
  } catch {
    return []
  }
}
