export type InstallGuide = {
  id: string;
  label: string;
  /** File (or place) where the code goes. */
  target: string;
  /** Short French instruction shown above the code. */
  instruction: string;
  code: (src: string, key: string) => string;
};

export const INSTALL_GUIDES: InstallGuide[] = [
  {
    id: "html",
    label: "HTML",
    target: "index.html",
    instruction: "Collez cette ligne dans le <head> de chaque page du site.",
    code: (src, key) =>
      `<script defer src="${src}" data-key="${key}"></script>`,
  },
  {
    id: "nextjs",
    label: "Next.js",
    target: "app/layout.tsx",
    instruction:
      "Ajoutez le composant Script dans votre layout racine (App Router).",
    code: (src, key) => `import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Script src="${src}" data-key="${key}" strategy="afterInteractive" />
      </body>
    </html>
  );
}`,
  },
  {
    id: "react",
    label: "React / Vite",
    target: "index.html",
    instruction:
      "Placez la ligne dans le <head> du fichier index.html à la racine du projet, pas dans un composant.",
    code: (src, key) => `<head>
  <!-- … -->
  <script defer src="${src}" data-key="${key}"></script>
</head>`,
  },
  {
    id: "vue",
    label: "Vue / Nuxt",
    target: "nuxt.config.ts",
    instruction:
      "Avec Nuxt, déclarez le script dans la configuration. Avec Vue + Vite, utilisez l'onglet React / Vite.",
    code: (src, key) => `export default defineNuxtConfig({
  app: {
    head: {
      script: [{ src: "${src}", defer: true, "data-key": "${key}" }],
    },
  },
});`,
  },
  {
    id: "astro",
    label: "Astro",
    target: "src/layouts/Layout.astro",
    instruction: "Ajoutez la ligne dans le <head> de votre layout principal.",
    code: (src, key) => `<head>
  <!-- … -->
  <script is:inline defer src="${src}" data-key="${key}"></script>
</head>`,
  },
  {
    id: "wordpress",
    label: "WordPress",
    target: "functions.php",
    instruction:
      "Ajoutez ce code au functions.php de votre thème (ou collez la ligne script dans un plugin d'en-têtes).",
    code: (src, key) => `add_action('wp_head', function () {
  echo '<script defer src="${src}" data-key="${key}"></script>';
});`,
  },
  {
    id: "gtm",
    label: "Google Tag Manager",
    target: "Balise HTML personnalisée",
    instruction:
      "Créez une balise « HTML personnalisé » déclenchée sur « All Pages » et collez la ligne.",
    code: (src, key) =>
      `<script defer src="${src}" data-key="${key}"></script>`,
  },
];

export const DEFAULT_GUIDE_ID = "html";
