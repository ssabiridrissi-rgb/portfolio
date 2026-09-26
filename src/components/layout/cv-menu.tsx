"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Download, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  align?: "start" | "end" | "center";
};

export function CvMenu({ variant = "secondary", size = "lg", className, align = "start" }: Props) {
  const t = useTranslations("cv");
  const locale = useLocale();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant={variant} size={size} className={cn("group", className)} aria-label={t("menu")}>
          <Download />
          {t("download")}
          <ChevronDown className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          className="z-[70] min-w-[17rem] rounded-2xl border border-border-strong bg-surface/95 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          <DropdownMenu.Label className="px-3 pt-2 pb-1.5 font-mono text-[0.68rem] tracking-widest text-subtle uppercase">
            {t("menu")}
          </DropdownMenu.Label>
          {profile.cvs.map((cv) => (
            <DropdownMenu.Item key={cv.href} asChild>
              <a
                href={cv.href}
                download
                className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 outline-none data-[highlighted]:bg-surface-2"
              >
                <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-accent/10 text-accent-fg">
                  <FileText className="size-4" aria-hidden />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-fg">{cv.label[locale]}</span>
                  <span className="text-xs text-muted">{cv.description[locale]} · PDF</span>
                </span>
              </a>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
