"use server";

import { Resend } from "resend";
import { profile } from "@/content/profile";
import { contactSchema, type ContactInput, type ContactResult } from "@/lib/contact-schema";

const TYPE_LABEL: Record<ContactInput["type"], string> = { pfe: "Stage PFE", job: "Emploi", other: "Autre" };

/**
 * Sends the contact form through Resend.
 * Without RESEND_API_KEY it returns "fallback" and the client opens a pre-filled mailto: — the site never breaks.
 */
export async function sendContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", fieldErrors };
  }

  const data = parsed.data;
  // Bots fill the hidden field: pretend it worked.
  if (data.website) return { status: "success" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "fallback" };

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? process.env.CONTACT_PAR_EMAIL ?? profile.email,
      replyTo: data.email,
      subject: `[${TYPE_LABEL[data.type]}] ${data.name}${data.company ? ` — ${data.company}` : ""}`,
      text: [
        `Nom : ${data.name}`,
        `Email : ${data.email}`,
        `Entreprise : ${data.company || "—"}`,
        `Objet : ${TYPE_LABEL[data.type]}`,
        "",
        data.message,
      ].join("\n"),
    });
    if (error) return { status: "error" };
    return { status: "success" };
  } catch {
    return { status: "error" };
  }
}
