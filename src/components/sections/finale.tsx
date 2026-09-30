import { ArrowRight, UserSearch } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { profile } from "@/content/profile";
import { Link } from "@/i18n/navigation";

/**
 * Closing scene: the particle universe gathers into the first name above this text.
 * Without WebGL (or before it starts) an outlined version of the name stands in.
 */
export async function Finale() {
  const t = await getTranslations("finale");
  const firstName = profile.name.split(" ")[0];

  return (
    <section
      id="finale"
      data-scene="finale"
      aria-labelledby="finale-title"
      className="no-print relative flex min-h-[92svh] flex-col items-center justify-end overflow-hidden pt-24 pb-16 sm:pb-24"
    >
      <p
        aria-hidden
        className="finale-fallback text-outline pointer-events-none absolute inset-x-0 top-[18%] text-center font-display text-[clamp(6rem,30vw,24rem)] leading-none font-extrabold uppercase select-none"
      >
        {firstName}
      </p>
      <div className="container-page relative text-center">
        <Reveal>
          <p className="inline-flex items-center gap-3 text-sm text-muted">
            <span aria-hidden className="h-px w-10 bg-border-strong" />
            {t("eyebrow")}
            <span aria-hidden className="h-px w-10 bg-border-strong" />
          </p>
          <h2 id="finale-title" className="mx-auto mt-4 max-w-3xl text-h2 text-balance">
            <SplitWords text={t("title")} />
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" data-magnetic="">
              <a href="#contact">
                {t("contact")}
                <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary" data-magnetic="">
              <Link href="/recruteur">
                <UserSearch />
                {t("recruiter")}
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
