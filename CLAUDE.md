# CLAUDE.md — Portfolio de Saad Sabir Idrissi

Portfolio personnel (objectif : décrocher un stage PFE Data / BI / IA). One-page + pages d'étude de cas + mode recruteur imprimable.

## Stack
- Next.js 15 (App Router, Server Components par défaut), TypeScript `strict`
- Tailwind CSS v4 (tokens dans `src/app/globals.css`), composants façon shadcn/ui écrits à la main dans `src/components/ui`
- `motion` (Framer Motion) — toujours via `<MotionConfig reducedMotion="user">`
- `next-intl` v4 : `fr` (défaut) + `en`, préfixe toujours présent (`/fr`, `/en`), middleware dans `src/middleware.ts`
- `next-themes` : sombre par défaut, clair en option (classe `.dark` / `.light` sur `<html>`)
- `cmdk` (palette ⌘K), Server Action + Resend (contact), zod + react-hook-form
- `lenis` : défilement à inertie (souris / trackpad seulement, jamais en `prefers-reduced-motion`), provider `SmoothScroll`
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
- Distinctions (`src/content/achievements.ts`) : NXP Cup 2025 = **3ᵉ place en équipe** ; SolarNav AI (hackathon GoMyCode) = Saad **responsable de la partie data** (jeu de 40 000 exemples) — le modèle est celui de l'équipe ; Casablanca AI Lab (sept. 2026) = dashboard de choix fournisseurs (pièces auto). GenTech : écrire « Membre fondateur », pas « Fondateur » seul (d'autres membres se présentent aussi comme fondateurs). Les rôles RH restent « Chargé des ressources humaines » tant que Saad n'a pas confirmé « Responsable ».
- Le portfolio goatcliper.github.io (Mohamed Bouhassoune, même école, mêmes projets BI / NXP Cup / GenTech) sert de référence : **ne jamais reprendre ses formulations**.
- Les visuels illustratifs (tableau fournisseurs AI Lab, corrections poussière/chaleur du simulateur SolarNav) n'affichent aucun chiffre et sont signalés « illustration » à l'écran.

