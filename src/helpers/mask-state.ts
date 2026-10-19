export function maskState(value: string) {
  return value
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 2)
}
