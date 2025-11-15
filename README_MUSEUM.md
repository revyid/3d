# Museum Walkthrough 3D Gallery

Production-ready interactive 3D museum experience built with React Three Fiber and Next.js v16.

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

Dependencies added:
- `three` - 3D engine
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Utilities and helpers
- `framer-motion` - UI animations

### 2. Run Development Server
```bash
pnpm dev
```

Open browser → `http://localhost:3000/museum`

## File Structure

```
app/
  (museum)/
    page.tsx          # Main component with scene, controls, UI
public/
  museum-images/     # Add local artwork images here
```

## Adding Artwork

Edit the `artworks` array at top of `app/(museum)/page.tsx`:

```typescript
const artworks = [
  {
    id: 'unique-id',
    title: 'Artwork Title',
    src: '/museum-images/local-image.jpg',  // or https://...
    description: 'Optional description'
  },
  // ...
];
```

**Local images:** Place in `public/museum-images/` and reference as `/museum-images/filename.jpg`

**Remote images:** Use full HTTPS URL (e.g., Unsplash, Pexels)

## Controls

- **▶ / ⏸** - Play/pause auto-advance
- **← →** - Previous/next artwork
- **← →** keyboard keys - Same as buttons
- **Space** - Play/pause toggle
- **PP button** - Toggle postprocessing effects

## Features

✅ Smooth camera path interpolation with cubic easing  
✅ 3D wooden frames with PBR-like materials  
✅ Dynamic rim lighting on active artworks  
✅ Ambient + directional + spot lighting  
✅ Studio environment for realistic rendering  
✅ Framer Motion UI animations  
✅ Responsive loading UI with progress  
✅ Keyboard shortcuts + accessibility labels  
✅ Performance optimized (device pixel ratio budget)  
✅ Configurable duration per camera segment  

## Performance Notes

- Textures lazy-load on demand
- Device pixel ratio capped at 1.5× for perf budget
- Optional postprocessing toggle
- Fallback gray placeholder if image fails to load

## Customization

### Camera Waypoints
Edit `cameraPath` array to adjust:
- Camera position `[x, y, z]`
- Look-at target `[x, y, z]`
- Animation duration in seconds

### Lighting
Adjust in `MuseumLights` component:
- Ambient light intensity
- Directional light angle/strength
- Spot light colors/penumbra

### Styling
Uses Tailwind CSS classes. Edit colors/spacing inline in JSX or adjust Tailwind config.

## Browser Support

- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge (recent versions)
