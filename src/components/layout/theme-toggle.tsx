"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={t("toggle")}
      title={t("toggle")}
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      {/* Both icons are rendered; CSS picks one, so there is no hydration flash. */}
      <Sun className="hidden dark:block" />
      <Moon className="hidden light:block" />
    </Button>
  );
}
