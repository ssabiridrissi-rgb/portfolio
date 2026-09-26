import { ArrowLeft, FolderGit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** 404 with a data twist: a query that returned nothing. */
export function NotFoundView() {
  const t = useTranslations("notFound");

  return (
    <section className="relative flex min-h-[85svh] items-center pt-24 pb-16">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-70" />
      <div className="container-page flex flex-col items-center text-center">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border-strong bg-surface text-left font-mono text-sm shadow-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-xs text-subtle">
            <span className="size-2.5 rounded-full bg-danger/80" aria-hidden />
            <span className="size-2.5 rounded-full bg-warning/80" aria-hidden />
            <span className="size-2.5 rounded-full bg-success/80" aria-hidden />
            <span className="ml-2">portfolio_dw — psql</span>
          </div>
          <pre className="overflow-x-auto p-5 leading-relaxed whitespace-pre-wrap">
            <span className="text-accent-fg">SELECT</span> * <span className="text-accent-fg">FROM</span> pages{"\n"}
            <span className="text-accent-fg">WHERE</span> url = <span className="text-success">&apos;this-page&apos;</span>;{"\n\n"}
            <span className="text-muted">(0 rows)</span>
          </pre>
        </div>
        <p className="mt-10 font-mono text-sm tracking-widest text-accent-fg uppercase">404 · {t("rows")}</p>
        <h1 className="mt-3 text-h2">{t("title")}</h1>
        <p className="mt-4 max-w-md text-muted">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft />
              {t("home")}
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href={{ pathname: "/", hash: "projects" }}>
              <FolderGit2 />
              {t("projects")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
