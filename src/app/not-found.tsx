import Link from "next/link";
import "./globals.css";

// Only reached outside a locale segment (the middleware normally adds one).
export default function RootNotFound() {
  return (
    <html lang="fr" className="dark">
      <body style={{ display: "grid", minHeight: "100dvh", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "monospace", opacity: 0.7 }}>404 · Query returned 0 rows</p>
          <h1 style={{ fontSize: "2rem", margin: "0.5rem 0 1.5rem" }}>Page introuvable · Page not found</h1>
          <Link href="/fr" style={{ textDecoration: "underline" }}>
            Accueil
          </Link>{" "}
          ·{" "}
          <Link href="/en" style={{ textDecoration: "underline" }}>
            Home
          </Link>
        </main>
      </body>
    </html>
  );
}
