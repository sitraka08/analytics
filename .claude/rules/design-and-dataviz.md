# Design et visualisation

## Identité
- Inspiration landing : fond crème chaleureux, grandes sections aux coins très arrondis, titres forts, CTA en pilule sombre, cartes de stats colorées (bleu, vert, orange, jaune), photos/illustrations sobres.
- Le produit doit paraître fait à la main, pas « UI générée » : éviter carte centrée + logo au-dessus + grosse ombre, halos bleus de focus, fonds sombres à cercles décoratifs. Préférer mises en page éditoriales alignées à gauche, détails dessinés (`HandDrawnUnderline`, surlignage `bg-highlight`), ton de texte chaleureux.
- Palette de référence (ne pas la changer sans demande) : fond `#f6f5f1`, crème `#efebe1`, texte `#121212`, bleu `#4a6cf7`, vert `#7dd389`, orange `#ff6633`, jaune `#ffde2e`. Dégradés de panneaux via tokens `panel-*` (`bg-linear-160 from-panel-sand-from to-panel-sand-to`).
- Cartes et pastilles colorées : fond via `toneClass` de `src/lib/tones.ts`, texte toujours blanc (`text-tone-foreground`), choix assumé même sur jaune/vert.
- Illustrations : SVG inline dessinés au trait (contour `var(--foreground)`, remplissages `var(--brand-*)`), `aria-hidden`, sans dépendance ni image externe. Partagées dans `components/shared/illustrations/` (`DeskScene`), sinon dans la feature (`GlobeScene` de la landing).
- Polices via `next/font/google` dans `src/app/layout.tsx`, mappées dans `globals.css` :
  - `font-heading` → Manrope : `h1`–`h3` (appliqué globalement), titres de cartes, grands chiffres/KPI.
  - `font-sans` → Google Sans : texte courant, formulaires, navigation.
  - `font-mono` → Google Sans Code : extraits de code, tableaux de nombres (avec `tabular-nums`).
- shadcn/ui (style base-nova, Base UI) ; registre `@shadcn-space` dans `components.json` pour partir de blocs gratuits : les adapter dans la feature concernée puis supprimer les fichiers générés (`components/shadcn-space/`, routes de démo).
- Animations : `motion` (`motion/react`) via `MotionProvider` (LazyMotion + `reducedMotion="user"`) et les primitives `Reveal`/`RevealGroup`/`RevealItem` de `components/shared/reveal.tsx`. Animer l'entrée et le survol, jamais bloquer la lecture.
- Tokens en variables CSS dans `globals.css` (couleurs, rayons, ombres). Pas de couleur codée en dur dans les composants.
- Light et dark : les deux, via tokens. Mobile-first et responsive.

## Formulaires et pages d'auth
- Layout auth (`AuthShell`) : deux colonnes sur fond crème ; formulaire à gauche (`max-w-sm`, aligné à gauche, titre via `AuthPanel` avec mot souligné), panneau de marque `AuthAside` à droite (`rounded-4xl bg-cream-deep`, illustration + tuiles colorées), masqué sous `lg`.
- Champs : réutiliser `TextField` / `PasswordField` de `features/auth/components/` (à extraire en partagé dès qu'une 2ᵉ feature en a besoin). Style : boîte blanche `bg-surface`, bordure 2 px `border-foreground/15`, libellé en petit à l'intérieur, survol `border-foreground/35`, focus `border-foreground` sans halo, erreur `border-destructive` + message avec icône dessous. Ne jamais donner l'apparence d'un champ désactivé (fond gris sans bordure).
- Mot de passe : bouton afficher/masquer (`aria-label`, `aria-pressed`).
- Boutons : `SubmitButton` = pilule sombre `h-12` avec pastille fléchée (spinner pendant l'envoi) ; secondaires en pilule contour ; liens en texte souligné.

## Dashboard
- shadcn/ui : `Sidebar` collapsible (icônes seules en mode réduit, état mémorisé), `Card`, `Tabs`, `Select`, `Skeleton`, `Chart`.
- Layout : sidebar à gauche, en-tête avec sélecteur de site et de période, contenu en grille de cartes.
- Les composants de `components/ui/` viennent de shadcn ; ne pas les réécrire.

## Lisibilité des graphes
- Une idée par graphe ; un titre qui dit ce qu'on voit (« Visiteurs par jour », pas « Série temporelle »).
- Commencer par 3 à 4 KPI avec variation vs période précédente (flèche + pourcentage, couleur et icône, jamais la couleur seule).
- Graphes via shadcn Chart (Recharts) ; types adaptés : aire/ligne pour le temps, barres horizontales pour les classements, pas de camembert au-delà de 4 parts.
- Tooltip lisible, axes sobres, grille discrète, valeurs compactes (`1,2 k`) avec `Intl.NumberFormat('fr')`.
- Palette catégorielle limitée et accessible ; contraste suffisant en light et dark.

## États obligatoires
Chaque widget gère : chargement (`Skeleton` de même forme), vide (message qui explique quoi faire, ex. installer le script), erreur (message clair + réessayer), et peu de données.

## Accessibilité
HTML sémantique, labels sur les champs, contrôles utilisables au clavier, focus visible, équivalent textuel ou tableau pour chaque graphe.

## Textes
Français uniquement, ton simple. Centraliser les libellés (constantes de feature) pour pouvoir les extraire plus tard.
