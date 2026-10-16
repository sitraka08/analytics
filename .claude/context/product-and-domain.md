# Produit et domaine

## Vision
Un outil d'analytics web simple : on ajoute un script sur son site et on comprend en quelques secondes d'où viennent les visiteurs, ce qu'ils lisent et combien de temps ils restent. Inspiré de Vercel Analytics, mais avec des graphes et des libellés plus faciles à lire.

## Problème résolu
Les dashboards existants sont denses ou cryptiques. Ici : peu de chiffres par écran, titres en langage clair, comparaison à la période précédente, états vides qui expliquent quoi faire.

## Cible
Développeurs indépendants, créateurs, petites équipes qui veulent suivre leurs sites sans configuration lourde.

## Modèle
- **Utilisateur** : compte (Better Auth).
- **Site** : domaine suivi, appartient à un utilisateur, possède une clé publique de collecte.
- **Événement** : pageview (et plus tard événements custom) : site, chemin, référent, UTM, pays, appareil, navigateur, OS, horodatage.
- **Visiteur** : identifiant anonyme = hash quotidien salé (voir tracking-and-privacy.md).
- **Session** : suite d'événements d'un même visiteur, coupée après 30 min d'inactivité.

## Métriques
- Visiteurs uniques, pages vues, durée moyenne de visite, taux de rebond (session d'une seule page).
- Top pages, top référents, pays, appareils, navigateurs, OS, campagnes UTM.
- Périodes : 24 h, 7 j, 30 j, 90 j, personnalisée, avec comparaison à la période précédente.

## Hors périmètre MVP
Événements custom, entonnoirs, temps réel, équipes multi-membres, alertes, export, facturation.
