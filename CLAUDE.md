# CLAUDE.md — Portfolio de Saad Sabir Idrissi

Portfolio personnel (objectif : décrocher un stage PFE Data / BI / IA). One-page + pages d'étude de cas + mode recruteur imprimable.

## Stack
- Next.js 15 (App Router, Server Components par défaut), TypeScript `strict`
- Tailwind CSS v4 (tokens dans `src/app/globals.css`), composants façon shadcn/ui écrits à la main dans `src/components/ui`
- `motion` (Framer Motion) — toujours via `<MotionConfig reducedMotion="user">`
- `next-intl` v4 : `fr` (défaut) + `en`, préfixe toujours présent (`/fr`, `/en`), middleware dans `src/middleware.ts`
- `next-themes` : sombre par défaut, clair en option (classe `.dark` / `.light` sur `<html>`)
- `cmdk` (palette ⌘K), Server Action + Resend (contact), zod + react-hook-form
- API GitHub en ISR (`revalidate: 3600`) avec repli statique (`src/lib/github.ts`)
- `@vercel/analytics` + `@vercel/speed-insights` (rendus seulement si `process.env.VERCEL`)

## Commandes
- `npm run dev` — développement
- `npm run lint` · `npm run typecheck` · `npm run build` — les trois doivent passer avant chaque commit
- `npm run icons` — régénère `src/lib/brand-icons.ts` depuis `simple-icons` (ajouter l'icône dans `scripts/generate-icons.mjs`)

## Règles de contenu (non négociables)
- **Tout le contenu vit dans `src/content/*.ts`**, typé par `src/types/content.ts`. Aucun texte de contenu dans le JSX.
- Tout texte long est bilingue `{ fr, en }`. Tout texte d'interface passe par `src/messages/{fr,en}.json` (types générés depuis `fr.json` via `src/global.d.ts`).
- **N'inventer aucun chiffre, résultat, client, témoignage ou compétence.** Info manquante → `// TODO(saad):` dans le code + texte neutre à l'écran.
- Les descriptions des dépôts GitHub reflètent le code réel (audit du 09/2026). AutoLoc est un **projet d'équipe** : le rôle de Saad est *Workflow & Release Manager* (le chatbot a été codé par un coéquipier) — ne jamais le présenter autrement. Le projet AWS est un rapport + captures (pas d'IaC, pas de docker-compose.yml dans le dépôt, un seul sous-réseau public).
- Pas de pourcentages / barres de niveau pour les compétences : le contexte (« utilisé chez Renault », « utilisé dans 3 projets ») est calculé dans `src/lib/derived.ts` et `skills-graph.tsx` à partir des champs `skills` des projets / expériences / certifications.
- Les chiffres de la bande de stats sont calculés (`getStats()`), jamais écrits en dur.

## Conventions
- Couleurs : uniquement via les tokens (`bg-surface`, `text-muted`, `text-accent-fg`, `border-border`…). Jamais de couleur en dur dans un composant (exceptions : couleurs de marque, terminal, image OG).
- Titres : `font-display` (Space Grotesk) · texte : Inter · technique : `font-mono` (JetBrains Mono).
- Animations : easing `[0.22, 1, 0.36, 1]` (`src/lib/motion.ts`), 300–600 ms. Les apparitions au scroll utilisent `<Reveal>` / `<RevealGroup>` / `<RevealItem>` : pur CSS (`[data-reveal]`) + un seul IntersectionObserver (`RevealObserver`) — ne pas les réécrire avec `motion` (coût d'hydratation). `motion` est réservé aux interactions (filtres, pastille de navigation, menu mobile, curseur, transitions de page).
- Le HTML initial n'est jamais masqué : les styles de reveal ne s'appliquent que si `html.js` (script inline dans le layout), le hero utilise l'animation CSS `.fade-up` (sauf le texte, candidat LCP), et `template.tsx` n'anime qu'après une navigation client.
- Icônes de marque : sprite externe `public/brand-icons.svg` (généré, référencé par `<use>`), jamais de `path` inline — cela gonflait le HTML de plusieurs centaines de Ko.
- Performance : sections sous la ligne de flottaison en `content-visibility: auto` (classe `.cv-auto` dans `Section`), palette ⌘K chargée à la demande (`CommandPaletteLoader`), canvas du hero animé seulement après la première interaction (ou 4 s).
- Cartes « spotlight » : ajouter la classe `.spotlight` (un seul listener global dans `SpotlightTracker`).
- Événements UI transverses (ouvrir la palette, le terminal, basculer le curseur) : `src/lib/events.ts`.
- Liens externes : composant `ExternalLink`. Liens internes : `Link` de `@/i18n/navigation`.
- Les chemins sont identiques dans les deux langues (`/projets/[slug]`, `/recruteur`) — choix de simplicité.

## Décisions prises (non précisées dans le brief)
- Portrait : `public/images/saad-portrait.jpg` est un recadrage 4:5 de `saad.jpg` (visage centré) — plus léger et meilleur LCP que `object-position` sur l'image paysage.
- Drapeaux en SVG (`components/ui/flag.tsx`) : les emoji-drapeaux ne s'affichent pas sous Windows.
- Diagrammes d'architecture : données dans `components/visuals/diagram-data.ts`. SVG complet sur les pages d'étude de cas, aperçu HTML lisible (`DiagramPreview`) dans les cartes.
- Mode recruteur = page dédiée `/[locale]/recruteur` (partageable + `@media print` A4) plutôt qu'une modale.
- Curseur personnalisé : anneau discret qui suit la souris, le curseur natif reste visible (utilisabilité). Désactivable via la palette, jamais en `prefers-reduced-motion` ni sur écran tactile.
- Les petits TP Spring/Java sont regroupés dans la carte « Fondamentaux Java & Spring ».
- Formulaire : sans `RESEND_API_KEY`, la Server Action renvoie `fallback` et le client ouvre un `mailto:` prérempli.

## À compléter par Saad (voir les `TODO(saad)`)
- Date exacte de début et durée du PFE (`content/profile.ts` → `availability`)
- Ouverture à l'international (`profile.mobility`)
- Intitulés exacts des certifications AWS et Huawei + liens `credentialUrl`
- Stack et dépôt de ProcureTrace AI ; dépôts des projets BI et SmartHousing
