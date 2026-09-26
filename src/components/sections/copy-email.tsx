"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { profile } from "@/content/profile";

export function CopyEmail() {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-fg"
      aria-label={copied ? t("copied") : t("copy")}
    >
      {copied ? <Check className="size-3.5 text-success" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}
