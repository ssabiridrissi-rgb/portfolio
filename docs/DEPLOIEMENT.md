# Déployer le portfolio sur Vercel — pas à pas

Durée : environ 10 minutes. Coût : 0 € (offre Hobby de Vercel).

## 1. Publier le code sur GitHub

Le dépôt Git local existe déjà (branche `main`, commits faits). Il reste à créer le dépôt GitHub `portfolio` sur le compte `ssabiridrissi-rgb`.

**Option A — avec la CLI GitHub** (`winget install GitHub.cli`, puis `gh auth login`) :

```bash
cd portfolio-saad
gh repo create ssabiridrissi-rgb/portfolio --public --source=. --remote=origin --push
```

**Option B — sans la CLI :**

1. Sur https://github.com/new : nom `portfolio`, visibilité *Public*, **ne cochez rien** (pas de README ni de .gitignore).
2. Puis dans le terminal :

```bash
cd portfolio-saad
git remote add origin https://github.com/ssabiridrissi-rgb/portfolio.git
git push -u origin main
```

## 2. Importer le projet dans Vercel

1. Connectez-vous sur https://vercel.com avec votre compte GitHub.
2. **Add New… → Project** → choisissez le dépôt `portfolio` → **Import**.
3. Le framework **Next.js** est détecté automatiquement. Ne modifiez ni la commande de build ni le dossier de sortie.
4. Dépliez **Environment Variables** et ajoutez (toutes sont optionnelles) :
   - `NEXT_PUBLIC_SITE_URL` = `https://saad-sabir-idrissi.vercel.app` (ou votre URL finale)
   - `RESEND_API_KEY` : créez une clé sur https://resend.com (gratuit). Sans clé, le formulaire ouvre la messagerie du visiteur.
   - `CONTACT_TO_EMAIL` = `saadsabiridrissi@gmail.com`
   - `GITHUB_TOKEN` : https://github.com/settings/tokens → *Fine-grained token*, aucune permission nécessaire.
5. Cliquez sur **Deploy**.

> ⚠️ Resend : avec l'expéditeur par défaut `onboarding@resend.dev`, Resend n'envoie qu'à l'adresse email du compte Resend. Créez donc votre compte Resend avec `saadsabiridrissi@gmail.com`, ou vérifiez un domaine et renseignez `CONTACT_FROM_EMAIL`.

## 3. Choisir l'URL

1. Projet Vercel → **Settings → Domains**.
2. Remplacez l'URL générée par `saad-sabir-idrissi.vercel.app`. Si ce nom est pris, choisissez le plus proche (ex. `saad-sabir-idrissi-portfolio.vercel.app`).
3. Mettez à jour `NEXT_PUBLIC_SITE_URL` avec l'URL finale, puis **Deployments → … → Redeploy**.

**Domaine personnalisé (optionnel)** : le GitHub Student Developer Pack (https://education.github.com/pack) propose souvent un domaine gratuit pendant un an. Ajoutez-le dans **Settings → Domains** et suivez les instructions DNS affichées.

## 4. Mises à jour automatiques

- Chaque `git push` sur `main` redéploie le site en production.
- Chaque autre branche ou pull request crée une **preview** avec sa propre URL.

```bash
# Exemple : modifier un projet puis publier
git add src/content/projects.ts
git commit -m "content: update ProcureTrace AI"
git push
```

## 5. Vérifications après le premier déploiement

- [ ] `/fr` et `/en` s'affichent, le changement de langue et de thème fonctionne
- [ ] Les deux CV se téléchargent
- [ ] Le formulaire de contact envoie un message (ou ouvre la messagerie sans Resend)
- [ ] L'aperçu du lien sur LinkedIn affiche l'image Open Graph. Pour la rafraîchir : https://www.linkedin.com/post-inspector/
- [ ] Search Console : https://search.google.com/search-console → ajoutez le site et soumettez `https://<votre-url>/sitemap.xml`
- [ ] Analytics : activez **Analytics** et **Speed Insights** dans l'onglet du projet Vercel
