"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function useSwitchLocale() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const next = locale === "fr" ? "en" : "fr";

  const switchLocale = () => {
    startTransition(() => {
      const hash = typeof window === "undefined" ? "" : window.location.hash;
      // Pathnames are shared across locales, so the current path can be reused as-is.
      router.replace(`${pathname}${hash}`, { locale: next, scroll: false });
    });
  };

  return { locale, next, switchLocale, isPending, params };
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("locale");
  const { switchLocale, isPending, next } = useSwitchLocale();

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={isPending}
      aria-label={t("switch")}
      title={t("switch")}
      lang={next}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 font-mono text-xs font-semibold tracking-wider text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-60",
        className,
      )}
    >
      {t("short")}
    </button>
  );
}
