import type { LegalDocument } from "../types/legal";
import { PUBLISHER } from "./publisher";

export const PRIVACY: LegalDocument = {
  title: "Politique de confidentialité",
  highlight: "confidentialité",
  description: "Quelles données nous traitons, pourquoi, et comment exercer vos droits (RGPD).",
  sections: [
    {
      id: "summary",
      title: "L'essentiel",
      items: [
        "Aucun cookie de suivi ni stockage dans le navigateur des visiteurs.",
        "Aucune adresse IP ni user-agent n'est enregistré.",
        "Aucun identifiant ne persiste d'un jour à l'autre : pas de profil, pas de pistage.",
        "Aucune bannière de consentement n'est donc nécessaire.",
      ],
    },
    {
      id: "account-data",
      title: "Votre compte",
      paragraphs: [
        "Responsable du traitement : l'éditeur de Statly, joignable à " + PUBLISHER.email + ".",
        "Nous traitons votre nom, votre e-mail, votre mot de passe (haché, jamais lisible), l'identifiant Google si vous vous connectez avec Google, et vos sites (nom et domaine). Base légale : l'exécution du service. Ces données sont supprimées avec votre compte.",
        "Un cookie de session strictement nécessaire vous garde connecté. Il ne sert ni à la mesure d'audience ni à la publicité.",
      ],
    },
    {
      id: "visitor-data",
      title: "Les visiteurs de vos sites",
      paragraphs: [
        "Vous êtes responsable du traitement de ces données, Statly est votre sous-traitant. À chaque page vue, nous recevons l'adresse de la page, le site d'origine du visiteur, la durée de visite et un identifiant aléatoire de page vue, jamais stocké dans le navigateur.",
        "Le serveur en déduit le pays, l'appareil, le navigateur et le système, puis abandonne l'adresse IP et le user-agent : ils ne sont ni enregistrés ni écrits dans les journaux. Un hachage salé, dont le sel change chaque jour, compte les visiteurs sur une journée sans jamais pouvoir les relier d'un jour à l'autre. Le script s'arrête si « Ne pas suivre » est activé.",
        "Les événements sont conservés " + PUBLISHER.eventRetentionMonths + " mois, puis supprimés.",
      ],
    },
    {
      id: "processors",
      title: "Prestataires",
      paragraphs: [
        "Vercel (hébergement), Supabase (base de données et authentification) et Google (connexion, si vous la choisissez). Des transferts hors de l'Union européenne peuvent avoir lieu, encadrés par les clauses contractuelles types. Nous ne vendons ni ne partageons aucune donnée avec des annonceurs.",
      ],
    },
    {
      id: "rights",
      title: "Vos droits",
      paragraphs: [
        "Accès, rectification, suppression, portabilité, limitation et opposition : écrivez à " + PUBLISHER.email + ", nous répondons sous un mois. Vous pouvez aussi saisir la CNIL (cnil.fr).",
      ],
    },
  ],
};
