# 🚀 Guide d'Utilisation - Composants Futuristes

Ce guide explique comment utiliser tous les nouveaux composants d'animation et effets visuels.

---

## 📦 Imports

```tsx
// Animations GSAP
import { GlitchText, HoverGlow, ScanLine } from '@/components/animations'

// Three.js Background
import { ThreeBackground } from '@/components/three'

// Composants existants
import ElectricBorder from '@/components/ElectricBorder'
import DotGrid from '@/components/DotGrid'
```

---

## 🎨 Palette de Couleurs

### Variables CSS disponibles :
```css
var(--neon-cyan)          /* #00FFF7 */
var(--electric-magenta)   /* #FF00FF */
var(--dark-void)          /* #0D0D0D */
var(--off-white)          /* #F2F2F2 */
var(--gray-mist)          /* #B0B0B0 */
var(--neon-red)           /* #FF4B4B */
var(--neon-green)         /* #00FF6C */
```

### Classes Tailwind :
```tsx
className="bg-[#0D0D0D] text-[#F2F2F2] border-[#00FFF7]"
```

---

## ✨ Effets Glow

### Classes CSS disponibles :

#### Box Shadow Glow
```tsx
// Glow standard
<div className="glow-cyan">...</div>
<div className="glow-magenta">...</div>

// Glow intense (3 couches)
<div className="glow-cyan-intense">...</div>
<div className="glow-magenta-intense">...</div>

// Glow au hover (+ lift effect)
<div className="hover-glow-cyan">...</div>
<div className="hover-glow-magenta">...</div>
```

#### Text Shadow Glow
```tsx
<h1 className="text-glow-cyan">TITRE</h1>
<h1 className="text-glow-magenta">TITRE</h1>
```

### Exemple complet :
```tsx
<div className="bg-[#0D0D0D] p-6 rounded-lg glow-cyan hover-glow-cyan">
  <h2 className="font-heading text-2xl text-[#F2F2F2] text-glow-cyan">
    TITRE AVEC GLOW
  </h2>
  <p className="font-body text-[#B0B0B0]">
    Description...
  </p>
</div>
```

---

## 🔤 Typographie

### Classes disponibles :

```tsx
// Titres (Orbitron - uppercase, bold)
<h1 className="font-heading">TITRE PRINCIPAL</h1>

// Sous-titres (Rajdhani - semi-bold)
<h2 className="font-subheading">Sous-titre</h2>

// Corps de texte (Inter - regular)
<p className="font-body">Texte standard...</p>
```

### Combinaisons recommandées :

```tsx
// Hero title
<h1 className="font-heading text-7xl text-glow-cyan">
  {t('home.title')}
</h1>

// Section header
<h2 className="font-heading text-4xl text-[#F2F2F2] text-glow-cyan">
  {t('home.section')}
</h2>

// Card title
<h3 className="font-subheading text-2xl text-[#00FFF7]">
  Titre de carte
</h3>

// Description
<p className="font-body text-[#B0B0B0]">
  Description...
</p>
```

---

## 🎬 Composant : GlitchText

### Description :
Effet glitch cyberpunk avec skew, offset et color separation.

### Props :
```tsx
interface GlitchTextProps {
  children: string              // Texte à animer
  className?: string            // Classes CSS additionnelles
  glitchInterval?: number       // Intervalle entre glitches (secondes)
  intensity?: 'low' | 'medium' | 'high'
}
```

### Valeurs par défaut :
- `glitchInterval`: 5 secondes
- `intensity`: 'medium'

### Exemples :

#### Usage basique :
```tsx
<GlitchText>
  BABYFOOT BOOKING
</GlitchText>
```

#### Glitch fréquent et intense :
```tsx
<GlitchText intensity="high" glitchInterval={3}>
  MVP PLAYER
</GlitchText>
```

#### Avec classes custom :
```tsx
<GlitchText
  className="font-heading text-5xl text-[#00FFF7]"
  intensity="medium"
  glitchInterval={8}
>
  DISPONIBLE
</GlitchText>
```

