"use client";

import { Command } from "cmdk";
import {
  ArrowRight,
  Clapperboard,
  Copy,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Hash,
  Languages,
  Flashlight,
  MousePointer2,
  SunMoon,
  UserSearch,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSwitchLocale } from "@/components/layout/locale-switcher";
import { BrandLogo } from "@/components/ui/brand-logo";
import { caseStudyProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { usePathname, useRouter } from "@/i18n/navigation";
import { emit, readStorage, replayOpening, UI_EVENTS } from "@/lib/events";
import { SECTIONS, type SectionId } from "@/lib/sections";
import { scrollToElement } from "@/lib/smooth-scroll";
import { Terminal } from "./terminal";

const EASTER_EGG = "saad";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function isSubsequence(text: string, query: string) {
  let i = 0;
  for (const char of text) if (char === query[i]) i++;
  return i === query.length;
}

/** Label first, then keywords, fuzzy last — so "lampe" finds the lights, not a project's skill list. */
function paletteFilter(value: string, search: string, keywords?: string[]) {
  const query = normalize(search.trim());
  if (!query) return 1;
  const label = normalize(value);
  if (label.startsWith(query)) return 1;
  if (label.includes(query)) return 0.9;
  const keys = (keywords ?? []).map(normalize);
  if (keys.some((k) => k.startsWith(query))) return 0.75;
  if (keys.some((k) => k.includes(query))) return 0.5;
  return isSubsequence(label, query) ? 0.15 : 0;
}

export function CommandPalette({ initial }: { initial: "palette" | "terminal" }) {
  const t = useTranslations("palette");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { switchLocale } = useSwitchLocale();
  const [open, setOpen] = useState(initial === "palette");
  const [terminalOpen, setTerminalOpen] = useState(initial === "terminal");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [cursorOn, setCursorOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    const onTerminal = () => setTerminalOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(UI_EVENTS.openPalette, onOpen);
    window.addEventListener(UI_EVENTS.openTerminal, onTerminal);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(UI_EVENTS.openPalette, onOpen);
      window.removeEventListener(UI_EVENTS.openTerminal, onTerminal);
    };
  }, []);

  useEffect(() => {
    if (open) setCursorOn(readStorage("cursor-pref") !== "off");
    else setSearch("");
  }, [open]);

  useEffect(() => {
    if (search.trim().toLowerCase() === EASTER_EGG) {
      setOpen(false);
      setTerminalOpen(true);
    }
  }, [search]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const run = useCallback((action: () => void) => {
    setOpen(false);
    // Let the dialog close (and restore focus) before acting.
    window.setTimeout(action, 0);
  }, []);

  const goToSection = (id: SectionId) => {
    const section = pathname === "/" ? document.getElementById(id) : null;
    if (section) {
      scrollToElement(section);
      history.replaceState(null, "", `#${id}`);
    } else {
      router.push(`/#${id}`);
    }
  };

  const download = (href: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = "";
    a.click();
  };

  const openExternal = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={t("title")}
        loop
        filter={paletteFilter}
        overlayClassName="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        contentClassName="fixed top-[12vh] left-1/2 z-[81] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_40px_120px_-20px_rgb(0_0_0/0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Hash className="size-4 text-subtle" aria-hidden />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder={t("placeholder")}
            className="h-14 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-subtle"
          />
          <kbd className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.65rem] text-subtle">
            Esc
          </kbd>
        </div>
        <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-subtle [&_[cmdk-group-heading]]:uppercase">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted">{t("empty")}</Command.Empty>

          <Command.Group heading={t("navigation")}>
            {SECTIONS.map((id) => (
              <Item key={id} icon={<ArrowRight />} onSelect={() => run(() => goToSection(id))} keywords={[id]}>
                {nav(id)}
              </Item>
            ))}
          </Command.Group>

          <Command.Group heading={t("projects")}>
            {caseStudyProjects.map((p) => (
              <Item
                key={p.slug}
                icon={<FolderGit2 />}
                onSelect={() => run(() => router.push(`/projets/${p.slug}`))}
                keywords={[p.slug, ...p.skills]}
              >
                {p.title[locale]}
              </Item>
            ))}
          </Command.Group>

          <Command.Group heading={t("actions")}>
            <Item
              icon={<Copy />}
              keywords={["email", "mail", "copy", "copier"]}
              onSelect={() =>
                run(() => {
                  navigator.clipboard
                    ?.writeText(profile.email)
                    .then(() => setToast(t("emailCopied")))
                    .catch(() => undefined);
                })
              }
            >
              {t("copyEmail")}
            </Item>
            {profile.cvs.map((cv) => (
              <Item key={cv.href} icon={<FileText />} keywords={["cv", "resume", "pdf"]} onSelect={() => run(() => download(cv.href))}>
                {t("downloadCv", { label: cv.label[locale] })}
              </Item>
            ))}
            <Item icon={<UserSearch />} keywords={["recruiter", "recruteur", "print"]} onSelect={() => run(() => router.push("/recruteur"))}>
              {t("recruiter")}
            </Item>
          </Command.Group>

          <Command.Group heading={t("links")}>
            <Item icon={<BrandLogo logo={{ icon: "github" }} />} onSelect={() => run(() => openExternal(profile.github))}>
              {t("openGithub")}
            </Item>
            <Item icon={<BrandLogo logo={{ icon: "linkedin" }} />} onSelect={() => run(() => openExternal(profile.linkedin))}>
              {t("openLinkedin")}
            </Item>
          </Command.Group>

          <Command.Group heading={t("preferences")}>
            <Item
              icon={<SunMoon />}
              keywords={["theme", "dark", "light", "sombre", "clair"]}
              onSelect={() => run(() => setTheme(resolvedTheme === "light" ? "dark" : "light"))}
            >
              {t("toggleTheme")}
            </Item>
            <Item icon={<Languages />} keywords={["language", "langue", "english", "français"]} onSelect={() => run(switchLocale)}>
              {t("switchLanguage")}
            </Item>
            <Item icon={<MousePointer2 />} keywords={["cursor", "curseur"]} onSelect={() => run(() => emit(UI_EVENTS.cursorToggle))}>
              {cursorOn ? t("cursorOff") : t("cursorOn")}
            </Item>
            <Item icon={<Flashlight />} keywords={["lights", "lumière", "torch", "lampe"]} onSelect={() => run(() => emit(UI_EVENTS.lightsToggle))}>
              {t("lightsOff")}
            </Item>
            <Item
              icon={<Clapperboard />}
              keywords={["intro", "opening", "ouverture", "rideau", "curtain", "generique"]}
              onSelect={() => run(() => replayOpening(locale))}
            >
              {t("replayOpening")}
            </Item>
          </Command.Group>
        </Command.List>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[0.68rem] text-subtle">
          <span>{t("tip")}</span>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft className="size-3" aria-hidden /> Enter
          </span>
        </div>
      </Command.Dialog>

      <Terminal open={terminalOpen} onOpenChange={setTerminalOpen} />

      <AnimatePresence>
        {toast ? (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-border-strong bg-surface px-4 py-2 text-sm shadow-xl"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Item({
  children,
  icon,
  onSelect,
  keywords,
}: {
  children: ReactNode;
  icon: ReactNode;
  onSelect: () => void;
  keywords?: string[];
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      keywords={keywords}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted outline-none data-[selected=true]:bg-surface-2 data-[selected=true]:text-fg [&_svg]:size-4 [&_svg]:shrink-0"
    >
      <span className="text-subtle" aria-hidden>
        {icon}
      </span>
      {children}
    </Command.Item>
  );
}
