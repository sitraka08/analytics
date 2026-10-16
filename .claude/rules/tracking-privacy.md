# Tracking et vie privée (règles)

Détails du flux : `.claude/context/tracking-and-privacy.md`.

## Interdits
- Cookies, `localStorage`, `sessionStorage` ou tout stockage navigateur côté script de tracking.
- Stocker l'IP ou le user-agent bruts, en base comme dans les logs.
- Fingerprinting (canvas, polices, etc.) ou identifiant persistant entre jours.
- Collecter des champs de formulaire, du texte de page ou des données personnelles.

## Obligatoire
- Hash visiteur salé avec rotation quotidienne ; sel jamais exposé.
- `/api/collect` : validation Zod stricte, payload borné, CORS par domaine du site, limite de débit, filtre bots, réponse `202` sans corps.
- Script de tracking minuscule (cible < 2 Ko gzip), sans dépendance, qui ne bloque pas le rendu et n'échoue jamais bruyamment sur le site client.
- Toute nouvelle donnée collectée est justifiée dans le contexte et ne permet pas d'identifier une personne.
