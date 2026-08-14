import { z } from "zod";

const internationalPhonePattern = /^\+[1-9]\d{7,14}$/;

export function normalizePhone(value: string): string {
  return value.trim().replace(/[\s().-]/g, "");
}

export const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .refine((value) => internationalPhonePattern.test(value), {
    message: "Utilisez un numéro international valide, par exemple +243812345678.",
  });
