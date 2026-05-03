export function formatPhoneNumber(value: string) {
  if (!value) return ""

  const digits = value.replace(/\D/g, "")

  const limitedDigits = digits.slice(0, 11)

  const len = limitedDigits.length

  if (len <= 2) {
    return limitedDigits.replace(/^(\d{0,2})/, "($1")
  } else if (len <= 6) {
    return limitedDigits.replace(/^(\d{2})(\d{0,4})/, "($1) $2")
  } else if (len <= 10) {
    return limitedDigits.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
  } else {
    return limitedDigits.replace(
      /^(\d{2})(\d{1})(\d{4})(\d{4})/,
      "($1) $2 $3-$4",
    )
  }
}
