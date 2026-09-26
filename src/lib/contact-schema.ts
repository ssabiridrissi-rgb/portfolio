import { z } from "zod";

export const CONTACT_TYPES = ["pfe", "job", "other"] as const;

/** Error messages are i18n keys under `contact.errors`. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(100, "name"),
  email: z.string().trim().email("email").max(200, "email"),
  company: z.string().trim().max(120, "company").optional().or(z.literal("")),
  type: z.enum(CONTACT_TYPES),
  message: z.string().trim().min(20, "message").max(5000, "messageMax"),
  /** Honeypot — humans never see or fill it. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { status: "success" }
  | { status: "fallback" }
  | { status: "error"; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
