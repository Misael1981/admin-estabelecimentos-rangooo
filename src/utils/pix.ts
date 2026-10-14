interface PixPayloadParams {
  key: string
  name: string
  city: string
  amount?: number
  txid?: string
}

// Remove acentos, deixa em maiúsculo e tira caracteres fora do padrão
const sanitize = (text: string, max: number) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .trim()
    .substring(0, max)

// Telefone precisa de +55; CPF, CNPJ, e-mail e chave aleatória ficam como estão
const normalizePixKey = (key: string) => {
  const k = key.trim()
  if (k.startsWith("+")) return k
  return k
}

const formatField = (id: string, value: string) =>
  `${id}${value.length.toString().padStart(2, "0")}${value}`

const calculateCRC16 = (str: string) => {
  let crc = 0xffff
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0")
}

export function generatePixPayload({
  key,
  name,
  city,
  amount,
  txid = "***",
}: PixPayloadParams): string {
  const merchantAccountInfo = formatField(
    "26",
    formatField("00", "br.gov.bcb.pix") +
      formatField("01", normalizePixKey(key)),
  )

  const transactionAmount =
    amount !== undefined && amount > 0
      ? formatField("54", amount.toFixed(2))
      : ""

  const additionalData = formatField("62", formatField("05", txid))

  const partialPayload =
    formatField("00", "01") +
    merchantAccountInfo +
    formatField("52", "0000") +
    formatField("53", "986") +
    transactionAmount +
    formatField("58", "BR") + // <- faltava
    formatField("59", sanitize(name, 25)) +
    formatField("60", sanitize(city, 15)) +
    additionalData +
    "6304"

  return partialPayload + calculateCRC16(partialPayload)
}
