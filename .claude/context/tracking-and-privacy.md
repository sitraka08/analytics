# Tracking et vie privée

## Flux de collecte
1. Le site client charge un script minuscule (`/script.js`, servi par l'app) avec sa clé de site.
2. Le script envoie un `POST /api/collect` (`navigator.sendBeacon` ou `fetch` keepalive) à chaque navigation, y compris SPA (History API).
3. La durée est envoyée à la fermeture ou au masquage de la page (`visibilitychange`).
4. Le serveur valide (Zod), filtre les bots, enrichit (pays, appareil), calcule le hash visiteur, puis insère l'événement. Réponse `202` sans corps.

## Identité visiteur sans cookie
`visitor_id = hash(sel_quotidien + site_id + IP + user-agent)`.
- Le sel change chaque jour et n'est pas conservé après rotation : impossible de relier un visiteur d'un jour à l'autre.
- L'IP et le user-agent bruts ne sont jamais stockés.
- Conséquence assumée : un visiteur revenant un autre jour compte comme nouveau.

## Enrichissement
- Pays : headers Vercel (`x-vercel-ip-country`), région/ville seulement si utile et non précis.
- Appareil, navigateur, OS : parsés depuis le user-agent, puis le user-agent est jeté.
- Référent : domaine seulement par défaut ; UTM depuis l'URL de la page.

## Protection de l'endpoint public
- CORS limité aux domaines déclarés pour la clé de site.
- Limite de débit par IP et par site.
- Taille de payload bornée, champs validés et tronqués.
- Rejet des bots connus et des requêtes sans user-agent.

## Conformité
Aucune donnée personnelle, aucun cookie, aucun stockage navigateur : pas de bannière de consentement. Documenter ce fonctionnement dans la page de confidentialité.
