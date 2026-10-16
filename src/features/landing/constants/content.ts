export const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Confidentialité", href: "#privacy" },
  { label: "Installation", href: "#install" },
] as const;

export const HEADER_ACTIONS = {
  login: "Connexion",
  register: "Créer un compte",
} as const;

export const HERO = {
  titleFirst: "Mesurez",
  titleSecond: "Analysez",
  titleLine2: "et progressez avec",
  tag: "Analytics",
  subtitle:
    "Pays, pages, durées, appareils : suivez votre trafic web dans un tableau de bord clair, sans cookie.",
  emailPlaceholder: "nom@entreprise.com",
  emailLabel: "Adresse e-mail",
  cta: "Commencer",
} as const;

export const STATS_SECTION = {
  title: "Tout votre trafic, lisible en un instant",
  text: "Visiteurs, pages vues, sources, pays et appareils réunis sur un seul écran. Chaque graphique répond à une question simple, avec la comparaison à la période précédente.",
  cards: [
    { value: "0", label: "Cookie déposé chez vos visiteurs", tone: "blue", shape: "leaf" },
    { value: "< 2 Ko", label: "Script ultra léger à installer", tone: "green", shape: "rounded" },
    { value: "1 ligne", label: "De code pour démarrer", tone: "orange", shape: "rounded" },
    { value: "10+", label: "Dimensions suivies", tone: "violet", shape: "leaf-alt" },
  ],
  live: {
    label: "Visiteurs en direct",
    value: "128",
    page: "/tarifs",
    countries: [
      { name: "Madagascar", share: 46 },
      { name: "France", share: 28 },
      { name: "Belgique", share: 12 },
    ],
  },
} as const;

export const PRIVACY_SECTION = {
  title: "Respectez vos visiteurs sans rien perdre",
  text: "Chaque visiteur est représenté par une empreinte anonyme renouvelée chaque jour. Vous gardez des statistiques fiables, vos visiteurs gardent leur vie privée.",
  points: [
    "Aucun cookie ni stockage dans le navigateur",
    "Adresse IP jamais enregistrée",
    "Aucun suivi d'un site à l'autre",
    "Pas de bannière de consentement à ajouter",
  ],
  rows: [
    { label: "Cookies", value: "0", tone: "green" },
    { label: "Adresse IP", value: "Jamais stockée", tone: "orange" },
    { label: "Empreinte", value: "Renouvelée chaque jour", tone: "violet" },
  ],
  badge: "Conforme RGPD",
} as const;

export const SHOWCASE_SECTION = {
  title: "Moins de bruit, plus de décisions",
  text: "Installez le script, ajoutez votre site et laissez les chiffres parler.",
  cards: [
    {
      id: "sources",
      title: "Chaque source suivie",
      text: "Moteurs de recherche, réseaux sociaux, newsletters et campagnes UTM.",
    },
    {
      id: "script",
      title: "Une ligne à copier",
      text: "Collez le script dans votre site : les premières visites apparaissent en quelques secondes.",
    },
    {
      id: "add-site",
      title: "Tous vos sites au même endroit",
      text: "Ajoutez un nouveau site en un clic et passez de l'un à l'autre facilement.",
    },
  ],
  sources: [
    { label: "Google", values: ["4,2 k"], tone: "violet" },
    { label: "Direct", values: ["2,1 k", "+12 %"], tone: "green" },
    { label: "Newsletter", values: ["860"], tone: "orange" },
  ],
  addSite: "Ajouter un site",
} as const;

export const FINAL_CTA = {
  title: "Prêt à voir vos statistiques clairement ?",
  text: "Créez votre compte et ajoutez votre premier site en quelques minutes.",
} as const;

export const FOOTER = {
  tagline: "Statistiques web sans cookie.",
  rights: "Tous droits réservés.",
} as const;
