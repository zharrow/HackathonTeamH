# 🎨 Babyfoot Booking — Brand & Design Guidelines

> Directive officielle pour la cohérence graphique du projet  
> **Public :** Claude (Brand Designer / AI)  
> **Objectif :** Maintenir une identité visuelle forte, futuriste et cohérente dans tout l’écosystème *Babyfoot Booking*.

---

## 1. 🧠 Vision & ADN de Marque

### Mission
Créer une expérience visuelle et interactive **fun, compétitive et technologique**, autour du **babyfoot connecté** pour les étudiants Ynov.

### ADN visuel
- **Univers :** Futuriste + e-sport + campus tech  
- **Énergie :** Dynamique, compétitive, néon  
- **Émotion :** Adrénaline + convivialité  
- **Style graphique :** Minimalisme cyberpunk → glow + géométrie + contraste

### Références visuelles
- *Valorant UI / Riot Design System*
- *Cyberpunk 2077 menus*
- *Tesla UI / Dark Mode futuriste*
- *Neon Tokyo Aesthetic (Cyan + Magenta)*
- Inspirations :  
  - [Linearity – Cyberpunk Style](https://www.linearity.io/blog/cyberpunk-style)  
  - [99designs Futuristic Branding](https://99designs.com/inspiration/branding/futuristic)  
  - [Frontify – Brand Guidelines Examples](https://www.frontify.com/en/guide/brand-guidelines-examples)

---

## 2. 🎨 Palette de Couleurs

| Rôle | Nom | Hex | Usage |
|------|-----|------|-------|
| 🖤 Fond principal | **Dark Void** | `#0D0D0D` | Background global |
| ⚡ Accent primaire | **Neon Cyan** | `#00FFF7` | CTA, hover, éléments actifs |
| 💜 Accent secondaire | **Electric Magenta** | `#FF00FF` | Highlights, MVP, graphiques |
| 🤍 Texte principal | **Off White** | `#F2F2F2` | Titres et paragraphes |
| 🩶 Texte secondaire | **Gray Mist** | `#B0B0B0` | Labels, métadonnées |
| ❤️ Alerte | **Neon Red** | `#FF4B4B` | Erreurs, annulations |
| 💚 Succès | **Neon Green** | `#00FF6C` | Validations, confirmations |

> ✅ Règle : Toujours garder un fond sombre. Utiliser les néons pour hiérarchiser l’action et attirer l’œil sur la performance ou le statut.

---

## 3. 🖋️ Typographie

| Élément | Police | Style | Exemple |
|----------|---------|--------|---------|
| Titres | **Orbitron** (Google Fonts) | Bold, uppercase | “PLAYER RANKINGS” |
| Sous-titres | **Rajdhani** | Semi-bold | “Reservation Queue” |
| Corps de texte | **Inter** | Regular / Medium | Lisible sur fond sombre |

> 👁️ Contraste fort entre titres (techno) et textes (lisibles).  
> **Max 2 familles de polices** par page.  
> Espacement généreux, accentuer la hiérarchie visuelle.

---

## 4. 🧩 UI Components & Principes

### Boutons
- Forme : arrondis (`rounded-lg`)
- Glow : cyan au hover (`shadow-[0_0_8px_#00FFF7]`)
- Taille : généreuse, accessible mobile
- États :
  - **Primary:** Cyan → Hover Glow
  - **Secondary:** Magenta → Glow doux
  - **Disabled:** Opacité 40%, sans glow

### Cartes
- Fond : `#121212`
- Contour : lueur subtile cyan/magenta
- Contenu centré et hiérarchisé (titre, valeur, statut)
- Hover : translation douce + glow

### Champs & Inputs
- Fond semi-transparent noir
- Glow cyan au focus
- Label gris clair

### MVP Card
- Glow dynamique (ReactBits Electric Border)
- Gradient animé cyan → magenta
- Données : pseudo, ELO, victoires/défaites
- Micro animation “pulse” continue

---

## 5. 📈 Graphiques & Data Viz

| Type | Style | Notes |
|------|--------|--------|
| Line / Bar Charts | Fond sombre + accent cyan | Animation à l’entrée |
| Donut / Pie | Cyan / Magenta | Max 3 couleurs |
| Heatmap | Dégradé violet → cyan | Activité horaire |
| Leaderboard | Bar horizontales cyan | ÉLO décroissant |

> 🎬 Animation douce à l’apparition (GSAP), éviter les effets intrusifs.

---

## 6. 🎞️ Animations & Micro-interactions

- **Hover** : Glow + légère translation (Y: -2px)
- **Transitions page** : Fade + slide latéral
- **Chargement** : ligne cyan animée
- **Charts** : apparition progressive des datasets
- **MVP Card** : Electric Border pulsant

> 🎛️ Références motion : *Framer Motion* + *GSAP*

---

## 7. 📐 Layout & Composition

- **Grid 12 colonnes**
- **Spacing system (Tailwind)** : `p-6`, `gap-4`, `rounded-2xl`
- **Containers** : max-width 1200px
- **Dashboard layout :**
  - Header → stats résumé
  - Body → cartes de données
  - Footer → leaderboard / MVP

> 🎯 Objectif : lisibilité, respiration, accent sur les zones interactives.

---

## 8. 🪩 Iconographie & Illustrations

- Style : **Minimal line / geometric neon**
- Format : SVG (monochrome cyan ou magenta)
- Pas d’ombres portées dures
- Animation : glow + rotation douce possible (GSAP)
- Éviter : 3D, textures réalistes, photos réelles

---

## 9. 🧱 Design Tokens (exemples Tailwind)

```ts
export const theme = {
  colors: {
    background: "#0D0D0D",
    accentCyan: "#00FFF7",
    accentMagenta: "#FF00FF",
    textPrimary: "#F2F2F2",
    textSecondary: "#B0B0B0",
    error: "#FF4B4B",
    success: "#00FF6C"
  },
  borderRadius: {
    sm: "6px",
    lg: "12px",
    xl: "20px"
  },
  boxShadow: {
    neon: "0 0 8px #00FFF7",
    magenta: "0 0 8px #FF00FF"
  }
}
```

---

## 10. 🧭 Do’s & Don’ts

### ✅ À faire
- Contraste fort fond/signal  
- Minimalisme + espace  
- Glow contrôlé et cohérent  
- Alignement net, hiérarchie claire  
- Effets de mouvement fluides et réactifs  

### ❌ À éviter
- Trop de couleurs saturées simultanées  
- Textes en glow pur (illisible)  
- Ombres réalistes / textures 3D  
- Animations trop rapides ou saccadées  
- Polices non uniformes  

---

## 11. 📚 Inspirations Référentes

| Marque / Style | Élément clé |
|-----------------|-------------|
| **Riot Games / Valorant** | Palette sombre + accents néon |
| **Tesla UI** | Clarté et lisibilité |
| **Cyberpunk 2077 HUD** | Identité visuelle forte |
| **Neon Tokyo Posters** | Couleurs et énergie |
| **Spotify Wrapped UI** | Data viz dynamique |

---

## 12. ✅ Design Review Checklist

- [ ] Palette respectée (#0D0D0D, #00FFF7, #FF00FF)  
- [ ] Typographie Orbitron + Inter  
- [ ] Glow harmonisé (cyan/magenta)  
- [ ] Layout fluide sur mobile  
- [ ] Charts cohérents avec UI  
- [ ] MVP Card animée  
- [ ] Aucune surcharge visuelle  
- [ ] Micro-interactions testées  

---

## 13. 🏁 Résumé

L’identité *Babyfoot Booking* repose sur un équilibre entre :  
- **Futurisme et lisibilité**  
- **Performance et convivialité**  
- **Dark + Neon → Esprit compétitif mais fun**

🎯 But : Que chaque interface donne envie de “jouer le match”, dans un univers **immersif et cohérent**.

---

## 14. 📦 Fichiers & Livrables pour Claude

| Type | Nom de fichier | Détails |
|------|----------------|---------|
| 🎨 Palette | `palette-babyfoot.json` | Variables couleur globales |
| 🖋️ Fonts | `fonts.css` | Orbitron / Inter / Rajdhani |
| 🧱 Tokens | `theme.ts` | Variables Tailwind |
| 📊 UI Kit | `ui-kit.fig` | Figma avec composants et états |
| 🪩 Motion | `motion-docs.md` | Références GSAP / Framer Motion |

---

💡 **Rappel final :**
> *Babyfoot Booking* est une application où le **plaisir de jouer** rencontre le **design futuriste**.  
> L’identité doit rester **lisible, énergique et compétitive**, sans jamais perdre la touche **néon e-sport** qui la rend unique.

---
