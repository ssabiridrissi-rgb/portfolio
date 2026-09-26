import type { DiagramId, Localized } from "@/types/content";

type Text = string | Localized;
export type Tone = "accent" | "cyan" | "violet" | "neutral";

export type FlowNode = { id: string; label: Text; sub?: Text; tone?: Tone };
export type FlowDiagram = {
  kind: "flow";
  columns: FlowNode[][];
  edges: { from: string; to: string; label?: Text }[];
  groups?: { label: Text; nodes: string[]; tone?: Tone }[];
};
export type StarDiagram = {
  kind: "star";
  fact: FlowNode;
  dimensions: FlowNode[];
  consumer?: FlowNode;
};
export type Diagram = FlowDiagram | StarDiagram;

/** Architecture diagrams — every label reflects the real project (see content/projects.ts). */
export const diagrams: Record<DiagramId, Diagram> = {
  autoloc: {
    kind: "flow",
    columns: [
      [{ id: "browser", label: { fr: "Navigateur", en: "Browser" }, sub: "HTML · CSS · JS", tone: "neutral" }],
      [{ id: "flask", label: "Flask", sub: { fr: "routes CRUD · /chat", en: "CRUD routes · /chat" }, tone: "accent" }],
      [
        { id: "strategy", label: "ChatbotContext", sub: { fr: "pattern Strategy", en: "Strategy pattern" }, tone: "violet" },
        { id: "data", label: { fr: "Catalogue", en: "Catalogue" }, sub: { fr: "voitures · réservations", en: "cars · bookings" }, tone: "neutral" },
      ],
      [{ id: "groq", label: "Groq API", sub: "llama-3.3-70b", tone: "cyan" }],
    ],
    edges: [
      { from: "browser", to: "flask" },
      { from: "flask", to: "strategy" },
      { from: "flask", to: "data" },
      { from: "strategy", to: "groq" },
    ],
  },
  "aws-zabbix": {
    kind: "flow",
    columns: [
      [{ id: "admin", label: "Admin", sub: { fr: "web · tunnel SSH", en: "web · SSH tunnel" }, tone: "neutral" }],
      [{ id: "igw", label: "Internet GW", sub: "route 0.0.0.0/0", tone: "neutral" }],
      [
        { id: "web", label: "zabbix-web", sub: ":80 / :443", tone: "accent" },
        { id: "server", label: "zabbix-server", sub: "Zabbix 6.4 · :10051", tone: "accent" },
        { id: "db", label: "zabbix-db", sub: "MySQL 8", tone: "accent" },
      ],
      [
        { id: "linux", label: { fr: "Client Linux", en: "Linux client" }, sub: "agent :10050", tone: "cyan" },
        { id: "windows", label: { fr: "Client Windows", en: "Windows client" }, sub: "agent :10050", tone: "cyan" },
      ],
    ],
    edges: [
      { from: "admin", to: "igw" },
      { from: "igw", to: "web" },
      { from: "web", to: "server" },
      { from: "server", to: "db" },
      { from: "server", to: "linux" },
      { from: "server", to: "windows" },
    ],
    groups: [
      { label: "EC2 · Docker Compose", nodes: ["web", "server", "db"], tone: "accent" },
      { label: "VPC 10.0.0.0/16 · subnet 10.0.1.0/24", nodes: ["web", "server", "db", "linux", "windows"], tone: "violet" },
    ],
  },
  "bi-medical": {
    kind: "flow",
    columns: [
      [{ id: "src", label: { fr: "Données", en: "Source data" }, sub: { fr: "activité du centre", en: "centre operations" }, tone: "neutral" }],
      [{ id: "etl", label: "ETL Pentaho", sub: "extract · transform · load", tone: "violet" }],
      [{ id: "dw", label: "PostgreSQL", sub: { fr: "DW en étoile", en: "star-schema DW" }, tone: "accent" }],
      [{ id: "bi", label: "Power BI", sub: { fr: "3 pages · 10 KPI", en: "3 pages · 10 KPIs" }, tone: "cyan" }],
    ],
    edges: [
      { from: "src", to: "etl" },
      { from: "etl", to: "dw" },
      { from: "dw", to: "bi" },
    ],
  },
  "dw-hotel": {
    kind: "star",
    fact: { id: "fact", label: { fr: "Faits réservations", en: "Bookings fact" }, sub: { fr: "CA · nuits · réservations", en: "revenue · nights · bookings" }, tone: "accent" },
    dimensions: [
      { id: "clients", label: { fr: "Clients", en: "Customers" }, sub: "dim", tone: "neutral" },
      { id: "hotels", label: { fr: "Hôtels", en: "Hotels" }, sub: "dim", tone: "neutral" },
      { id: "rooms", label: { fr: "Chambres", en: "Rooms" }, sub: "dim", tone: "neutral" },
      { id: "channels", label: { fr: "Canaux", en: "Channels" }, sub: "dim", tone: "neutral" },
      { id: "time", label: { fr: "Temps", en: "Time" }, sub: "dim", tone: "neutral" },
    ],
    consumer: { id: "pbi", label: "Power BI", sub: { fr: "mesures DAX", en: "DAX measures" }, tone: "cyan" },
  },
  procuretrace: {
    kind: "flow",
    columns: [
      [{ id: "suppliers", label: { fr: "Fournisseurs", en: "Suppliers" }, sub: { fr: "coût · délai · capacité", en: "cost · lead time · capacity" }, tone: "neutral" }],
      [{ id: "engine", label: { fr: "Moteur multicritère", en: "Multi-criteria engine" }, sub: { fr: "score explicable", en: "explainable score" }, tone: "violet" }],
      [{ id: "human", label: { fr: "Validation humaine", en: "Human review" }, sub: "human-in-the-loop", tone: "accent" }],
      [{ id: "audit", label: { fr: "Décision", en: "Decision" }, sub: { fr: "versionnée · auditée", en: "versioned · audited" }, tone: "cyan" }],
    ],
    edges: [
      { from: "suppliers", to: "engine" },
      { from: "engine", to: "human" },
      { from: "human", to: "audit" },
    ],
  },
};
