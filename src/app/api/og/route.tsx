import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const runtime = "nodejs";

/** Dynamic Open Graph image: name, title, portrait and the availability badge. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "en" ? "en" : "fr";
  const title = searchParams.get("title")?.slice(0, 90) ?? profile.name;
  const subtitle = searchParams.get("subtitle")?.slice(0, 140) ?? profile.title[locale];

  // Public files are not bundled with serverless functions, so fetch the portrait from the site itself.
  const photo = await fetch(new URL("/images/saad-portrait.jpg", request.url)).then((r) => r.arrayBuffer());
  const photoSrc = `data:image/jpeg;base64,${Buffer.from(photo).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #07090f 0%, #0e1320 55%, #141b2d 100%)",
          color: "#e7ebf3",
          fontFamily: "sans-serif",
          padding: 64,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -120,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: "radial-gradient(closest-side, rgba(59,130,246,0.35), rgba(59,130,246,0))",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 56,
                height: 56,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(120deg, #2563eb, #4f46e5)",
                fontSize: 20,
                fontWeight: 700,
                color: "white",
              }}
            >
              SSI
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#9aa6ba" }}>Portfolio · Data & IA</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: title.length > 40 ? 58 : 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: "#6aa8ff", lineHeight: 1.3 }}>{subtitle}</div>
          </div>

          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 22px",
                borderRadius: 9999,
                border: "1px solid rgba(52,211,153,0.4)",
                background: "rgba(52,211,153,0.12)",
                color: "#34d399",
                fontSize: 24,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#34d399" }} />
              {profile.availability.headline[locale]}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: 4,
            borderRadius: 32,
            background: "linear-gradient(135deg, #3b82f6, #22d3ee, #8b5cf6)",
            alignSelf: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} alt="" width={340} height={425} style={{ borderRadius: 28, objectFit: "cover" }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    },
  );
}
