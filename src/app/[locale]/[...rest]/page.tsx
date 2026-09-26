import { notFound } from "next/navigation";

// Catch-all so unknown localized paths render the localized 404 inside the site layout.
export default function CatchAll() {
  notFound();
}
