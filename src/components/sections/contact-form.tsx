"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, LoaderCircle, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { sendContact } from "@/lib/actions/contact";
import { CONTACT_TYPES, contactSchema, type ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

type Status = "idle" | "success" | "error" | "fallback";

const fieldClass =
  "w-full rounded-xl border border-border-strong bg-surface-2/60 px-4 py-3 text-[0.95rem] text-fg transition-[border-color,box-shadow] outline-none placeholder:text-subtle focus:border-accent focus:shadow-[0_0_0_4px_var(--glow-1)] aria-[invalid=true]:border-danger";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", type: "pfe", message: "", website: "" },
  });

  const buildMailto = (data: ContactInput) => {
    const subject = t("mailSubject", { type: t(`types.${data.type}`), name: data.name });
    const body = `${data.message}\n\n—\n${data.name}${data.company ? ` · ${data.company}` : ""}\n${data.email}`;
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (data: ContactInput) => {
    setStatus("idle");
    try {
      const result = await sendContact(data);
      if (result.status === "success") {
        setStatus("success");
        reset();
      } else if (result.status === "fallback") {
        const href = buildMailto(data);
        setMailto(href);
        setStatus("fallback");
        window.location.href = href;
      } else {
        for (const [field, key] of Object.entries(result.fieldErrors ?? {})) {
          setError(field as keyof ContactInput, { message: key });
        }
        setMailto(buildMailto(data));
        setStatus("error");
      }
    } catch {
      setMailto(buildMailto(data));
      setStatus("error");
    }
  };

  const errorText = (key?: string) =>
    key ? t(`errors.${key as "name" | "email" | "company" | "message" | "messageMax"}`) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t("name")} error={errorText(errors.name?.message)}>
          <input id="name" autoComplete="name" className={fieldClass} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
        </Field>
        <Field id="email" label={t("email")} error={errorText(errors.email?.message)}>
          <input id="email" type="email" autoComplete="email" inputMode="email" className={fieldClass} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label={t("company")} hint={t("optional")} error={errorText(errors.company?.message)}>
          <input id="company" autoComplete="organization" className={fieldClass} aria-invalid={Boolean(errors.company)} {...register("company")} />
        </Field>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-fg">{t("type")}</legend>
          <div className="grid grid-cols-3 gap-2">
            {CONTACT_TYPES.map((type) => (
              <label key={type} className="relative">
                <input type="radio" value={type} className="peer sr-only" {...register("type")} />
                <span className="flex h-[50px] cursor-pointer items-center justify-center rounded-xl border border-border-strong bg-surface-2/60 px-2 text-center text-sm text-muted transition-colors peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-2">
                  {t(`types.${type}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <Field id="message" label={t("message")} error={errorText(errors.message?.message)}>
        <textarea
          id="message"
          rows={6}
          placeholder={t("messagePlaceholder")}
          className={cn(fieldClass, "resize-y")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
      </Field>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">{t("honeypot")}</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} className="sm:self-start">
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Send />}
          {isSubmitting ? t("sending") : t("submit")}
        </Button>
        <div aria-live="polite" className="text-sm">
          {status === "success" ? (
            <p className="flex items-start gap-2 text-success">
              <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
              {t("success")}
            </p>
          ) : null}
          {status === "fallback" && mailto ? (
            <p className="flex items-start gap-2 text-muted">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {t("fallback")}{" "}
                <a href={mailto} className="text-accent-fg underline underline-offset-4">
                  {t("fallbackLink")}
                </a>
              </span>
            </p>
          ) : null}
          {status === "error" ? (
            <p className="flex items-start gap-2 text-danger">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {t("error")}{" "}
                {mailto ? (
                  <a href={mailto} className="underline underline-offset-4">
                    {t("fallbackLink")}
                  </a>
                ) : null}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium text-fg">
        {label}
        {hint ? <span className="text-xs font-normal text-subtle">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
