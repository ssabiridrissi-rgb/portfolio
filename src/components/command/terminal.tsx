"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { experiences } from "@/content/experience";
import { featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { skillCategories, skills } from "@/content/skills";

type Line = { kind: "in" | "out"; text: string };

export function Terminal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations("terminal");
  const locale = useLocale();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setLines([{ kind: "out", text: t("welcome") }]);
  }, [open, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const execute = (raw: string): string[] | "clear" | "exit" => {
    const cmd = raw.trim().toLowerCase();
    switch (cmd) {
      case "":
        return [];
      case "help":
        return [t("help")];
      case "whoami":
        return [
          `${profile.name} — ${profile.title[locale]}`,
          profile.valueProposition[locale],
          profile.availability.headline[locale],
        ];
      case "skills":
        return skillCategories.map(
          (c) =>
            `${c.label[locale].padEnd(22, " ")} ${skills
              .filter((s) => s.category === c.id)
              .map((s) => s.name)
              .join(", ")}`,
        );
      case "projects":
        return [
          t("projectsIntro"),
          ...featuredProjects.map((p) => `  • ${p.title[locale]} — ${p.subtitle[locale]}`),
        ];
      case "experience":
        return experiences.map((e) => `  • ${e.company} — ${e.role[locale]} (${e.start} → ${e.end})`);
      case "contact":
        return [
          t("contactIntro"),
          `  email     ${profile.email}`,
          `  phone     ${profile.phone.display}`,
          `  linkedin  ${profile.linkedin}`,
          `  github    ${profile.github}`,
        ];
      case "cv": {
        const a = document.createElement("a");
        a.href = profile.cvs[0].href;
        a.download = "";
        a.click();
        return [t("cv")];
      }
      case "clear":
        return "clear";
      case "exit":
        return "exit";
      case "sudo hire saad":
        return ["✔ Permission granted. → " + profile.email];
      default:
        return [t("notFound", { cmd: raw.trim() })];
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = execute(value);
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 30));
    setCursor(-1);
    if (result === "clear") setLines([]);
    else if (result === "exit") onOpenChange(false);
    else setLines((l) => [...l, { kind: "in", text: value }, ...result.map((text) => ({ kind: "out" as const, text }))]);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setValue(next >= 0 ? history[next] : "");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-[81] flex h-[min(70vh,480px)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border-strong bg-[#05070c] font-mono text-[0.82rem] text-[#d6e2f5] shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden />
              <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden />
              <span className="size-3 rounded-full bg-[#28c840]" aria-hidden />
              <Dialog.Title className="ml-3 text-xs text-[#9fb0c8]">{t("title")}</Dialog.Title>
            </div>
            <Dialog.Close className="rounded-md p-1 text-[#9fb0c8] hover:bg-white/10 hover:text-white" aria-label={t("close")}>
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4" onClick={() => document.getElementById("terminal-input")?.focus()}>
            {lines.map((line, i) => (
              <p key={i} className="leading-relaxed break-words whitespace-pre-wrap">
                {line.kind === "in" ? (
                  <>
                    <span className="text-[#22d3ee]">saad@portfolio</span>
                    <span className="text-[#9fb0c8]">:~$ </span>
                    {line.text}
                  </>
                ) : (
                  <span className="text-[#c3cee0]">{line.text}</span>
                )}
              </p>
            ))}
            <form onSubmit={onSubmit} className="flex items-center">
              <label htmlFor="terminal-input" className="shrink-0">
                <span className="text-[#22d3ee]">saad@portfolio</span>
                <span className="text-[#9fb0c8]">:~$&nbsp;</span>
                <span className="sr-only">{t("input")}</span>
              </label>
              <input
                id="terminal-input"
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent text-[#f1f5fb] caret-[#22d3ee] outline-none"
              />
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
