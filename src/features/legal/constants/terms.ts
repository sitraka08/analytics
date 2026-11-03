import type { LegalDocument } from "../types/legal";
import { PUBLISHER } from "./publisher";

export const TERMS: LegalDocument = {
  title: "Conditions d'utilisation",
  highlight: "utilisation",
  description: "Les règles du jeu, en bref.",
  sections: [
    {
      id: "service",
      title: "Le service",
      paragraphs: [
        "Statly est un outil gratuit de statistiques web : vous ajoutez un script à votre site et vous suivez vos visites. Il est fourni dans l'état, sans garantie de disponibilité, et peut être interrompu pour maintenance ou panne.",
      ],
    },
    {
      id: "account",
      title: "Votre compte",
      paragraphs: [
        "Vous devez avoir au moins 16 ans et rester responsable de votre mot de passe. Vous pouvez supprimer votre compte à tout moment en écrivant à " +
          PUBLISHER.email +
          " : vos sites et statistiques sont alors effacés.",
      ],
    },
    {
      id: "usage",
      title: "Utilisation acceptable",
      items: [
        "N'installez le script que sur des sites dont vous avez le droit de suivre l'audience.",
        "N'envoyez pas de fausses données et ne cherchez pas à contourner ou perturber le service.",
        "N'essayez pas d'accéder aux données d'un autre utilisateur.",
      ],
      closing: [
        "En cas de manquement, nous pouvons suspendre ou supprimer le compte.",
      ],
    },
    {
      id: "liability",
      title: "Responsabilité",
      paragraphs: [
        "Pour les visiteurs de vos sites, vous êtes responsable du traitement et Statly votre sous-traitant (voir la politique de confidentialité). Dans les limites permises par la loi, l'éditeur n'est pas responsable des dommages indirects liés à l'utilisation ou à l'indisponibilité du service.",
      ],
    },
    {
      id: "law",
      title: "Droit applicable",
      paragraphs: [
        "Ces conditions peuvent évoluer, la date de mise à jour figure en haut de page. Elles sont soumises au droit français.",
      ],
    },
  ],
};
