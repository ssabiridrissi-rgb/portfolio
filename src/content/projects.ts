import type { Project, ProjectCategory } from "@/types/content";

const GH = "https://github.com/ssabiridrissi-rgb";

export const projectCategories: { id: ProjectCategory | "all"; label: { fr: string; en: string } }[] = [
  { id: "all", label: { fr: "Tous", en: "All" } },
  { id: "data-bi", label: { fr: "Data & BI", en: "Data & BI" } },
  { id: "ai", label: { fr: "IA", en: "AI" } },
  { id: "cloud-devops", label: { fr: "Cloud & DevOps", en: "Cloud & DevOps" } },
  { id: "web-backend", label: { fr: "Web & Backend", en: "Web & Backend" } },
  { id: "mobile", label: { fr: "Mobile", en: "Mobile" } },
];

/**
 * Featured projects are listed first, in display order.
 * Descriptions are based on the actual code of each repository (audited 09/2026).
 */
export const projects: Project[] = [
  {
    slug: "solarnav-ai",
    title: { fr: "SolarNav AI", en: "SolarNav AI" },
    subtitle: {
      fr: "Panneaux solaires orientés par une IA hybride physique + ExtraTrees",
      en: "Solar panels steered by a hybrid physics + ExtraTrees model",
    },
    categories: ["ai", "data-bi"],
    // TODO(saad): date du hackathon GoMyCode.
    status: "done",
    featured: true,
    context: {
      fr: "Hackathon GoMyCode — projet d'équipe. Mon rôle\u00a0: responsable de la partie data.",
      en: "GoMyCode hackathon — team project. My role: data lead.",
    },
    summary: {
      fr: "Un modèle hybride qui prédit l'angle optimal d'un panneau solaire spatial à partir de 5 mesures, entraîné sur 40\u202f000 exemples que j'ai construits\u00a0; un bras robotisé fait pivoter le panneau.",
      en: "A hybrid model that predicts the best angle for a space solar panel from 5 inputs, trained on 40,000 examples I built; a robotic arm turns the panel.",
    },
    highlights: [
      {
        fr: "40\u202f000 exemples\u00a0: 60\u00a0% d'orbites réelles (ISS, Hubble, NOAA-19), 40\u00a0% simulés",
        en: "40,000 examples: 60% real orbits (ISS, Hubble, NOAA-19), 40% simulated",
      },
      {
        fr: "Modèle hybride\u00a0: 99\u00a0% des prédictions à ±2°, contre 92\u00a0% pour un modèle 100\u00a0% IA",
        en: "Hybrid model: 99% of predictions within ±2°, versus 92% for a pure-AI model",
      },
      {
        fr: "Mon rôle\u00a0: responsable data — collecte, simulation et étiquetage du jeu d'entraînement",
        en: "My role: data lead — collecting, simulating and labelling the training set",
      },
    ],
    skills: ["python", "machine-learning", "data-analysis"],
    extraStack: ["Skyfield", "API N2YO", "ExtraTrees"],
    // TODO(saad): taille de l'équipe ; confirmer que l'étiquetage faisait partie de ta partie data.
    team: {
      role: {
        fr: "Responsable data\u00a0: récupération des orbites réelles (API N2YO, Skyfield), génération des scénarios simulés et étiquetage physique des 40\u202f000 exemples.",
        en: "Data lead: pulling real orbits (N2YO API, Skyfield), generating the simulated scenarios and labelling the 40,000 examples with physics.",
      },
    },
    // TODO(saad): lien du dépôt ou d'une démo vidéo du bras robotisé.
    links: {},
    diagram: "solarnav",
    demo: "solar-orbit",
    caseStudy: {
      context: {
        fr: "Projet réalisé en équipe lors d'un hackathon GoMyCode\u00a0: un panneau solaire monté sur un bras robotisé, orienté par un modèle d'IA. J'étais responsable de la partie data, c'est-à-dire du jeu de données sur lequel le modèle apprend.",
        en: "A team project built during a GoMyCode hackathon: a solar panel mounted on a robotic arm and steered by an AI model. I was the data lead, in charge of the dataset the model learns from.",
      },
      problem: {
        fr: "Un panneau produit le plus quand il fait face au soleil\u00a0: la règle de base est une inclinaison de 90° moins la hauteur du soleil. Dans l'espace, trois choses la compliquent\u00a0: la poussière (surtout sur une base lunaire), la chaleur (au-delà d'environ 100\u00a0°C, le rendement chute) et l'ombre de la Terre, où le panneau se replie à 0°.",
        en: "A panel produces the most when it faces the sun: the basic rule is a tilt of 90° minus the sun's elevation. In space, three things get in the way: dust (especially on a lunar base), heat (above roughly 100 °C, efficiency drops) and the Earth's shadow, where the panel folds back to 0°.",
      },
      approach: [
        {
          fr: "Cadrer le modèle\u00a0: 5 entrées (hauteur et direction du soleil, exposition soleil/ombre, niveau de poussière, température de surface) et une seule sortie, l'angle optimal.",
          en: "Frame the model: 5 inputs (sun elevation and direction, sunlit or in shadow, dust level, surface temperature) and a single output, the optimal angle.",
        },
        {
          fr: "Partie réelle (60\u00a0%)\u00a0: orbites de l'ISS, de Hubble et de NOAA-19 récupérées via l'API N2YO, puis positions calculées minute par minute sur plusieurs jours avec Skyfield — où est le soleil, et quand le satellite passe dans l'ombre.",
          en: "Real part (60%): orbits of the ISS, Hubble and NOAA-19 pulled from the N2YO API, then positions computed minute by minute over several days with Skyfield — where the sun is, and when the satellite enters the shadow.",
        },
        {
          fr: "Partie simulée (40\u00a0%)\u00a0: des scénarios aléatoires pour couvrir ce que ces trois satellites ne rencontrent jamais — orbite géostationnaire, sol lunaire, soleil au zénith, températures extrêmes. Poussière et température sont simulées pour chaque exemple.",
          en: "Simulated part (40%): random scenarios to cover what those three satellites never meet — geostationary orbit, lunar ground, sun at the zenith, extreme temperatures. Dust and temperature are simulated for every example.",
        },
        {
          fr: "Étiquetage par la physique\u00a0: pour chaque exemple, 361 inclinaisons testées (de 0° à 180°, par pas de 0,5°)\u00a0; on garde celle qui maximise l'énergie (cosinus de l'angle au soleil × pertes dues à la poussière × rendement thermique), puis on ajoute un bruit de ±0,5° pour imiter une vraie mesure.",
          en: "Labelling with physics: for each example, 361 tilts are tested (0° to 180° in 0.5° steps); the one that maximises energy wins (cosine of the angle to the sun × dust losses × thermal efficiency), then ±0.5° of noise is added to mimic a real measurement.",
        },
        {
          fr: "Modèle hybride\u00a0: la physique fournit le point de départ (90° − élévation) et un ExtraTrees de 100 arbres n'apprend que la correction due à la poussière et à la chaleur\u00a0; quand les arbres divergent, la marge d'incertitude grandit.",
          en: "Hybrid model: physics gives the starting point (90° − elevation) and a 100-tree ExtraTrees only learns the correction for dust and heat; when the trees disagree, the uncertainty margin grows.",
        },
      ],
      architecture: {
        fr: "Orbites réelles (API N2YO, Skyfield) et scénarios simulés → 40\u202f000 exemples étiquetés par la physique → modèle hybride (90° − élévation + correction ExtraTrees) → angle transmis au bras robotisé qui oriente le panneau.",
        en: "Real orbits (N2YO API, Skyfield) and simulated scenarios → 40,000 examples labelled by physics → hybrid model (90° − elevation + ExtraTrees correction) → angle sent to the robotic arm that turns the panel.",
      },
      results: [
        {
          fr: "Modèle hybride\u00a0: 99\u00a0% des prédictions à ±2°, contre 92\u00a0% pour un modèle qui apprend tout seul.",
          en: "Hybrid model: 99% of predictions within ±2°, versus 92% for a model that learns everything on its own.",
        },
        {
          fr: "Quatre algorithmes comparés (Random Forest, ExtraTrees, Gradient Boosting, Random Forest sur la correction)\u00a0: ExtraTrees, le plus précis et le plus rapide.",
          en: "Four algorithms compared (Random Forest, ExtraTrees, Gradient Boosting, Random Forest on the correction): ExtraTrees was the most accurate and the fastest.",
        },
        {
          // TODO(saad): ton document dit aussi « moitié réels, moitié simulés » — 60/40 retenu (détail chiffré).
          fr: "Jeu d'entraînement de 40\u202f000 exemples\u00a0: 60\u00a0% issus d'orbites réelles, 40\u00a0% simulés.",
          en: "A 40,000-example training set: 60% from real orbits, 40% simulated.",
        },
      ],
      learned: [
        {
          fr: "Quand le terrain réel est inaccessible, mélanger mesures réelles et simulation pour couvrir aussi les cas que le réel ne montre jamais.",
          en: "When the real field is out of reach, mix real measurements with simulation to also cover the cases reality never shows.",
        },
        {
          fr: "Laisser la physique gérer l'essentiel et concentrer l'IA sur les cas difficiles\u00a0: c'est ce qui fait passer de 92\u00a0% à 99\u00a0% de prédictions à ±2°.",
          en: "Let physics handle the bulk and focus the AI on the hard cases: that's what takes predictions within ±2° from 92% to 99%.",
        },
      ],
    },
  },
  {
    slug: "autoloc-ia",
    title: { fr: "AutoLoc — Location de voitures avec IA", en: "AutoLoc — AI-assisted car rental" },
    subtitle: {
      fr: "Application Flask avec l'assistant IA « Alex » (Groq · Llama 3.3 70B)",
      en: "Flask app with an AI assistant, “Alex” (Groq · Llama 3.3 70B)",
    },
    categories: ["ai", "web-backend"],
    date: "2026-06",
    status: "done",
    featured: true,
    context: {
      fr: "Projet d'équipe (5 personnes) — module Maintenance logicielle, Université Mundiapolis, 2025/2026.",
      en: "Team project (5 people) — Software Maintenance course, Mundiapolis University, 2025/2026.",
    },
    summary: {
      fr: "Application de gestion d'agence de location : catalogue, réservation en ligne, administration CRUD, et un assistant IA qui recommande le véhicule le plus adapté après 5 questions.",
      en: "A web app for a car-rental agency: catalogue, online booking, CRUD admin panel, and an AI assistant that recommends the best-fitting car after asking 5 questions.",
    },
    highlights: [
      {
        fr: "Assistant « Alex » : 5 questions (budget, passagers, trajet, boîte, carburant) → 1 recommandation du catalogue",
        en: "“Alex” asks 5 questions (budget, passengers, trip, gearbox, fuel) → recommends 1 car from the catalogue",
      },
      {
        fr: "Pattern Strategy : fournisseur LLM interchangeable",
        en: "Strategy pattern: swappable LLM provider",
      },
      {
        fr: "Mon rôle : Workflow & Release Manager (branches, PR, hotfix, release v1.0)",
        en: "My role: Workflow & Release Manager (branches, PRs, hotfix, v1.0 release)",
      },
    ],
    skills: ["flask", "python", "llm", "html-css-js", "git", "sonarcloud"],
    extraStack: ["Groq API", "Jinja2"],
    team: {
      size: 5,
      role: {
        fr: "Workflow & Release Manager : organisation du Git flow, revue et fusion des pull requests, hotfix et publication de la release v1.0.",
        en: "Workflow & Release Manager: set up the Git flow, reviewed and merged pull requests, shipped the hotfix and the v1.0 release.",
      },
    },
    links: { github: `${GH}/gestion-location-voitures` },
    diagram: "autoloc",
    caseStudy: {
      context: {
        fr: "Projet réalisé à cinq dans le cadre du module Maintenance logicielle (Université Mundiapolis, 2025/2026). L'objectif était autant le produit que la manière de le livrer : travail en branches, revues de code et publication versionnée.",
        en: "A five-person project for the Software Maintenance course (Mundiapolis University, 2025/2026). The goal was the product and also how we shipped it: branch-based work, code reviews and a versioned release.",
      },
      problem: {
        fr: "Une agence de location doit gérer son catalogue et ses réservations, et aider les clients indécis à choisir un véhicule adapté à leur budget et à leur trajet.",
        en: "A rental agency needs to manage its catalogue and bookings, and to help undecided customers find a car that fits their budget and their trip.",
      },
      approach: [
        {
          fr: "Application Flask (templates Jinja2, HTML/CSS/JS natif) : catalogue avec fiches véhicules (marque, modèle, type, places, prix/jour, boîte, carburant), formulaire de réservation avec contrôle des dates et calcul du total.",
          en: "A Flask app (Jinja2 templates, plain HTML/CSS/JS): catalogue with car cards (brand, model, type, seats, daily price, gearbox, fuel) and a booking form that checks dates and works out the total.",
        },
        {
          fr: "Espace d'administration CRUD pour ajouter, modifier et supprimer les véhicules, avec les réservations regroupées par voiture et des compteurs sur l'accueil.",
          en: "A CRUD admin area to add, edit and delete cars, with bookings grouped by car and counters on the home page.",
        },
        {
          fr: "Assistant « Alex » : le catalogue est injecté dans le prompt système, le modèle llama-3.3-70b-versatile (via Groq) pose 5 questions une à une puis recommande un seul véhicule.",
          en: "The “Alex” assistant: the catalogue is injected into the system prompt, and llama-3.3-70b-versatile (via Groq) asks 5 questions one at a time, then recommends a single car.",
        },
        {
          fr: "Pattern Strategy (ChatbotStrategy → GroqChatbotStrategy, orchestré par ChatbotContext) pour pouvoir changer de fournisseur LLM sans toucher aux routes.",
          en: "Strategy pattern (ChatbotStrategy → GroqChatbotStrategy, run by ChatbotContext), so the LLM provider can change without touching the routes.",
        },
        {
          fr: "Ma responsabilité : le workflow Git de l'équipe — branches main/develop/feature/hotfix/docs, revue et fusion des pull requests, correctif à chaud et tag de release v1.0.",
          en: "My part: the team's Git workflow — main/develop/feature/hotfix/docs branches, reviewing and merging pull requests, a hotfix and the v1.0 release tag.",
        },
      ],
      architecture: {
        fr: "Le navigateur appelle les routes Flask. La route /chat construit le prompt système à partir du catalogue et délègue l'appel au fournisseur LLM via le pattern Strategy.",
        en: "The browser calls the Flask routes. The /chat route builds the system prompt from the catalogue and hands the call to the LLM provider through the Strategy pattern.",
      },
      results: [
        { fr: "Application livrée et taguée en v1.0.", en: "App shipped and tagged v1.0." },
        {
          fr: "Catalogue initial de 17 véhicules et parcours de réservation complet.",
          en: "An initial catalogue of 17 cars and a complete booking flow.",
        },
        {
          fr: "Stratégie de branches et règles de contribution documentées (CONTRIBUTING.md), analyse SonarCloud présentée dans le README.",
          en: "Branching strategy and contribution rules documented (CONTRIBUTING.md), SonarCloud analysis reported in the README.",
        },
      ],
      learned: [
        {
          fr: "Coordonner un Git flow à cinq : conventions de branches, revues, gestion des conflits et publication.",
          en: "Running a Git flow with five people: branch conventions, reviews, conflict handling and releases.",
        },
        {
          fr: "Contraindre un LLM avec des données métier dans le prompt pour obtenir une recommandation exploitable.",
          en: "Grounding an LLM with business data in the prompt to get a usable recommendation.",
        },
        {
          fr: "Isoler une dépendance externe derrière une interface pour garder le code évolutif.",
          en: "Hiding an external dependency behind an interface to keep the code easy to change.",
        },
        {
          fr: "Prochaine étape identifiée : persister les données dans une vraie base (aujourd'hui en mémoire).",
          en: "Next step identified: persist data in a real database (it currently lives in memory).",
        },
      ],
    },
  },
  {
    slug: "procuretrace-ai",
    title: { fr: "ProcureTrace AI", en: "ProcureTrace AI" },
    subtitle: {
      fr: "Aide à la décision achats, explicable et auditable",
      en: "Explainable, auditable decision support for procurement",
    },
    categories: ["ai"],
    date: "2026-09",
    status: "done",
    featured: true,
    context: { fr: "Projet d'aide à la décision achats — 2026.", en: "Procurement decision-support project — 2026." },
    summary: {
      fr: "Moteur de recommandation multicritère et explicable pour le choix des fournisseurs (coût total, délai, capacité), avec validation humaine, versioning et audit des décisions.",
      en: "An explainable multi-criteria recommendation engine for choosing suppliers (total cost, lead time, capacity), with human validation, versioning and a decision audit trail.",
    },
    highlights: [
      {
        fr: "Recommandation multicritère : coût total, délai, capacité fournisseur",
        en: "Multi-criteria recommendation: total cost, lead time, supplier capacity",
      },
      {
        fr: "Human-in-the-loop : l'acheteur valide ou rejette",
        en: "Human-in-the-loop: the buyer approves or rejects",
      },
      { fr: "Versioning et audit de chaque décision", en: "Every decision is versioned and auditable" },
    ],
    // TODO(saad): renseigner la stack technique réelle de ProcureTrace AI.
    skills: [],
    extraStack: ["Aide multicritère", "IA explicable", "Human-in-the-loop"],
    // TODO(saad): ajouter le lien GitHub quand le dépôt sera public.
    links: {},
    diagram: "procuretrace",
    caseStudy: {
      context: {
        fr: "Projet d'IA appliquée à l'aide à la décision achats, terminé en 2026.",
        en: "An applied-AI project for procurement decision support, completed in 2026.",
      },
      problem: {
        fr: "Choisir un fournisseur implique des arbitrages entre coût total, délai et capacité. Une recommandation automatique n'est utile que si l'acheteur peut la comprendre, la contester et en retrouver l'historique.",
        en: "Choosing a supplier means trading off total cost, lead time and capacity. An automatic recommendation is only useful if the buyer can understand it, challenge it and trace its history.",
      },
      approach: [
        {
          fr: "Évaluation multicritère des fournisseurs sur le coût total, le délai et la capacité.",
          en: "Multi-criteria scoring of suppliers on total cost, lead time and capacity.",
        },
        {
          fr: "Recommandation explicable : rendre visible ce qui justifie le classement proposé.",
          en: "Explainable output: show what justifies the proposed ranking.",
        },
        {
          fr: "Validation humaine (human-in-the-loop) avant toute décision.",
          en: "Human validation (human-in-the-loop) before any decision is final.",
        },
        {
          fr: "Versioning et journal d'audit des décisions.",
          en: "Versioning and an audit log of decisions.",
        },
      ],
      architecture: {
        fr: "Flux : données fournisseurs → moteur multicritère → recommandation expliquée → validation humaine → décision versionnée et auditée.",
        en: "Flow: supplier data → multi-criteria engine → explained recommendation → human validation → versioned, audited decision.",
      },
      // TODO(saad): préciser les livrables et résultats concrets (démo, stack, tests…).
      results: [
        {
          fr: "Moteur de recommandation multicritère et explicable (coût total, délai, capacité fournisseur).",
          en: "An explainable multi-criteria recommendation engine (total cost, lead time, supplier capacity).",
        },
        {
          fr: "Validation humaine (human-in-the-loop), versioning et audit des décisions intégrés.",
          en: "Human validation (human-in-the-loop), versioning and decision auditing built in.",
        },
      ],
      learned: [],
    },
  },
  {
    slug: "supervision-aws-zabbix",
    title: { fr: "Supervision cloud centralisée sur AWS", en: "Centralised cloud monitoring on AWS" },
    subtitle: {
      fr: "Zabbix conteneurisé (Docker Compose) pour un parc hybride Linux & Windows",
      en: "Containerised Zabbix (Docker Compose) for a hybrid Linux & Windows fleet",
    },
    categories: ["cloud-devops"],
    date: "2026-01",
    status: "done",
    featured: true,
    context: {
      fr: "Projet individuel — module Ingénierie des infrastructures cloud, Université Mundiapolis, 2025/2026.",
      en: "Solo project — Cloud Infrastructure Engineering course, Mundiapolis University, 2025/2026.",
    },
    summary: {
      fr: "Déploiement sur AWS d'une supervision centralisée : VPC dédié, 3 instances EC2, Zabbix 6.4 conteneurisé avec Docker Compose et agents sur un client Linux et un client Windows.",
      en: "A centralised monitoring setup on AWS: a dedicated VPC, 3 EC2 instances, Zabbix 6.4 in containers with Docker Compose, and agents on a Linux client and a Windows client.",
    },
    highlights: [
      {
        fr: "VPC 10.0.0.0/16, sous-réseau public, Internet Gateway, security groups par rôle",
        en: "VPC 10.0.0.0/16, public subnet, Internet Gateway, role-based security groups",
      },
      {
        fr: "Zabbix 6.4 + MySQL 8 en conteneurs (Docker Compose)",
        en: "Zabbix 6.4 + MySQL 8 in containers (Docker Compose)",
      },
      {
        fr: "3 hôtes supervisés : serveur, client Linux, client Windows",
        en: "3 monitored hosts: server, Linux client, Windows client",
      },
    ],
    skills: ["aws", "docker", "docker-compose", "linux", "zabbix"],
    extraStack: ["MySQL 8", "Ubuntu 22.04", "Windows Server 2022"],
    links: {
      github: `${GH}/Mise-en-uvre-d-une-infrastructure-cloud-de-supervision-centralis-e-sous-AWS-`,
    },
    diagram: "aws-zabbix",
    caseStudy: {
      context: {
        fr: "Projet de fin de module réalisé seul (Ingénierie des infrastructures cloud, Université Mundiapolis, 2025/2026). Le dépôt contient le rapport technique complet et les captures de chaque étape.",
        en: "End-of-course project done solo (Cloud Infrastructure Engineering, Mundiapolis University, 2025/2026). The repository holds the full technical report and screenshots of every step.",
      },
      problem: {
        fr: "Superviser depuis un point unique un parc hybride Linux et Windows (disponibilité, CPU, mémoire) dans un environnement cloud cloisonné.",
        en: "Monitor a hybrid Linux and Windows fleet (availability, CPU, memory) from a single place, inside an isolated cloud network.",
      },
      approach: [
        {
          fr: "Réseau : VPC 10.0.0.0/16, sous-réseau public 10.0.1.0/24 (us-east-1a), Internet Gateway et table de routage 0.0.0.0/0 → IGW.",
          en: "Network: VPC 10.0.0.0/16, public subnet 10.0.1.0/24 (us-east-1a), Internet Gateway and a 0.0.0.0/0 → IGW route table.",
        },
        {
          fr: "Sécurité : deux security groups — serveur (SSH restreint à mon IP, HTTP/HTTPS, 10051) et clients (agent 10050, SSH, RDP).",
          en: "Security: two security groups — server (SSH limited to my IP, HTTP/HTTPS, 10051) and clients (agent 10050, SSH, RDP).",
        },
        {
          fr: "Calcul : 3 instances EC2 — serveur Zabbix (Ubuntu 22.04), client Linux (Ubuntu) et client Windows Server 2022.",
          en: "Compute: 3 EC2 instances — Zabbix server (Ubuntu 22.04), Linux client (Ubuntu) and Windows Server 2022 client.",
        },
        {
          fr: "Supervision : Zabbix 6.4 lancé avec Docker Compose (conteneurs zabbix-db, zabbix-server, zabbix-web), agents configurés (Server, ServerActive, Hostname) et templates OS Linux/Windows.",
          en: "Monitoring: Zabbix 6.4 started with Docker Compose (zabbix-db, zabbix-server and zabbix-web containers), agents configured (Server, ServerActive, Hostname) with the Linux/Windows OS templates.",
        },
      ],
      architecture: {
        fr: "Le serveur Zabbix conteneurisé interroge les agents des deux clients sur le port 10050 ; l'administrateur accède à l'interface web par le navigateur ou via un tunnel SSH.",
        en: "The containerised Zabbix server polls the agents on both clients over port 10050; the admin reaches the web UI in the browser or through an SSH tunnel.",
      },
      results: [
        {
          fr: "3 hôtes remontés et disponibles dans Zabbix : serveur, client Linux, client Windows.",
          en: "3 hosts reporting and available in Zabbix: server, Linux client, Windows client.",
        },
        {
          fr: "Incident résolu : boucle de redémarrage du serveur causée par l'incompatibilité Zabbix 6.4 / MySQL 5.7, corrigée en passant à MySQL 8.",
          en: "Incident fixed: the server was stuck in a restart loop because Zabbix 6.4 doesn't support MySQL 5.7; moving to MySQL 8 solved it.",
        },
        {
          fr: "Rapport technique complet (PDF/DOCX) avec captures de chaque étape.",
          en: "Full technical report (PDF/DOCX) with screenshots of every step.",
        },
      ],
      learned: [
        {
          fr: "Concevoir un réseau AWS minimal mais cloisonné : règles d'entrée par port et par IP source.",
          en: "Designing a small but locked-down AWS network: inbound rules by port and source IP.",
        },
        {
          fr: "Diagnostiquer une incompatibilité de versions entre conteneurs d'une même stack.",
          en: "Tracking down a version mismatch between containers in the same stack.",
        },
        {
          fr: "Superviser des systèmes hétérogènes (Linux et Windows) avec un même outil.",
          en: "Monitoring different systems (Linux and Windows) with a single tool.",
        },
      ],
    },
  },
  {
    slug: "chaine-bi-centre-medical",
    title: { fr: "Chaîne décisionnelle BI — Centre médical", en: "End-to-end BI pipeline — Medical centre" },
    subtitle: {
      fr: "PostgreSQL en étoile · ETL Pentaho · Power BI (10 KPI)",
      en: "Star schema in PostgreSQL · Pentaho ETL · Power BI (10 KPIs)",
    },
    categories: ["data-bi"],
    date: "2026-05",
    status: "done",
    featured: true,
    context: {
      fr: "Projet de Business Intelligence — cas d'un centre médical privé.",
      en: "Business Intelligence project — the case of a private medical centre.",
    },
    summary: {
      fr: "Chaîne décisionnelle complète : data warehouse en étoile sous PostgreSQL alimenté par un ETL Pentaho, et dashboard Power BI de 3 pages avec 10 KPI.",
      en: "A complete BI pipeline: a star-schema data warehouse in PostgreSQL fed by a Pentaho ETL, and a 3-page Power BI dashboard with 10 KPIs.",
    },
    highlights: [
      { fr: "Data warehouse en étoile sous PostgreSQL", en: "Star-schema data warehouse in PostgreSQL" },
      { fr: "Alimentation par ETL Pentaho", en: "Loaded with a Pentaho ETL" },
      {
        fr: "Power BI : 3 pages, 10 KPI (CA, annulations, retards, paiements)",
        en: "Power BI: 3 pages, 10 KPIs (revenue, cancellations, delays, payments)",
      },
    ],
    skills: ["postgresql", "sql", "data-warehouse", "etl-pentaho", "power-bi"],
    // TODO(saad): publier le dépôt (script SQL du schéma, transformations Pentaho, captures Power BI).
    links: {},
    diagram: "bi-medical",
    caseStudy: {
      context: {
        fr: "Projet de Business Intelligence mené de la modélisation jusqu'à la restitution, sur le cas d'un centre médical privé.",
        en: "A Business Intelligence project taken from modelling all the way to reporting, based on a private medical centre.",
      },
      problem: {
        fr: "La direction a besoin de piloter l'activité : chiffre d'affaires, annulations, retards et paiements, à partir des données opérationnelles du centre.",
        en: "Management needs to steer the business (revenue, cancellations, delays, payments) using the centre's operational data.",
      },
      approach: [
        {
          fr: "Modélisation d'un data warehouse en schéma en étoile sous PostgreSQL.",
          en: "Designed a star-schema data warehouse in PostgreSQL.",
        },
        {
          fr: "Alimentation du data warehouse par des traitements ETL sous Pentaho (extraction, transformation, chargement).",
          en: "Loaded the warehouse with Pentaho ETL jobs (extract, transform, load).",
        },
        {
          fr: "Conception d'un dashboard Power BI de 3 pages réunissant 10 KPI.",
          en: "Designed a 3-page Power BI dashboard bringing together 10 KPIs.",
        },
      ],
      architecture: {
        fr: "Données opérationnelles → ETL Pentaho → data warehouse en étoile (PostgreSQL) → dashboard Power BI.",
        en: "Operational data → Pentaho ETL → star-schema data warehouse (PostgreSQL) → Power BI dashboard.",
      },
      results: [
        { fr: "Data warehouse en étoile alimenté par ETL.", en: "Star-schema data warehouse loaded by ETL." },
        {
          fr: "Dashboard Power BI : 3 pages, 10 KPI — chiffre d'affaires, annulations, retards, paiements.",
          en: "Power BI dashboard: 3 pages, 10 KPIs — revenue, cancellations, delays, payments.",
        },
      ],
      learned: [
        {
          fr: "Définir le grain d'une table de faits et les dimensions qui répondent aux questions métier.",
          en: "Choosing a fact table's grain and the dimensions that answer the business questions.",
        },
        {
          fr: "Automatiser le chargement d'un entrepôt avec un outil ETL plutôt qu'à la main.",
          en: "Loading a warehouse with an ETL tool instead of by hand.",
        },
        {
          fr: "Structurer un dashboard autour de KPI lisibles par une direction.",
          en: "Building a dashboard around KPIs that managers can read at a glance.",
        },
      ],
    },
  },
  {
    slug: "dw-power-bi-hotellerie",
    title: { fr: "Data Warehouse & Power BI — Hôtellerie", en: "Data Warehouse & Power BI — Hospitality" },
    subtitle: {
      fr: "Schéma en étoile PostgreSQL · mesures DAX · KPI de réservation",
      en: "PostgreSQL star schema · DAX measures · booking KPIs",
    },
    categories: ["data-bi"],
    date: "2026-03",
    status: "done",
    featured: true,
    context: {
      fr: "Projet de Business Intelligence — secteur hôtelier.",
      en: "Business Intelligence project — hospitality sector.",
    },
    summary: {
      fr: "Data warehouse en étoile sous PostgreSQL intégrant les réservations (clients, hôtels, chambres, canaux, temps) et dashboard Power BI interactif avec mesures DAX.",
      en: "A star-schema data warehouse in PostgreSQL holding booking data (customers, hotels, rooms, channels, time), with an interactive Power BI dashboard built on DAX measures.",
    },
    highlights: [
      {
        fr: "5 dimensions : clients, hôtels, chambres, canaux, temps",
        en: "5 dimensions: customers, hotels, rooms, channels, time",
      },
      { fr: "Mesures DAX et KPI : CA, réservations, revenu moyen par nuit", en: "DAX measures and KPIs: revenue, bookings, average revenue per night" },
      { fr: "Analyse de la performance par hôtel et par canal", en: "Performance analysis by hotel and by channel" },
    ],
    skills: ["postgresql", "sql", "data-warehouse", "power-bi", "dax"],
    // TODO(saad): publier le dépôt (DDL du schéma en étoile + captures du dashboard).
    links: {},
    diagram: "dw-hotel",
    caseStudy: {
      context: {
        fr: "Projet de Business Intelligence appliqué au secteur hôtelier.",
        en: "A Business Intelligence project for the hospitality sector.",
      },
      problem: {
        fr: "Analyser la performance des hôtels et des canaux de réservation : quels hôtels et quels canaux génèrent le chiffre d'affaires, et à quel revenu moyen par nuit ?",
        en: "Analyse how hotels and booking channels perform: which hotels and channels bring in revenue, and at what average revenue per night?",
      },
      approach: [
        {
          fr: "Modélisation d'un data warehouse en schéma en étoile sous PostgreSQL (SQL).",
          en: "Designed a star-schema data warehouse in PostgreSQL (SQL).",
        },
        {
          fr: "Intégration des données de réservation autour de 5 dimensions : clients, hôtels, chambres, canaux et temps.",
          en: "Loaded the booking data around 5 dimensions: customers, hotels, rooms, channels and time.",
        },
        {
          fr: "Dashboard Power BI interactif avec mesures DAX : chiffre d'affaires, nombre de réservations, revenu moyen par nuit.",
          en: "Interactive Power BI dashboard with DAX measures: revenue, number of bookings, average revenue per night.",
        },
      ],
      architecture: {
        fr: "Une table de faits des réservations au centre, reliée aux dimensions clients, hôtels, chambres, canaux et temps, exploitée par Power BI.",
        en: "A bookings fact table in the middle, linked to the customer, hotel, room, channel and time dimensions, and queried by Power BI.",
      },
      results: [
        { fr: "Data warehouse en étoile à 5 dimensions.", en: "A star-schema warehouse with 5 dimensions." },
        {
          fr: "Dashboard interactif : CA, réservations et revenu moyen par nuit, par hôtel et par canal.",
          en: "Interactive dashboard: revenue, bookings and average revenue per night, by hotel and by channel.",
        },
      ],
      learned: [
        {
          fr: "Traduire des questions métier en modèle dimensionnel.",
          en: "Turning business questions into a dimensional model.",
        },
        {
          fr: "Écrire des mesures DAX réutilisables plutôt que des colonnes calculées.",
          en: "Writing reusable DAX measures rather than calculated columns.",
        },
      ],
    },
  },

  // ——— Autres projets ———
  {
    slug: "smarthousing-clustering",
    title: { fr: "SmartHousing Clustering", en: "SmartHousing Clustering" },
    subtitle: { fr: "Segmentation d'appartements par K-means", en: "Apartment segmentation with K-means" },
    categories: ["ai", "data-bi"],
    date: "2025-12",
    status: "done",
    featured: false,
    context: { fr: "Projet d'analyse de données immobilières.", en: "Real-estate data analysis project." },
    summary: {
      fr: "Segmentation d'appartements par K-means en Python selon la surface et le prix, en trois segments : économique, moyen et haut standing.",
      en: "Clustered apartments with K-means in Python by floor area and price into three segments: budget, mid-range and high-end.",
    },
    highlights: [],
    skills: ["python", "kmeans", "machine-learning", "data-analysis"],
    // TODO(saad): publier le notebook sur GitHub.
    links: {},
  },
  {
    slug: "digital-banking",
    title: { fr: "Digital Banking — Spring Boot & Angular", en: "Digital Banking — Spring Boot & Angular" },
    subtitle: { fr: "Application bancaire full-stack", en: "Full-stack banking app" },
    categories: ["web-backend"],
    date: "2025-12",
    status: "done",
    featured: false,
    context: { fr: "Examen final du module Java.", en: "Final exam of the Java course." },
    summary: {
      fr: "API REST Spring Boot (clients, comptes courants/épargne, débit, crédit, virement, historique paginé) et frontend Angular pour rechercher des clients et opérer sur les comptes.",
      en: "A Spring Boot REST API (customers, current/savings accounts, debit, credit, transfer, paginated history) with an Angular front end to search customers and run account operations.",
    },
    highlights: [],
    skills: ["java", "spring-boot", "angular"],
    extraStack: ["Spring Data JPA", "H2", "Bootstrap"],
    links: { github: `${GH}/exam-final-java` },
  },
  {
    slug: "foodie-app-flutter",
    title: { fr: "Foodie App — Flutter", en: "Foodie App — Flutter" },
    subtitle: { fr: "Application mobile MVVM (Provider)", en: "MVVM mobile app (Provider)" },
    categories: ["mobile"],
    date: "2026-01",
    status: "done",
    featured: false,
    context: { fr: "Projet de module — développement mobile.", en: "Course project — mobile development." },
    summary: {
      fr: "Application Flutter qui combine une page CV et un explorateur de recettes basé sur l'API TheMealDB (recherche, catégories, galerie), organisée par fonctionnalités en MVVM avec Provider.",
      en: "A Flutter app that combines a CV page with a recipe browser built on the TheMealDB API (search, categories, gallery), organised by feature with MVVM and Provider.",
    },
    highlights: [],
    skills: ["flutter"],
    extraStack: ["Provider", "REST API"],
    links: { github: `${GH}/application_mobile` },
  },
  {
    slug: "products-angular-spring",
    title: { fr: "Gestion de produits — Angular & Spring", en: "Product manager — Angular & Spring" },
    subtitle: { fr: "Mini full-stack Angular + API REST", en: "Small full-stack app, Angular + REST API" },
    categories: ["web-backend"],
    date: "2025-12",
    status: "done",
    featured: false,
    context: { fr: "TP — module développement web.", en: "Lab — web development course." },
    summary: {
      fr: "Frontend Angular (composants standalone, Bootstrap) qui liste et supprime des produits via une API REST Spring Boot persistée en H2 avec Spring Data JPA.",
      en: "An Angular front end (standalone components, Bootstrap) that lists and deletes products through a Spring Boot REST API backed by H2 via Spring Data JPA.",
    },
    highlights: [],
    skills: ["angular", "java", "spring-boot"],
    extraStack: ["Spring Data JPA", "H2"],
    links: { github: `${GH}/angular-app` },
  },
  {
    slug: "fondamentaux-java-spring",
    title: { fr: "Fondamentaux Java & Spring", en: "Java & Spring fundamentals" },
    subtitle: { fr: "4 travaux pratiques", en: "4 lab exercises" },
    categories: ["web-backend"],
    date: "2025-11",
    status: "done",
    featured: false,
    context: { fr: "Travaux pratiques — Université Mundiapolis.", en: "Lab exercises — Mundiapolis University." },
    summary: {
      fr: "De l'injection de dépendances « à la main » jusqu'à une application Spring MVC sécurisée : les bases que j'utilise dans mes projets backend.",
      en: "From hand-written dependency injection to a secured Spring MVC app: the foundations I build on in my backend projects.",
    },
    highlights: [],
    skills: ["java", "spring-boot"],
    extraStack: ["Spring Security", "Thymeleaf", "Spring Data JPA"],
    links: {},
    repos: [
      {
        name: "TP_SPRING_MVC_Thymleaf1-master",
        href: `${GH}/TP_SPRING_MVC_Thymleaf1-master`,
        summary: {
          fr: "Spring MVC + Thymeleaf sécurisé par Spring Security (rôles USER/ADMIN, validation).",
          en: "Spring MVC + Thymeleaf secured with Spring Security (USER/ADMIN roles, validation).",
        },
      },
      {
        name: "hospital",
        href: `${GH}/hospital`,
        summary: {
          fr: "Modélisation JPA d'un domaine hospitalier (patients, médecins, rendez-vous, consultations).",
          en: "JPA model of a hospital domain (patients, doctors, appointments, consultations).",
        },
      },
      {
        name: "product-spring",
        href: `${GH}/product-spring`,
        summary: {
          fr: "Introduction à Spring Data JPA : entité, repository et service REST.",
          en: "Intro to Spring Data JPA: entity, repository and REST service.",
        },
      },
      {
        name: "ioc-dep",
        href: `${GH}/ioc-dep`,
        summary: {
          fr: "Inversion de contrôle en Java : injection statique puis dynamique par réflexion.",
          en: "Inversion of control in Java: static wiring, then dynamic wiring through reflection.",
        },
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const caseStudyProjects = projects.filter((p) => p.caseStudy);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
