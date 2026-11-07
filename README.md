# ⚡ Jeet Launcher — HyperMotion React Desktop Client (REA)

[![Built with React](https://img.shields.io/badge/Built%20with-React%2019%20(REA)-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Engine](https://img.shields.io/badge/Engine-Horizon%20Rust%2026.3-orange?style=for-the-badge&logo=rust&logoColor=white)](https://playhorizon.dev)
[![GitHub Repository](https://img.shields.io/badge/GitHub-jeet--launcher---181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/satyajeetlakra01-blip/jeet-launcher-.git)

---

## 🚀 Overview

**Jeet Launcher** is a high-performance, modern gaming launcher crafted entirely using **React (REA Architecture)** on the frontend and an asynchronous Node.js / Rust backend bridge. It is tailored for **Horizon (Minecraft Java Edition 26.3 rewritten in pure Rust)** with native Vulkan multi-draw rendering, uncapped framerates (260+ FPS), zero VSync lock, and built-in anti-flicker recording protection for OBS Studio and Discord.

---

## ✨ Key Features

### 1. ⚛️ Built with React 19 (REA Architecture)
- Built completely using **React (REA)** with functional state management (`useState`, `useEffect`).
- Glassmorphism UI styled with **Tailwind CSS** and animated with **HyperMotion** tactile micro-motion principles.
- Crisp vector iconography powered by **Lucide React**.
- Integrated synthesizer-grade **Web Audio API SFX** for tactile button clicks, tabs, toggles, and game launch slams.

### 2. 👤 Dual Login Modes: Offline & Horizon Online
- **🟢 Offline Mode (Instant Play)**:
  - Enter any custom username (e.g. `JeetMaster`, `Spartan`, `Steve`).
  - Saves directly to Horizon's player profile (`horizon-player.txt`).
  - Launches singleplayer worlds and LAN games instantly with zero internet or Microsoft account required.
- **🌐 Online Mode (Horizon Sign-In)**:
  - Sign in with your Horizon / Microsoft Account for authenticated multiplayer servers.
  - Seamless toggle between Offline and Online modes right from the top navigation bar.

### 3. 🔄 Dual Update Pipelines
- **Card 1: Horizon Game Engine Updates (Rust 26.3)**:
  - Checks binary integrity against the official Horizon Rust Nightly registry.
  - One-click synchronization for Vulkan shaders, assets, and engine binaries.
  - Live console streaming of update progress.
- **Card 2: Jeet Launcher React Client Updates (GitHub Repo)**:
  - Direct connection to GitHub: `https://github.com/satyajeetlakra01-blip/jeet-launcher-.git`.
  - Pulls latest React components, Vite bundles, and UI assets with zero manual copying.

### 4. 🎮 Vulkan Shaders & Devil Realm Hardcore Survival
- Built-in one-click toggle for **Complementary Unbound Vulkan Shaders** (r5.9.3) featuring dynamic soft shadows and PBR water reflections.
- Integrated **Devil Realm** hardcore challenge world preset with instant respawn threads and zero input lag.
- **Screen Recording Safe Mode**: Bypasses exclusive fullscreen flicker, allowing 100% clean 60fps streaming in OBS Studio, Discord, and Windows Game Bar.

---

## 🛠️ Project Architecture

```
jeet-launcher/
├── src/
│   ├── App.jsx            # Master React UI (REA Architecture, Tabs, Dashboard, Modals)
│   ├── sound.js           # Tactile Web Audio API sound synthesis engine
│   ├── index.css          # Cyber-grid, glassmorphism, and kinetic typography styles
│   └── main.jsx           # React DOM root entry point
├── public/                # Static public assets
├── server.js              # Asynchronous HTTP API & Rust Horizon engine bridge
├── package.json           # React dependencies (React 19, Lucide React, Vite)
├── vite.config.js         # Vite bundler configuration
└── README.md              # Project documentation
```

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Horizon Engine](https://playhorizon.dev) (Minecraft Java 26.3 in Rust)

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/satyajeetlakra01-blip/jeet-launcher-.git
   cd jeet-launcher-
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build (React Vite)**:
   ```bash
   npm run build
   ```

5. **Start the Launcher**:
   ```bash
   npm start
   ```
   Open your browser or webview to `http://127.0.0.1:38244`.

---

## 📝 GitHub Repository Remote

This project is connected and ready to push to:
```bash
git remote add origin https://github.com/satyajeetlakra01-blip/jeet-launcher-.git
git branch -M main
git push -u origin main
```

---

## ⚖️ License & Acknowledgements

- **Launcher**: Built with ❤️ using **React (REA)** by Satyajeet Lakra.
- **Game Engine**: Horizon (Minecraft Java Edition rewritten in Rust) — Unofficial fan project. Minecraft is a trademark of Mojang Studios and Microsoft.
