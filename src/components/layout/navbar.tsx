"use client";

import { Command, Menu, UserSearch, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { EASE } from "@/components/ui/reveal";
import { profile } from "@/content/profile";
import { Link, usePathname } from "@/i18n/navigation";
import { emit, UI_EVENTS } from "@/lib/events";
import { PRIMARY_SECTIONS, SECTIONS, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { CvMenu } from "./cv-menu";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // The first section (in page order) that is intersecting the reading band wins.
        const current = SECTIONS.find((id) => visible.has(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01] },
    );
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || menuOpen
            ? "border-b border-border bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent",
        )}
      >
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-accent"
          style={{ scaleX: progress }}
        />
        <nav aria-label={t("mainNav")} className="container-page flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg font-display text-[0.95rem] font-semibold tracking-tight"
            aria-label={`${profile.name} — ${t("home")}`}
          >
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-button font-mono text-[0.68rem] font-bold text-accent-contrast shadow-[0_0_24px_-6px_var(--glow-1)] transition-transform duration-500 ease-out-expo group-hover:rotate-[-6deg]">
              {profile.initials}
            </span>
            <span className="hidden sm:inline">
              Saad<span className="text-muted"> Sabir Idrissi</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {PRIMARY_SECTIONS.map((id) => (
              <li key={id}>
                <Link
                  href={{ pathname: "/", hash: id }}
                  aria-current={active === id ? "location" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-fg",
                    active === id && "text-fg",
                  )}
                >
                  {active === id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-2 ring-1 ring-border"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  {t(id)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => emit(UI_EVENTS.openPalette)}
              className="hidden h-9 items-center gap-2 rounded-full border border-border bg-surface/60 pr-1.5 pl-3 text-xs text-muted transition-colors hover:border-border-strong hover:text-fg md:inline-flex"
              aria-label={t("search")}
            >
              <span>{t("search")}</span>
              <kbd className="inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.65rem]">
                {isMac ? <Command className="size-3" aria-hidden /> : "Ctrl"}
                <span>K</span>
              </kbd>
            </button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-muted sm:inline-flex"
              title={t("recruiter")}
            >
              <Link href="/recruteur">
                <UserSearch />
                <span className="hidden xl:inline">{t("recruiterShort")}</span>
                <span className="sr-only xl:hidden">{t("recruiter")}</span>
              </Link>
            </Button>
            <LocaleSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label={t("search")}
              onClick={() => emit(UI_EVENTS.openPalette)}
            >
              <Command />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t("closeMenu") : t("menu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="no-print fixed inset-0 z-40 flex flex-col bg-bg/95 pt-20 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label={t("mainNav")} className="container-page flex flex-1 flex-col justify-between pb-10">
              <ul className="flex flex-col">
                {SECTIONS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.45, ease: EASE }}
                    className="border-b border-border"
                  >
                    <Link
                      href={{ pathname: "/", hash: id }}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-baseline justify-between py-4 font-display text-3xl font-semibold tracking-tight"
                    >
                      {t(id)}
                      <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-4">
                <CvMenu variant="primary" className="w-full" />
                <div className="flex items-center justify-between">
                  <Link
                    href="/recruteur"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
                  >
                    <UserSearch className="size-4" aria-hidden />
                    {t("recruiter")}
                  </Link>
                  <div className="flex items-center gap-3 text-muted">
                    <a href={profile.github} aria-label="GitHub" className="p-1 hover:text-fg">
                      <BrandLogo logo={{ icon: "github" }} className="size-5" />
                    </a>
                    <a href={profile.linkedin} aria-label="LinkedIn" className="p-1 hover:text-fg">
                      <BrandLogo logo={{ icon: "linkedin" }} className="size-5" />
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