## Conventions
- Couleurs : uniquement via les tokens (`bg-surface`, `text-muted`, `text-accent-fg`, `border-border`…). Jamais de couleur en dur dans un composant (exceptions : couleurs de marque, terminal, image OG).
- Identité « salle de projection » : lumière dorée sur fond nuit (sombre), papier et laiton (clair). Pas de dégradés bleu / violet, pas d'icône ✦, pas de pastille d'initiales (« SSI » retiré à la demande de Saad : le logo est le mot « Saad » + point doré, classe `.wordmark`).
- Polices : `font-display` = Fraunces (variable, italiques dorées), texte = Instrument Sans, technique = `font-mono` (DM Mono). Dans un titre de section, `*mots*` passe en italique doré (`SplitWords`).
- Animations : easing `[0.22, 1, 0.36, 1]` (`src/lib/motion.ts`), 300–600 ms. Les apparitions au scroll utilisent `<Reveal>` / `<RevealGroup>` / `<RevealItem>` : pur CSS (`[data-reveal]`) + un seul IntersectionObserver (`RevealObserver`) — ne pas les réécrire avec `motion` (coût d'hydratation). `motion` est réservé aux interactions (filtres, pastille de navigation, menu mobile, curseur, transitions de page).
- Le HTML initial n'est jamais masqué : les styles de reveal ne s'appliquent que si `html.js` (script inline dans le layout), le hero utilise l'animation CSS `.fade-up` (sauf le texte, candidat LCP) — idem pour l'en-tête des études de cas —, et `template.tsx` n'anime qu'après une navigation client.
- Icônes de marque : sprite externe `public/brand-icons.svg` (généré, référencé par `<use>`), jamais de `path` inline — cela gonflait le HTML de plusieurs centaines de Ko.
- Performance : sections sous la ligne de flottaison en `content-visibility: auto` (classe `.cv-auto` dans `Section`) ; `SectionSizeWarmup` les met en page une fois au repos pour que les ancres tombent juste. Palette ⌘K chargée à la demande (`CommandPaletteLoader`). L'univers WebGL (`components/universe`) est importé dynamiquement après `requestIdleCallback` (`UniverseLoader`, ~8 Ko gzip) : le LCP reste le texte / le portrait du hero. Ses formations sont pré-calculées pendant les temps morts ; résolution du canvas plafonnée (particules douces).
- Univers de particules : un seul canvas fixe (`DataUniverse`, WebGL 1 sans bibliothèque). Une section déclare sa formation avec `scene` (`<Section scene="projects">` → `data-scene`) ; les réglages (formation, position, intensité, version mobile) sont dans `components/universe/scenes.ts`, les nuages de points dans `formations.ts`. Réduction des mouvements → une image fixe, sans animation. Pas de WebGL → les halos CSS du hero et le prénom en contour du finale restent.
- Titres de section : un `title` texte passe par `<SplitWords>` (mots qui montent, pur CSS via `[data-reveal]`).
- CSS maison dans `globals.css` : les règles hors `@layer` écrasent les utilitaires Tailwind — ne pas y fixer `display`, `translate`, etc. sur des éléments qui ont aussi des classes utilitaires.
- Effets de carte : `.tilt` (inclinaison 3D) et `<span className="holo" />` (reflet) lisent les variables de `SpotlightTracker` ; pas de `.tilt` sur une carte qui contient des contrôles (curseurs…). Boutons magnétiques : attribut `data-magnetic` (un seul listener, `MagneticTracker`).
- Photo du hero : `PortraitProjector` (shader WebGL sur le vrai `<img>`, qui reste l'élément LCP et le repli) — hors de la lumière, trame de points dorés ; la lumière suit le pointeur et révèle la photo ; clic = flash. Le nom du hero (`InteractiveName`) s'épaissit sous le pointeur (graisse variable de Fraunces).
- Curseur : halo de lumière chaude + point + anneau ; un élément avec `data-cursor="…"` (texte traduit, namespace `cursor`) transforme l'anneau en étiquette.
- Ancres de la page : `SmoothScroll` les intercepte en phase de capture (le `<Link>` de Next ignore alors le clic) ; la palette passe par `scrollToElement()` (`lib/smooth-scroll.ts`). Zones défilables internes : `data-lenis-prevent`.
- Éléments en `position: fixed` rendus dans une section `.cv-auto` : passer par un portail (`createPortal`), la containment de `content-visibility` les piégerait (cf. aperçu de `OtherProjectsIndex`).
- Easter eggs : terminal (taper « saad » dans la palette), mode « lumières éteintes » (palette ou commande `lights`), changement de thème en cercle de lumière (View Transitions, repli instantané).
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
- Section « Méthode » : les puces « Là où je l'ai fait » sont calculées (`getProofs()` dans `derived.ts`) à partir des `skills` de chaque étape, plus `projects` explicites quand la stack d'un projet est encore en TODO (ProcureTrace). Jamais AutoLoc pour l'IA.
- SolarNav AI est le premier projet mis en avant (le plus data + IA, rôle de Saad clair). Son simulateur d'orbite n'illustre que la règle physique documentée (angle = 90° − élévation, repli à 0° dans l'ombre).
- Le mode recruteur tient sur une seule page A4 en impression (typo resserrée en `print:`, pas de ligne de stack sous les projets).

## À compléter par Saad (voir les `TODO(saad)`)
- Distinctions : rôle exact dans l'équipe NXP Cup (et mois) ; date, taille d'équipe et lien (dépôt / vidéo du bras robotisé) du hackathon GoMyCode ; outil, équipe et résultat du hackathon Casablanca AI Lab (lien avec ProcureTrace AI ?) ; dates et actions concrètes pour GenTech et Legends
- Durée exacte du PFE (début confirmé : à partir de février 2027)
- Ouverture à l'international (`profile.mobility`)
- Liens `credentialUrl` des certifications (intitulés confirmés = ceux du CV)
- Stack et dépôt de ProcureTrace AI ; dépôts des projets BI et SmartHousing
