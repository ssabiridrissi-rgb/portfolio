# Portfolio — Saad Sabir Idrissi

Portfolio de **Saad Sabir Idrissi**, élève ingénieur en informatique spécialisé **Data & Intelligence Artificielle** (double diplôme Maroc / Chine), à la recherche d'un stage de fin d'études (PFE).

🔗 **En ligne :** https://saad-sabir-idrissi.vercel.app *(après déploiement)*

<!-- Captures : ajouter ici docs/screenshots/*.png -->

## Fonctionnalités

- **Bilingue FR / EN** (`/fr`, `/en`) · **thème sombre / clair** sans flash
- **Hero** avec réseau de nœuds en canvas, sous-titres animés, portrait avec effet 3D
- **Statistiques calculées** automatiquement depuis le contenu
- **Timeline d'expérience** qui se remplit au scroll
- **Projets** : bento grid filtrable, schémas d'architecture, **pages d'étude de cas** (contexte → problème → approche → architecture → résultats → apprentissages)
- **Graphe de compétences** : chaque compétence est reliée aux projets, expériences et certifications qui l'utilisent
- **Activité GitHub en direct** (API GitHub, cache 1 h, repli hors ligne)
- **Contact** : formulaire validé (zod), envoi via Resend, repli automatique sur `mailto:`, anti-spam, fiche **vCard**
- **Palette de commandes** `Ctrl/⌘ + K` — et un terminal caché (tapez `saad` dans la palette)
- **Mode recruteur** : résumé d'une page, imprimable en PDF (`/fr/recruteur`)
- **SEO** : métadonnées par page et par langue, hreflang, Open Graph dynamique, sitemap, robots, JSON-LD `Person`
- Accessibilité : navigation clavier, lien d'évitement, `prefers-reduced-motion` respecté

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Motion · next-intl · next-themes · cmdk · Resend · zod + react-hook-form · simple-icons · Vercel Analytics & Speed Insights.

## Lancer en local

Prérequis : Node.js ≥ 20.

```bash
npm install
cp .env.example .env.local   # optionnel — tout fonctionne sans
npm run dev                  # http://localhost:3000
```

Avant de publier :

```bash
npm run lint && npm run typecheck && npm run build
```

## Variables d'environnement (toutes optionnelles)

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (canonical, sitemap, Open Graph). Défaut : `https://saad-sabir-idrissi.vercel.app` |
| `RESEND_API_KEY` | Envoi des messages du formulaire. Sans clé → ouverture d'un `mailto:` prérempli |
| `CONTACT_TO_EMAIL` | Destinataire des messages (défaut : l'email du profil) |
| `CONTACT_FROM_EMAIL` | Expéditeur, domaine vérifié chez Resend (défaut : `onboarding@resend.dev`) |
| `GITHUB_TOKEN` | Jeton GitHub sans permission, pour éviter la limite de l'API |

## Mettre à jour le contenu

Tout le contenu est dans **`src/content/`** — aucun JSX à toucher.

| Fichier | Contenu |
| --- | --- |
| `profile.ts` | identité, coordonnées, disponibilité, CV, « En bref » |
| `experience.ts` | expériences (ordre chronologique inverse) |
| `projects.ts` | projets, liens GitHub, études de cas |
| `skills.ts` | compétences et catégories |
| `education.ts` | formation |
| `certifications.ts` | certifications et langues |

Les textes d'interface sont dans `src/messages/fr.json` et `src/messages/en.json`.

### Ajouter un projet

1. Ajouter un objet dans `src/content/projects.ts` (type `Project`) : `slug`, `title`/`summary`… en `{ fr, en }`, `categories`, `skills` (identifiants de `skills.ts` — ils alimentent automatiquement le graphe de compétences), `links.github`.
2. Pour une **étude de cas**, renseigner `caseStudy` : la page `/[locale]/projets/[slug]` est générée automatiquement.
3. Pour un **schéma d'architecture**, ajouter une entrée dans `src/components/visuals/diagram-data.ts` et référencer son id dans `diagram`.
4. `featured: true` place le projet dans la bento grid (dans l'ordre du fichier).

### Ajouter une expérience

Ajouter un objet en tête de `src/content/experience.ts`. `isData: true` affiche le badge « Data » ; `skills` relie l'expérience au graphe de compétences.

### Remplacer les CV ou la photo

- CV : `public/cv/Saad_Sabir_Idrissi_CV_Data_BI.pdf` et `public/cv/Saad_Sabir_Idrissi_CV_IA.pdf`
- Photo : `public/images/saad-portrait.jpg` (format 4:5, visage centré). L'original est dans `public/images/saad.jpg`.

## Déploiement

Voir **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)** — GitHub → Vercel, pas à pas.
