# JEET LAUNCHER — MASTER LANDING PAGE SPECIFICATION & PROMPT
> **Product**: Jeet Launcher (Rust Native Edition · Minecraft 26.3 / Horizon Engine)  
> **Design Language**: HyperMotion 2026 Kinetic Cyberpunk / Obsidian Glassmorphism  
> **Status**: Ready for Automated Execution  

---

## 1. Executive Concept & Value Proposition

Jeet Launcher is the high-performance desktop launcher engineered for the **Horizon Rust engine (Minecraft 26.3)**. Replacing legacy JVM overhead with native Vulkan 1.3 Multi-Draw pipelines, Jeet Launcher unlocks up to **480+ FPS**, sub-second startup times, integrated **Complementary Unbound shaders**, dual autonomous updater pipelines, and **official Microsoft OAuth2 Device Code authentication** alongside zero-configuration offline play.

The landing page must visually scream speed, precision engineering, and AAA desktop application quality. It must strictly adhere to the **HyperMotion Design Principles**:
* **Never Freeze**: Continuous ambient micro-drifts ($\pm 1\%$ scale, $\pm 2\text{px}$ drift) and kinetic particle flow.
* **Aggressive Kinetic Typography**: Primary hero headlines use $-6^\circ$ skew and multi-layered neon extrusion drop-shadows.
* **Audio-Visual Lock**: Interactive buttons, sliders, and modal triggers trigger synthetic procedural Web Audio SFX (clicks, bass thumps, harmonic chime).
* **Contrast & Legibility**: Dark cosmic background (`#07080c` to `#0d0f17`) with cyan (`#06b6d4`), electric violet (`#a855f7`), and emerald (`#10b981`) accents that never overpower foreground metrics.

---

## 2. Master Generation Prompt (For Direct Execution)

```markdown
Build a production-grade, responsive single-page landing showcase for "Jeet Launcher — Rust Native Edition".

Required Technologies:
- HTML5 + Tailwind CSS (via CDN) + Modern Vanilla JS (ES6+)
- Google Fonts: Plus Jakarta Sans (Display/Body) + JetBrains Mono (Code/Metrics)
- Procedural Web Audio API Sound Synthesizer (Zero external audio file dependencies)
- Canvas-based dynamic background particle and cosmos effect
- Embedded 1080p60 promo video player with neon glow styling and full controls

Key Sections:
1. Top Navigation: Glassmorphic sticky bar with animated brand badge, Live Engine Status indicator (fetching /api/status), navigation links (Features, Benchmarks, Video, Download), and "Launch Web App" CTA.
2. Hero Section:
   - High-impact kinetic typography with -6° skew and multi-layered CSS text-shadow extrusion.
   - Animated subtitle: "THE NEXT-GEN MINECRAFT RUST LAUNCHER".
   - Key highlights badges: "480+ FPS VULKAN ENGINE", "MICROSOFT MSA VERIFIED", "BUILT-IN SHADERS".
   - Dual Call-to-Actions: "Launch Desktop Client" (starts local launcher) and "Watch 60FPS Promo".
   - Live interactive 3D perspective app mockup card with ambient drift.
3. Interactive FPS Benchmark Showdown:
   - Horizon Rust Multi-Draw (480 FPS · 2.08ms frame time) vs Legacy JVM (45 FPS · 22.2ms frame time).
   - Interactive draggable comparison slider revealing real-time rendering statistics, 90% CPU overhead reduction, and instant 0.8s boot time.
4. Embedded Video Showcase:
   - Custom styled 16:9 video frame embedding the 1080p60 HyperMotion promo video.
   - Ambient backlight matching video playback highlights.
5. Core Feature Matrix:
   - Horizon Rust Engine (Native C++/Rust Vulkan 1.3 pipeline).
   - Official Microsoft OAuth2 Device Code Verification & Horizon MSA session generator.
   - Offline & Online Instant Switch (Play locally offline without internet or join Horizon multiplayer).
   - Pre-Configured Complementary Unbound Shaders with real-time toggle.
   - Dual Auto-Updater (Game Engine sync + React UI hot-reload via GitHub).
   - Local Saved Worlds & Mods Manager with 1-click zip backups.
6. Interactive Microsoft Verification Sandbox:
   - Live simulator demonstrating the 8-character device code flow (e.g. WABRX655) and direct link to microsoft.com/link.
7. Technical Architecture & Comparison Table:
   - Feature-by-feature matrix comparing Jeet Launcher vs Mojang Launcher vs Prism/CurseForge.
8. Call To Action & Footer:
   - Instant launch / download actions, GitHub repo link (satyajeetlakra01-blip/jeet-launcher-.git), and system status ping.
```

---

## 3. Visual & Style Token Specification

| Token | Value | Application |
|---|---|---|
| **Background Dark** | `#07080c` to `#0d0f18` | Body cosmos background |
| **Glass Card Surface** | `rgba(20, 24, 38, 0.75)` | Glassmorphism card backings |
| **Glass Border** | `rgba(255, 255, 255, 0.08)` | Subtle border outlines |
| **Cyan Brand** | `#06b6d4` / `#22d3ee` | Horizon Engine, Vulkan, speed highlights |
| **Electric Violet** | `#9333ea` / `#a855f7` | HyperMotion brand identity, buttons |
| **Emerald Accent** | `#10b981` / `#34d399` | Verification, 480 FPS metric, status alive |
| **Headline Skew** | `transform: skewX(-6deg)` | Hero typography kinetic tilt |
| **Extrusion Shadow**| `0 2px 0 #9333ea, 0 4px 0 #7e22ce, 0 10px 25px rgba(147, 51, 234, 0.5)` | 3D Kinetic Text Depth |
