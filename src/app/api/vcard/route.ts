import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-static";

/** "Add to my contacts": a vCard 3.0 file. */
export function GET() {
  const [first, ...rest] = profile.name.split(" ");
  const card = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${profile.name}`,
    `TITLE:${profile.title.fr}`,
    `EMAIL;TYPE=INTERNET,PREF:${profile.email}`,
    `TEL;TYPE=CELL:${profile.phone.tel}`,
    "ADR;TYPE=HOME:;;;Casablanca;;;Maroc",
    `URL:${siteUrl()}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${profile.github}`,
    `NOTE:${profile.valueProposition.fr}`,
    "END:VCARD",
  ].join("\r\n");

  return new Response(card, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Saad_Sabir_Idrissi.vcf"',
    },
  });
}