### Notes :
- Premier glitch après 1s de montage
- Couleurs du glitch : Cyan (#00FFF7) et Magenta (#FF00FF)
- Pas de glitch sur mobile si `prefers-reduced-motion`

---

## 💫 Composant : HoverGlow

### Description :
Wrapper qui ajoute un effet glow animé au survol avec lift effect.

### Props :
```tsx
interface HoverGlowProps {
  children: React.ReactNode
  glowColor?: 'cyan' | 'magenta' | 'dual'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}
```

### Valeurs par défaut :
- `glowColor`: 'cyan'
- `intensity`: 'medium'

### Intensités :
| Intensity | Blur | Spread | Lift |
|-----------|------|--------|------|
| low       | 15px | 20px   | -2px |
| medium    | 25px | 30px   | -4px |
| high      | 35px | 50px   | -6px |

### Exemples :

#### Card interactive :
```tsx
<HoverGlow glowColor="cyan" intensity="medium">
  <Card className="p-6 bg-[#0D0D0D]">
    <h3>Table 1</h3>
    <p>Disponible</p>
  </Card>
</HoverGlow>
```

#### Bouton avec glow magenta :
```tsx
<HoverGlow glowColor="magenta" intensity="high">
  <Button variant="default">
    Réserver
  </Button>
</HoverGlow>
```

#### Grid de cards :
```tsx
<div className="grid grid-cols-3 gap-4">
  {tables.map(table => (
    <HoverGlow key={table.id} glowColor="cyan">
      <TableCard table={table} />
    </HoverGlow>
  ))}
</div>
```

---

## 📡 Composant : ScanLine

### Description :
Ligne de scan cyberpunk qui traverse l'écran verticalement.

### Props :
```tsx
interface ScanLineProps {
  color?: string      // Couleur (hex)
  duration?: number   // Durée de traversée (secondes)
  height?: number     // Hauteur de la ligne (px)
  opacity?: number    // Opacité (0-1)
}
```

### Valeurs par défaut :
- `color`: '#00FFF7' (cyan)
- `duration`: 4 secondes
- `height`: 2px
- `opacity`: 0.5

### Exemples :

#### Usage basique (cyan) :
```tsx
<ScanLine />
```

#### Scan lent magenta :
```tsx
<ScanLine
  color="#FF00FF"
  duration={8}
  height={3}
  opacity={0.7}
/>
```

#### Multiple scan lines :
```tsx
<>
  <ScanLine color="#00FFF7" duration={4} />
  <ScanLine color="#FF00FF" duration={6} />
</>
```

### Notes :
- Position fixed, z-index 50
- `pointer-events-none` (ne bloque pas les interactions)
- Animation en boucle infinie

---

## 🌌 Composant : ThreeBackground

### Description :
Background 3D avec géométrie wireframe animée (icosaèdre).

### Props :
```tsx
interface ThreeBackgroundProps {
  className?: string
}
```

### Exemple :

#### Usage basique :
```tsx
<ThreeBackground className="opacity-20" />
```

#### Dans une page :
```tsx
export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#0D0D0D]">
      {/* Background 3D */}
      <ThreeBackground className="opacity-15" />

      {/* DotGrid par-dessus */}
      <div className="absolute inset-0">
        <DotGrid activeColor="#00FFF7" />
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  )
}
```

### Lazy Loading (recommandé) :
```tsx
import dynamic from 'next/dynamic'

const ThreeBackground = dynamic(
  () => import('@/components/three').then(mod => mod.ThreeBackground),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#0D0D0D]" />
  }
)
```

### Performance :
- Auto-rotation à 0.5 vitesse
- Points limités (32x32 sphere)
- Transparent background
- Désactiver zoom/pan pour performance

### Customisation :
Modifier `components/three/ThreeBackground.tsx` :

```tsx
// Changer la géométrie
<icosahedronGeometry args={[2.5, 1]} /> // [rayon, détail]

// Changer la vitesse de rotation
<OrbitControls autoRotateSpeed={1.0} />

// Ajouter plus de particules
<sphereGeometry args={[5, 64, 64]} /> // Plus de points
```

---

## ⚡ Composant : ElectricBorder (existant)

### Description :
Bordure électrique animée avec distorsion SVG.

### Props :
```tsx
interface ElectricBorderProps {
  color?: string       // Couleur (hex)
  speed?: number       // Vitesse (multiplicateur)
  chaos?: number       // Intensité distorsion
  thickness?: number   // Épaisseur bordure (px)
  className?: string
  style?: CSSProperties
}
```

### Valeurs par défaut :
- `color`: '#FFEA80' (maintenant `#00FFF7` recommandé)
- `speed`: 2
- `chaos`: 2
- `thickness`: 10

### Exemples :

#### MVP Card (cyan) :
```tsx
<ElectricBorder
  color="#00FFF7"
  speed={0.8}
  chaos={0.6}
  thickness={5}
  className="bg-[#0D0D0D]"
>
  <div className="p-6">
    <h3>MVP</h3>
  </div>
</ElectricBorder>
```

#### Intense magenta :
```tsx
<ElectricBorder
  color="#FF00FF"
  speed={1.5}
  chaos={3}
  thickness={8}
>
  <div>Contenu important</div>
</ElectricBorder>
```

---

## 🎯 Exemples de Compositions

### Hero Section avec tous les effets :
```tsx
<main className="relative min-h-screen bg-[#0D0D0D] overflow-hidden">
  {/* Background layers */}
  <ThreeBackground className="opacity-15" />
  <DotGrid activeColor="#00FFF7" />
  <ScanLine color="#00FFF7" duration={6} />

  {/* Content */}
  <div className="relative z-10 container mx-auto px-4 py-16">
    <div className="text-center space-y-8">
      {/* Titre avec glitch */}
      <GlitchText
        intensity="high"
        glitchInterval={5}
        className="font-heading text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FFF7] to-[#FF00FF]"
      >
        BABYFOOT BOOKING
      </GlitchText>

      {/* Subtitle */}
      <p className="font-subheading text-2xl text-[#B0B0B0]">
        {t('home.subtitle')}
      </p>
    </div>
  </div>
</main>
```

### Cards Grid avec hover effects :
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {tables.map((table, index) => (
    <HoverGlow
      key={table.id}
      glowColor={index === 0 ? 'cyan' : 'magenta'}
      intensity="medium"
    >
      <Card className="bg-[#0D0D0D] p-6 border border-[#00FFF7]/20">
        <h3 className="font-subheading text-xl text-[#00FFF7]">
          {table.name}
        </h3>
        <p className="font-body text-[#B0B0B0] mt-2">
          {table.status}
        </p>
      </Card>
    </HoverGlow>
  ))}
</div>
```

### MVP Card avec glitch + electric border :
```tsx
<div className="w-full max-w-4xl mx-auto">
  <ElectricBorder
    color="#00FFF7"
    speed={0.8}
    chaos={0.6}
    thickness={5}
    className="bg-[#0D0D0D]"
  >
    <div className="p-6">
      {/* Badge MVP */}
      <div className="bg-[#00FFF7] px-3 py-1 glow-cyan">
        <GlitchText intensity="low" glitchInterval={10}>
          MVP
        </GlitchText>
      </div>

      {/* Nom du joueur */}
      <h3 className="font-heading text-5xl text-white text-glow-cyan mt-4">
        {player.nickname}
      </h3>
    </div>
  </ElectricBorder>
</div>
```

---

## 🎨 Combinaisons de Couleurs

### Cyan Primary :
```tsx
<div className="bg-[#0D0D0D] border-2 border-[#00FFF7] glow-cyan">
  <h3 className="text-[#00FFF7] text-glow-cyan">Titre</h3>
  <p className="text-[#B0B0B0]">Description</p>
</div>
```

### Magenta Accent :
```tsx
<Button className="bg-[#FF00FF] text-[#0D0D0D] glow-magenta hover-glow-magenta">
  Action
</Button>
```

### Gradient Cyan → Magenta :
```tsx
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFF7] via-[#FF00FF] to-[#00FFF7] animate-gradient-x">
  TITRE ANIMÉ
</h1>
```

---

## 📱 Responsive

### Mobile :
```tsx
<h1 className="font-heading text-4xl md:text-7xl">
  {title}
</h1>

<ThreeBackground className="opacity-10 md:opacity-20" />
```

### Réduire les effets sur mobile :
```tsx
const isMobile = useMediaQuery('(max-width: 768px)')

<HoverGlow intensity={isMobile ? 'low' : 'high'}>
  ...
</HoverGlow>
```

---

## ⚙️ Performance

### Lazy loading recommandé :
```tsx
const ThreeBackground = dynamic(() => import('@/components/three'), {
  ssr: false
})

const GlitchText = dynamic(() => import('@/components/animations').then(m => m.GlitchText), {
  ssr: false
})
```

### Désactiver animations sur mobile :
```tsx
{!isMobile && <ScanLine />}
{!isMobile && <ThreeBackground />}
```

---

## 🐛 Troubleshooting

### Three.js ne s'affiche pas :
- Vérifier que les dépendances sont installées :
  ```bash
  npm install three @react-three/fiber @react-three/drei
  ```
- Ajouter `'use client'` en haut du fichier

### Glitch trop fréquent :
```tsx
<GlitchText glitchInterval={10}> {/* Augmenter */}
```

### Glow trop intense :
```tsx
<HoverGlow intensity="low"> {/* Réduire */}
```

---

**Dernière mise à jour** : 2025-10-17
**Version** : 1.0
