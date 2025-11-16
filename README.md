# 🏛️ 3D Museum Walkthrough Gallery

> **Next-Generation Interactive 3D Museum Experience**
>
> Immerse yourself in a stunning 3D gallery with seamless camera navigation, responsive design, and cutting-edge web technologies.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160.0-white?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

[Demo](#-getting-started) • [Documentation](#-resources) • [Contributing](#-contributing)

</div>

---

## 🚀 Quick Start

Get up and running in just a few minutes:

```bash
# Clone the repository
git clone https://github.com/revyid/3d.git
cd 3d

# Install dependencies (using pnpm - recommended)
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start exploring!

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **3D Interactive Gallery** | Immersive 3D environment with museum exhibits |
| 🎬 **Smooth Navigation** | Seamless camera transitions and intuitive controls |
| 📱 **Fully Responsive** | Optimized for desktop, tablet, and mobile devices |
| ⚡ **High Performance** | Built with modern optimizations and best practices |
| 🎭 **Interactive Elements** | Engage with exhibits and discover detailed stories |
| 🌐 **Web-Based** | No downloads required, works on any modern browser |
| 🔧 **Customizable** | Easy to extend with your own 3D models and content |
| 📦 **Production Ready** | Optimized builds and deployment ready |

---

## 🛠️ Technology Stack

<table>
<tr>
<td width="50%">

### 🎯 Frontend
- **Next.js 16** - React framework with Server Components
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

</td>
<td width="50%">

### 🎨 3D & Graphics
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful Three.js helpers

</td>
</tr>
<tr>
<td width="50%">

### ✨ Animation
- **Framer Motion** - Smooth animations
- **CSS Animations** - Native browser animations

</td>
<td width="50%">

### 🧹 Quality Assurance
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing

</td>
</tr>
</table>

---

## 📋 System Requirements

| Requirement | Version |
|------------|---------|
| **Node.js** | v18.0.0 or higher |
| **npm** | v9.0.0 or higher |
| **pnpm** | v8.0.0 or higher |
| **Modern Browser** | Chrome, Firefox, Safari, Edge |

> **Tip:** We recommend using [pnpm](https://pnpm.io) for faster installations and better dependency management.

---

## 🚀 Getting Started

### Step 1: Clone & Navigate
```bash
git clone https://github.com/revyid/3d.git
cd 3d
```

### Step 2: Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Step 3: Start Development Server
```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

### Step 4: Open in Browser
Navigate to **[http://localhost:3000](http://localhost:3000)** and start exploring!

---

## 📁 Project Architecture

```
3d/
├── app/                         # Next.js App Router
│   ├── globals.css              # Global stylesheets
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page component
│   ├── museum/
│   │   ├── layout.tsx           # Museum-specific layout
│   │   └── page.tsx             # 3D gallery component
│   └── components/              # Reusable components
├── public/
│   └── museum-images/           # Static image assets
├── package.json                 # Dependencies manifest
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js settings
├── tailwind.config.js           # Tailwind CSS theme
├── postcss.config.mjs           # PostCSS plugins
├── eslint.config.mjs            # Code linting rules
└── pnpm-workspace.yaml          # Monorepo configuration
```

**Key Directories:**
- `app/` - Application structure using Next.js App Router
- `public/` - Static assets served directly
- Configuration files at root level for easy access

---

## 🎮 How to Use the Gallery

### Welcome Screen
1. Open [http://localhost:3000](http://localhost:3000)
2. See the beautiful welcome screen with **"MUSEUM"** title
3. Click **"Masuki Galeri"** (Enter Gallery) button to begin

### Navigation Controls

| Control | Function |
|---------|----------|
| **← / →** (Arrow Keys) | Navigate between artworks |
| **Play Button** (Bottom Center) | Toggle automatic tour mode |
| **Mouse/Touch** | Look around the gallery |
| **Any Key** | Close welcome overlay |

### Features While Browsing

- **🖼️ Artwork Info Panel** (Top Left)
  - Shows artwork title, artist, and year
  - Displays detailed description
  - Current artwork number tracking

- **▶️ Playback Controls** (Bottom Center)
  - Previous artwork button (←)
  - Play/Pause toggle button (▶ / ⏸)
  - Next artwork button (→)

- **📊 Status Indicator** (Top Right)
  - Shows "Tour Aktif" when autoplay is running
  - Shows "Mode Manual" when navigating manually

### Gallery Collections

The gallery features **12 curated artworks**:
1. Abstract Harmony
2. Ocean Serenity
3. Mountain Majesty
4. Forest Whispers
5. Urban Patterns
6. Desert Solitude
7. Neon Nights
8. Botanical Grace
9. Cosmic Wonder
10. Autumn Reflections
11. Minimalist Dawn
12. Urban Pulse

### 3D Environment

- Professionally lit gallery with chandeliers
- Wall lanterns for ambient lighting
- Wooden easels for each artwork
- Museum benches for viewing
- Natural lighting and shadows

---

## 💻 Available Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint code analysis
pnpm lint --fix   # Fix linting issues automatically
```

| Command | Purpose | Output |
|---------|---------|--------|
| `dev` | Start development server with hot reload | Local server on port 3000 |
| `build` | Create optimized production build | `.next` directory |
| `start` | Serve production build | Production server |
| `lint` | Check code quality | Linting results |

---

## 🎨 Customization & Extension

### Adding 3D Content
```bash
# 1. Prepare your 3D models/images
cp your-assets public/museum-images/

# 2. Update museum page component
# Edit: app/museum/page.tsx

# 3. Configure camera and lighting
# Three.js settings in your scene components
```

### Styling with Tailwind CSS
```javascript
// tailwind.config.js - customize your design system
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color'
      }
    }
  }
}
```

### Environment Variables
Create `.env.local` for local configuration:
```env
NEXT_PUBLIC_API_URL=your_api_url
```

### 3D Scene Configuration
Modify React Three Fiber components in `app/museum/` for:
- Camera positioning
- Lighting setup
- Model loading
- Interaction handlers

---

## 📦 Dependencies Overview

### Production Dependencies
```json
{
  "next": "^16.0.3",              // React framework
  "react": "^19.2.0",             // UI library
  "react-dom": "^19.2.0",         // DOM bindings
  "three": "^0.160.0",            // 3D graphics
  "@react-three/fiber": "^9.0.0", // React <-> Three.js
  "@react-three/drei": "^9.122.0", // Useful helpers
  "framer-motion": "^11.0.0"      // Animation library
}
```

### Development Dependencies
- `typescript` - Static type checking
- `tailwindcss` - CSS framework
- `eslint` - Code quality
- `postcss` - CSS processing

---

## 🚢 Production Deployment

### Vercel (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repository to Vercel
# Visit: https://vercel.com/new

# 3. Deploy automatically on push
# OR manually:
vercel deploy --prod
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Other Platforms
- **Netlify** - Drag & drop deployment
- **AWS Amplify** - Fully managed hosting
- **DigitalOcean** - Container/VPS hosting
- **Heroku** - Platform as a service (limited free tier)

---

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use
```bash
# Use different port
PORT=3001 pnpm dev
```

### Issue: Dependencies Won't Install
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: 3D Content Not Rendering
- ✅ Check WebGL support in browser
- ✅ Verify image paths in `public/` folder
- ✅ Check browser console for errors (F12)
- ✅ Try disabling browser extensions

### Issue: TypeScript Errors
```bash
pnpm lint --fix  # Auto-fix linting issues
```

### Issue: Build Fails
```bash
rm -rf .next     # Clear build cache
pnpm build       # Rebuild
```

---

## 📚 Learning Resources

### Official Documentation
- 📖 [Next.js Docs](https://nextjs.org/docs) - Framework guide
- ⚛️ [React Docs](https://react.dev) - React fundamentals
- 🎲 [Three.js Docs](https://threejs.org/docs) - 3D graphics
- 🎭 [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - R3F guide
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs) - Styling utilities
- ✨ [Framer Motion](https://www.framer.com/motion/) - Animation library
- 🔧 [TypeScript](https://www.typescriptlang.org/docs/) - Type system

### Tutorials & Guides
- Getting started with Three.js
- React Three Fiber basics
- Deploying Next.js applications

---

## 👥 Contributing

We welcome contributions! Here's how to get started:

### Fork & Clone
```bash
git clone https://github.com/YOUR-USERNAME/3d.git
cd 3d
```

### Create Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### Make Changes & Commit
```bash
git add .
git commit -m "feat: add amazing feature"
```

### Push & Create Pull Request
```bash
git push origin feature/amazing-feature
```

### Contribution Guidelines
- Follow existing code style
- Add TypeScript types
- Update documentation
- Test your changes locally
- Keep commits atomic and descriptive

**Thank you for contributing!** 🙏

---

## 📄 License

This project is licensed under the **MIT License**. You're free to use, modify, and distribute this software for personal and commercial projects.

See [LICENSE](LICENSE) file for complete details.

---

## 👨‍💻 Author & Maintainer

<div align="center">

**revyid**

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/revyid)
[![Portfolio](https://img.shields.io/badge/-Portfolio-000?style=flat-square)](https://revyid.com)

</div>

---

## 🤝 Acknowledgments

This project stands on the shoulders of amazing open-source communities:

- **Three.js** - For the powerful 3D graphics library
- **React Three Fiber** - For seamless React integration
- **Next.js & Vercel** - For the modern web framework
- **Tailwind CSS** - For utility-first styling
- **Open Source Community** - For continuous support and feedback

---

## 📞 Support & Contact

### Need Help?
- 🐛 [Report Issues](https://github.com/revyid/3d/issues)
- 💬 [Start Discussions](https://github.com/revyid/3d/discussions)
- 📧 Check GitHub profile for contact info

### Quick Links
- [Project Issues](https://github.com/revyid/3d/issues)
- [Pull Requests](https://github.com/revyid/3d/pulls)
- [Releases](https://github.com/revyid/3d/releases)

---

<div align="center">

### ⭐ If you found this project helpful, please give it a star!

**Built with ❤️ by [revyid](https://github.com/revyid)**

*Using Next.js • React • Three.js • TypeScript • Tailwind CSS*

---

[⬆ Back to top](#-3d-museum-walkthrough-gallery)

</div>
