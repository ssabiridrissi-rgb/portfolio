import type { ReactNode } from "react";

// The real <html> lives in app/[locale]/layout.tsx; this root layout only passes through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
