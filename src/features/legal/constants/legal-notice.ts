import type { LegalDocument } from "../types/legal";
import { PUBLISHER } from "./publisher";

export const LEGAL_NOTICE: LegalDocument = {
  title: "Mentions légales",
  highlight: "légales",
  description: "Qui édite le site et qui l'héberge, conformément à la loi pour la confiance dans l'économie numérique.",
  sections: [
    {
      id: "publisher",
      title: "Éditeur",
      paragraphs: [
        "Le site est édité à titre non professionnel par " + PUBLISHER.name + ", personne physique.",
        "Contact : " + PUBLISHER.email + ".",
        "Conformément à l'article 6-III-2 de la loi n° 2004-575, l'éditeur non professionnel peut préserver son anonymat : ses informations d'identité ont été communiquées à l'hébergeur.",
      ],
    },
    {
      id: "director",
      title: "Directeur de la publication",
      paragraphs: [PUBLISHER.name + "."],
    },
    {
      id: "hosting",
      title: "Hébergement",
      items: [
        "Application : " + PUBLISHER.hosting.app.name + ", " + PUBLISHER.hosting.app.address + ".",
        "Base de données et authentification : " + PUBLISHER.hosting.database.name + ", " + PUBLISHER.hosting.database.address + ".",
      ],
    },
    {
      id: "property",
      title: "Propriété intellectuelle",
      paragraphs: [
        "Les textes, le code, les illustrations et l'identité visuelle du site sont protégés. Toute reproduction sans autorisation écrite est interdite, hors courte citation avec mention de la source.",
      ],
    },
    {
      id: "data",
      title: "Données personnelles",
      paragraphs: ["Le traitement des données est détaillé dans la politique de confidentialité."],
    },
  ],
};
