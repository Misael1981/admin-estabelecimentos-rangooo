import z from "zod"

export const emptyToNull = z
  .string()
  .trim()
  .nullish()
  .transform((val) => (val ? val : null))
