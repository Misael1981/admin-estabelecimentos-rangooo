import z from "zod"

export const emptyToNull = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((val) => {
    return val === "" || val === undefined ? null : val
  })
