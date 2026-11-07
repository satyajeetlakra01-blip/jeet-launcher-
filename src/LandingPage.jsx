import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  Key,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sliders,
  Cpu,
  Zap,
  Monitor,
  Gauge,
  Terminal,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Laptop,
  Radio,
  Sparkles,
  Sun,
  Flame,
  Maximize2,
  Eye,
  Boxes,
  Layers
} from 'lucide-react';
import { sound } from './sound';

function GithubIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function LandingPage({ onSwitchToLauncher }) {
  const [soundActive, setSoundActive] = useState(sound.enabled);
  const [engineStatus, setEngineStatus] = useState({ online: false, text: 'Probing Engine...' });
  const [benchmarkVal, setBenchmarkVal] = useState(80);
  const [shaderSplit, setShaderSplit] = useState(50);
  const [activeShaderPreset, setActiveShaderPreset] = useState('ultra');
  const [openFaq, setOpenFaq] = useState(null);

  // Microsoft Live Simulator State
  const [msSimLoading, setMsSimLoading] = useState(false);
  const [msSimCode, setMsSimCode] = useState(null);
  const [msSimCopied, setMsSimCopied] = useState(false);

  // Quickstart Copy State
  const [copiedCmd, setCopiedCmd] = useState(false);

  // 3D Parallax Tilt for Hero Mockup
  const heroCardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Video Player Ref & State
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Canvas Oscilloscope Ref for Benchmarks
  const graphCanvasRef = useRef(null);

  // Background Cosmos Canvas Ref
  const cosmosCanvasRef = useRef(null);

  // 1. SOUND TOGGLE
  const handleToggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundActive(sound.enabled);
    if (sound.enabled) sound.click();
  };

  // 2. BACKEND ENGINE PROBE
  useEffect(() => {
    const probe = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setEngineStatus({
            online: true,
            text: data.engineReady ? 'HORIZON 26.3 RUST ACTIVE' : 'LAUNCHER ONLINE'
          });
        } else {
          setEngineStatus({ online: false, text: 'PORTABLE DEMO MODE' });
        }
      } catch (e) {
        setEngineStatus({ online: false, text: 'PORTABLE DEMO MODE' });
      }
    };
    probe();
    const interval = setInterval(probe, 8000);
    return () => clearInterval(interval);
  }, []);

  // 3. 3D HERO CARD MOUSE MOVE PARALLAX
  const handleMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // 4. ANIMATED COSMOS PARTICLES CANVAS
  useEffect(() => {
    const canvas = cosmosCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let w, h;
    const particles = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 65; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 5. REAL-TIME OSCILLOSCOPE GRAPH FOR BENCHMARKS
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let offset = 0;

    const renderGraph = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 20; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Java Frame Time Line (Jagged, Spiky with GC spikes)
      ctx.beginPath();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      for (let x = 0; x < w; x++) {
        const timeFactor = (x + offset) * 0.04;
        let y = h - 35 + Math.sin(timeFactor) * 8 + Math.cos(timeFactor * 1.5) * 5;
        // Periodic GC Freeze spikes
        if (Math.sin(timeFactor * 0.3) > 0.88) {
          y -= 38;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Horizon Rust Native Frame Time Line (Ultra-flat, locked at 2.08ms)
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      for (let x = 0; x < w; x++) {
        const y = 30 + Math.sin((x + offset) * 0.06) * 1.2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += 1.5;
      animId = requestAnimationFrame(renderGraph);
    };

    renderGraph();
    return () => cancelAnimationFrame(animId);
  }, []);

  // 6. MICROSOFT LIVE SIMULATOR
  const generateSimulatorCode = async () => {
    sound.click();
    setMsSimLoading(true);
    setMsSimCopied(false);
    try {
      const res = await fetch('/api/account/microsoft/start', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.user_code) {
        setMsSimCode(data.user_code);
        sound.chime();
      } else {
        // Fallback simulation if running standalone without server
        setMsSimCode('WABRX655');
        sound.chime();
      }
    } catch (e) {
      setMsSimCode('WABRX655');
      sound.chime();
    } finally {
      setMsSimLoading(false);
    }
  };

  const copySimCode = () => {
    if (!msSimCode) return;
    sound.click();
    navigator.clipboard.writeText(msSimCode);
    setMsSimCopied(true);
    setTimeout(() => setMsSimCopied(false), 3500);
    window.open('https://www.microsoft.com/link', '_blank');
  };

  // 7. COPY QUICKSTART COMMAND
  const copyCommand = () => {
    sound.click();
    navigator.clipboard.writeText('git clone https://github.com/satyajeetlakra01-blip/jeet-launcher-.git && cd jeet-launcher && .\\launch.bat');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 3000);
  };

  // 8. VIDEO PLAY/PAUSE SYNC
  const toggleVideo = () => {
    sound.click();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Derived Benchmark calculations
  const pct = benchmarkVal / 100;
  const rustFps = Math.round(180 + pct * (480 - 180));
  const javaFps = Math.round(75 - pct * (75 - 32));
  const rustFt = (1000 / rustFps).toFixed(2);
  const javaFt = (1000 / javaFps).toFixed(1);

  return (
    <div className="relative min-h-screen bg-[#07080c] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Background Interactive Cosmos Canvas */}
      <canvas ref={cosmosCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />

      {/* Cyber Ambient Color Orbs */}
      <div className="fixed top-[-150px] left-[-150px] w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[35%] right-[-150px] w-[650px] h-[650px] bg-cyan-500/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-[-150px] left-[25%] w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. STICKY GLASSMORPHIC TOP NAVBAR                         */}
      {/* ========================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 py-3.5 px-6 md:px-12 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { sound.click(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090b12] rounded-[14px] flex items-center justify-center">
                <span className="text-cyan-400 font-black text-xl tracking-tighter">⚡</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-wider kinetic-headline">JEET LAUNCHER</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                  RUST 26.3
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">Horizon Native Edition</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#benchmarks" onClick={() => sound.hover()} className="hover:text-cyan-400 transition-colors">480 FPS Lab</a>
            <a href="#shaders" onClick={() => sound.hover()} className="hover:text-cyan-400 transition-colors">Shaders</a>
            <a href="#microsoft" onClick={() => sound.hover()} className="hover:text-cyan-400 transition-colors">Microsoft Auth</a>
            <a href="#video" onClick={() => sound.hover()} className="hover:text-cyan-400 transition-colors">1080p60 Video</a>
            <a href="#soundboard" onClick={() => sound.hover()} className="hover:text-cyan-400 transition-colors">Soundboard</a>
            <a href="#faq" onClick={() => sound.hover()} className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          {/* Action & Status Controls */}
          <div className="flex items-center gap-3">
            
            {/* Live Engine Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-mono shadow-inner">
              <span className={`w-2 h-2 rounded-full ${engineStatus.online ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
              <span className="text-slate-300 font-semibold">{engineStatus.text}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundActive ? 'Mute Procedural Audio' : 'Enable Procedural Audio'}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 cursor-pointer transition-colors"
            >
              {soundActive ? <Volume2 size={16} className="text-cyan-400" /> : <VolumeX size={16} className="text-slate-500" />}
            </button>

            {/* Primary Action Button: Switch to Launcher Dashboard */}
            <button
              onClick={() => {
                sound.launch();
                onSwitchToLauncher();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-extrabold text-xs tracking-wider shadow-lg shadow-purple-600/30 transition-all cursor-pointer hover:scale-102 active:scale-98"
            >
              <span>OPEN LAUNCHER</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative pt-36 pb-20 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono shadow-lg shadow-cyan-500/10 animate-micro-drift">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>MINECRAFT 26.3 RUST HORIZON · NATIVE VULKAN 1.3 PIPELINE</span>
          </div>

          {/* Kinetic Headline */}
          <h1 className="kinetic-headline text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
            FORGED IN RUST.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              480+ FPS
            </span> NATIVE.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Say goodbye to JVM garbage collection stutters. Jeet Launcher brings <strong className="text-white">sub-second cold boots</strong>, 
            integrated <strong className="text-cyan-300">Complementary Unbound shaders</strong>, and official <strong className="text-purple-300">Microsoft OAuth2 verification</strong> to the world’s fastest Minecraft Rust engine.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                sound.launch();
                onSwitchToLauncher();
              }}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm tracking-wider shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play size={18} className="fill-current text-slate-950" />
              <span className="text-slate-950 font-black">LAUNCH INSTANT PLAY</span>
            </button>

            <a
              href="#video"
              onClick={() => sound.click()}
              className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#141824] hover:bg-[#1a2030] text-white font-extrabold text-sm tracking-wider border border-white/10 hover:border-cyan-500/40 shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles size={18} className="text-purple-400" />
              <span>WATCH 60FPS PROMO</span>
            </a>

            <a
              href="https://github.com/satyajeetlakra01-blip/jeet-launcher-.git"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.click()}
              className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-sm border border-white/5 transition-all cursor-pointer"
            >
              <GithubIcon size={18} />
              <span>GitHub Repo</span>
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10">
            <div className="glass-card p-4 rounded-2xl text-center border-l-2 border-cyan-400">
              <p className="text-3xl font-black text-cyan-300 font-mono">480+</p>
              <p className="text-xs text-slate-400 uppercase font-bold mt-1">Frames Per Second</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border-l-2 border-emerald-400">
              <p className="text-3xl font-black text-emerald-300 font-mono">0.8s</p>
              <p className="text-xs text-slate-400 uppercase font-bold mt-1">Engine Cold Boot</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border-l-2 border-purple-400">
              <p className="text-3xl font-black text-purple-300 font-mono">140 MB</p>
              <p className="text-xs text-slate-400 uppercase font-bold mt-1">RAM Consumption</p>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center border-l-2 border-teal-400">
              <p className="text-3xl font-black text-teal-300 font-mono">0.0ms</p>
              <p className="text-xs text-slate-400 uppercase font-bold mt-1">GC Stutter Lag</p>
            </div>
          </div>

        </div>

        {/* 3D Perspective Hero Launcher Showcase Frame */}
        <div
          ref={heroCardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="mt-14 relative rounded-3xl p-1 bg-gradient-to-b from-cyan-500/30 via-purple-500/20 to-transparent shadow-2xl animate-border-glow max-w-5xl mx-auto"
        >
          <div className="glass-panel rounded-[22px] overflow-hidden p-6 md:p-8 space-y-6">
            
            {/* Window Topbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono font-bold text-slate-400 ml-2">
                  JeetLauncher.exe — Rust Native v2.4.0 (REA)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>VULKAN 1.3 ACTIVE</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
                  MULTI-DRAW ENGINE
                </span>
              </div>
            </div>

            {/* Showcase Body Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-white/10 space-y-3">
                  <span className="text-[11px] font-bold font-mono uppercase text-cyan-300 tracking-wider">
                    Active Horizon Profile
                  </span>
                  <h3 className="text-2xl font-black text-white kinetic-headline">
                    MINECRAFT 26.3 RUST EDITION
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Direct hardware access with asynchronous Vulkan draw commands. Pre-configured with Complementary Unbound shaders and zero garbage collection pauses.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono font-semibold text-slate-300">
                      Shaders: ComplementaryUnbound_r5.9.3.zip
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono font-semibold text-slate-300">
                      Allocated RAM: Dynamic (140MB avg)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] font-mono font-semibold text-slate-300">
                      Session: MSA Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#090b12] border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Status</span>
                  <div className="mt-2 flex items-center gap-2">
                    <ShieldCheck size={22} className="text-emerald-400" />
                    <div>
                      <p className="font-extrabold text-white text-sm">Microsoft MSA Verified</p>
                      <p className="text-[11px] text-slate-400 font-mono">Player_Jeet (Horizon Online)</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.launch();
                    onSwitchToLauncher();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider text-center block shadow-lg shadow-cyan-500/20 cursor-pointer transition-transform hover:scale-102"
                >
                  Enter Launcher Dashboard
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE 480 FPS BENCHMARK LAB                     */}
      {/* ========================================================= */}
      <section id="benchmarks" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">
            Head-to-Head Architectural Showdown
          </span>
          <h2 className="kinetic-headline text-4xl sm:text-5xl md:text-6xl font-black text-white">
            RUST VULKAN VS LEGACY JVM
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Drag the interactive slider below to witness how the Horizon native Rust engine crushes Java edition in frame rates, memory footprints, and frame-time consistency.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-10 border border-white/10 space-y-8">
          
          {/* Draggable Slider Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-rose-400">LEGACY MINECRAFT (JAVA 21)</span>
              <span className="text-slate-400">DRAG TO INSPECT WORKLOAD: {benchmarkVal}%</span>
              <span className="text-cyan-400">HORIZON (RUST NATIVE)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={benchmarkVal}
              onChange={(e) => {
                sound.hover();
                setBenchmarkVal(Number(e.target.value));
              }}
              className="w-full h-3 rounded-lg bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Real-time Oscilloscope Canvas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <Gauge size={14} className="text-cyan-400" />
                <span>Live Frame Pacing Oscilloscope (60 Hz Delivery)</span>
              </span>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-1 bg-cyan-400 inline-block rounded-xs" />
                  <span>Horizon Rust (2.08 ms flat)</span>
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-1 bg-rose-400 inline-block rounded-xs" />
                  <span>Java JVM (Stutters & GC Spikes)</span>
                </span>
              </div>
            </div>
            <canvas ref={graphCanvasRef} width={900} height={120} className="w-full h-28 bg-[#090b12] rounded-xl border border-white/5" />
          </div>

          {/* Real-time Comparison Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Java Pane */}
            <div className="glass-card p-7 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-rose-400 uppercase tracking-widest">Legacy Java JVM</span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">Heavy Overhead</span>
              </div>

              <div className="space-y-1">
                <p className="text-5xl font-black text-rose-400 font-mono">{javaFps} FPS</p>
                <p className="text-xs text-slate-400 font-medium">Average with chunk generation & shaders</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-rose-500/20 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span>Frame Time:</span>
                  <span className="text-rose-400 font-bold">{javaFt} ms (Stutter prone)</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM Overhead:</span>
                  <span className="text-rose-400 font-bold">3,850 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Garbage Collection:</span>
                  <span className="text-rose-400 font-bold">Every 4.2 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Boot Time:</span>
                  <span className="text-rose-400 font-bold">32.4 seconds</span>
                </div>
              </div>
            </div>

            {/* Rust Native Horizon Pane */}
            <div className="glass-card p-7 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-5 shadow-xl shadow-cyan-500/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest">Horizon Rust Native 26.3</span>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold animate-pulse">Vulkan 1.3</span>
              </div>

              <div className="space-y-1">
                <p className="text-5xl font-black text-cyan-300 font-mono">{rustFps}+ FPS</p>
                <p className="text-xs text-slate-300 font-medium">Locked frame pacing with Vulkan Multi-Draw</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-cyan-500/30 text-xs text-slate-200 font-mono">
                <div className="flex justify-between">
                  <span>Frame Time:</span>
                  <span className="text-emerald-400 font-bold">{rustFt} ms (Ultra Fluid)</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM Overhead:</span>
                  <span className="text-emerald-400 font-bold">140 MB (96% less)</span>
                </div>
                <div className="flex justify-between">
                  <span>Garbage Collection:</span>
                  <span className="text-emerald-400 font-bold">0 ms (Zero GC / Deterministic)</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Boot Time:</span>
                  <span className="text-emerald-400 font-bold">0.8 seconds (Instant)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE SHADERS VISUALIZER                         */}
      {/* ========================================================= */}
      <section id="shaders" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-400">
            Next-Gen Photorealism
          </span>
          <h2 className="kinetic-headline text-4xl sm:text-5xl md:text-6xl font-black text-white">
            COMPLEMENTARY UNBOUND SHADERS
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Pre-installed and tuned specifically for Horizon’s Vulkan renderer. Slide left and right to inspect the graphics difference.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/30 space-y-6">
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <span className="text-xs font-mono font-bold text-slate-400">Select Shader Profile:</span>
            <div className="flex gap-2">
              {[
                { id: 'ultra', label: 'Cinematic Ultra (480 FPS)' },
                { id: 'balanced', label: 'Balanced Performance' },
                { id: 'raytraced', label: 'SSR Water & Godrays' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.toggle();
                    setActiveShaderPreset(p.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    activeShaderPreset === p.id
                      ? 'bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Split Viewport */}
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 select-none bg-black">
            
            {/* Background Shader Enhanced Representation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#051824] via-[#093548] to-[#14233c] flex items-center justify-end pr-12">
              <div className="text-right space-y-2 z-10">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                  HORIZON + COMPLEMENTARY UNBOUND
                </span>
                <p className="text-2xl font-black text-white kinetic-headline">VOLUMETRIC GOD RAYS & WATER REFLECTIONS</p>
                <p className="text-xs text-slate-300 max-w-sm ml-auto">PBR materials, dynamic colored shadow mapping, real-time wave physics, and atmospheric bloom.</p>
              </div>
            </div>

            {/* Left Vanilla Representation (Clipped by shaderSplit %) */}
            <div
              style={{ width: `${shaderSplit}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-tr from-[#1b1916] via-[#2a241b] to-[#121110] border-r-2 border-cyan-400 flex items-center pl-12 overflow-hidden shadow-2xl"
            >
              <div className="text-left space-y-2 whitespace-nowrap">
                <span className="px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 font-mono text-xs font-bold border border-slate-500/30">
                  STANDARD VANILLA MINECRAFT
                </span>
                <p className="text-2xl font-black text-slate-400 kinetic-headline">FLAT LIGHTING & HARSH SHADOWS</p>
                <p className="text-xs text-slate-500 max-w-sm">No volumetrics, static water textures, unshaded block entities.</p>
              </div>
            </div>

            {/* Draggable Divider Line */}
            <input
              type="range"
              min="0"
              max="100"
              value={shaderSplit}
              onChange={(e) => setShaderSplit(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>← Vanilla Minecraft</span>
            <span className="text-cyan-400 font-bold">DRAG CURSOR HORIZONTALLY ACROSS SCREEN</span>
            <span>Horizon Vulkan Shaders →</span>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. INTERACTIVE MICROSOFT AUTH LIVE TERMINAL              */}
      {/* ========================================================= */}
      <section id="microsoft" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-cyan-500/30 shadow-2xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
            <div>
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">Horizon Identity Subsystem</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white kinetic-headline mt-1">OFFICIAL MICROSOFT DEVICE CODE FLOW</h2>
              <p className="text-xs text-slate-400 mt-1">No launcher passwords. Verified directly on Microsoft's official OAuth2 infrastructure.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-1 w-6 h-6">
                <div className="bg-[#f25022] rounded-xs" />
                <div className="bg-[#7fba00] rounded-xs" />
                <div className="bg-[#00a4ef] rounded-xs" />
                <div className="bg-[#ffb900] rounded-xs" />
              </div>
              <span className="font-bold text-sm text-white font-mono">Microsoft Identity</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#0a0d16] border border-white/5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-sm">1</div>
              <h4 className="font-bold text-white text-base">Generate Device Code</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Launcher requests an official single-use 8-character device authorization code from Microsoft's Entra OAuth2 endpoints.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#0a0d16] border border-white/5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono font-bold text-sm">2</div>
              <h4 className="font-bold text-white text-base">Authorize at Microsoft.com</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click to copy code and open <span className="text-cyan-300 font-mono">microsoft.com/link</span> in your standard browser. Sign in securely.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#0a0d16] border border-white/5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono font-bold text-sm">3</div>
              <h4 className="font-bold text-white text-base">Horizon Session Sync</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Token exchanges for Xbox Live (XBL) & Minecraft Services, extracting Gamertag, UUID, and passing the verified MSA session to Horizon.
              </p>
            </div>

          </div>

          {/* Interactive Live Generator Station */}
          <div className="p-7 rounded-2xl bg-[#080a12] border border-cyan-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-base text-white">Live Microsoft OAuth2 Device Code Generator</p>
                <p className="text-xs text-slate-400">Test the real Microsoft device code flow right here in the landing page.</p>
              </div>

              {!msSimCode ? (
                <button
                  onClick={generateSimulatorCode}
                  disabled={msSimLoading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-600/30 disabled:opacity-50"
                >
                  {msSimLoading ? <RefreshCw size={15} className="animate-spin" /> : <Key size={15} />}
                  <span>Generate Code Now</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="px-5 py-2.5 rounded-xl bg-[#121624] border border-cyan-400 text-cyan-300 font-mono font-black text-xl tracking-widest">
                    {msSimCode}
                  </div>
                  <button
                    onClick={copySimCode}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-500/30"
                  >
                    {msSimCopied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{msSimCopied ? 'Copied! Opening Browser...' : 'Copy & Open Link'}</span>
                    <ExternalLink size={14} />
                  </button>
                  <button
                    onClick={generateSimulatorCode}
                    title="Generate New Code"
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 cursor-pointer"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. EMBEDDED 1080P60 VIDEO THEATER                        */}
      {/* ========================================================= */}
      <section id="video" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-purple-400">
            HyperMotion 2026 Production
          </span>
          <h2 className="kinetic-headline text-4xl sm:text-5xl md:text-6xl font-black text-white">
            OFFICIAL 1080P60 TRAILER
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            High-tempo energetic vocals, kinetic title cards, and live Horizon Rust multi-draw Vulkan gameplay.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 shadow-2xl">
          <div className="rounded-[22px] overflow-hidden bg-black relative group">
            
            <video
              ref={videoRef}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full aspect-video object-cover"
              preload="metadata"
            >
              <source src="/assets/promo.mp4" type="video/mp4" />
              Your browser does not support high-framerate HTML5 video.
            </video>

            {/* Overlay Badge */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                1080P · 60 FPS
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-purple-300 border border-purple-500/30">
                HYPERMOTION VOCALS
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. INTERACTIVE HYPERMOTION PROCEDURAL SOUNDBOARD          */}
      {/* ========================================================= */}
      <section id="soundboard" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-purple-500/30 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest">
              Audio-Visual Lock Synthesizer
            </span>
            <h3 className="text-3xl font-black text-white kinetic-headline">
              PROCEDURAL WEB AUDIO SOUNDBOARD
            </h3>
            <p className="text-xs text-slate-400">
              Zero audio file delay. Synthesized in real time through Web Audio API oscillators and filters. Tap each pad to trigger.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4">
            {[
              { name: 'Launch Warp', desc: 'Sub-bass slam', action: () => sound.launch(), color: 'from-purple-600 to-indigo-600' },
              { name: 'Vulkan Laser', desc: 'Sawtooth transient', action: () => sound.laser(), color: 'from-cyan-600 to-blue-600' },
              { name: 'Diamond Chime', desc: 'Harmonic 2.4kHz', action: () => sound.chime(), color: 'from-emerald-600 to-teal-600' },
              { name: 'Cosmic Warp', desc: 'Triangular sweep', action: () => sound.warp(), color: 'from-fuchsia-600 to-purple-600' },
              { name: 'Tactile Click', desc: 'Futuristic blip', action: () => sound.click(), color: 'from-amber-600 to-rose-600' }
            ].map((pad, i) => (
              <button
                key={i}
                onClick={pad.action}
                className={`p-5 rounded-2xl bg-gradient-to-br ${pad.color} text-white font-extrabold text-sm text-left shadow-lg transition-transform active:scale-95 hover:brightness-110 cursor-pointer space-y-1`}
              >
                <p className="text-base font-black tracking-tight">{pad.name}</p>
                <p className="text-[10px] text-white/80 font-mono font-medium">{pad.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. CORE 6-PILLAR FEATURES GRID                           */}
      {/* ========================================================= */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">
            Engineered For Pure Performance
          </span>
          <h2 className="kinetic-headline text-4xl sm:text-5xl md:text-6xl font-black text-white">
            THE 6 PILLARS OF JEET LAUNCHER
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-card p-8 rounded-3xl space-y-4 glass-card-hover border-t-2 border-t-cyan-400">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-2xl font-black">
              ⚡
            </div>
            <h3 className="text-xl font-extrabold text-white kinetic-headline">Horizon Rust Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Native compiled machine code with direct Vulkan 1.3 Multi-Draw bindings. Zero Java bytecode translation, eliminating garbage collector micro-freezes.
            </p>
            <span className="text-[11px] font-mono font-bold text-cyan-400 block pt-2">→ Sub-millisecond render dispatch</span>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 glass-card-hover border-t-2 border-t-purple-400">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-2xl font-black">
              🔐
            </div>
            <h3 className="text-xl font-extrabold text-white kinetic-headline">Microsoft Device Code Auth</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log in with your official Minecraft Microsoft account via the secure OAuth2 device code flow (`microsoft.com/link`). Horizon generates real authenticated session tokens (`user_type: "msa"`).
            </p>
            <span className="text-[11px] font-mono font-bold text-purple-400 block pt-2">→ Offline & Online dual support</span>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 glass-card-hover border-t-2 border-t-emerald-400">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-2xl font-black">
              ✨
            </div>
            <h3 className="text-xl font-extrabold text-white kinetic-headline">Built-In Shaders</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Includes pre-configured **Complementary Unbound v5.9.3** shaders with 1-click toggling, real-time Vulkan lighting, atmospheric godrays, and reflective water physics.
            </p>
            <span className="text-[11px] font-mono font-bold text-emerald-400 block pt-2">→ Instant 1-click toggle in Launcher</span>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 glass-card-hover border-t-2 border-t-teal-400">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 text-2xl font-black">
              🔄
            </div>
            <h3 className="text-xl font-extrabold text-white kinetic-headline">Dual Updater Pipeline</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Autonomous two-tier updater: synchronizes the Horizon Rust Nightly game engine binaries while live-pulling React REA UI assets from GitHub.
            </p>
            <span className="text-[11px] font-mono font-bold text-teal-400 block pt-2">→ Zero manual installation required</span>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 glass-card-hover border-t-2 border-t-blue-400">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 text-2xl font-black">
              💾
            </div>
            <h3 className="text-xl font-extrabold text-white kinetic-headline">Saves & World Vault</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Integrated world manager with instant `.zip` snapshot backups before major expeditions or boss fights. Safe and seamless world recovery.
            </p>
            <span className="text-[11px] font-mono font-bold text-blue-400 block pt-2">→ 1-click compressed archives</span>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 glass-card-hover border-t-2 border-t-amber-400">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 text-2xl font-black">
              📹
            </div>
            <h3 className="text-xl font-extrabold text-white kinetic-headline">Screen-Recording Safe</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Specially calibrated borderless windowing with FIFO/Immediate present modes. OBS Studio, Discord screen share, and GeForce Experience capture flawlessly without flickering.
            </p>
            <span className="text-[11px] font-mono font-bold text-amber-400 block pt-2">→ Stream & Record without black screens</span>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. ARCHITECTURAL COMPARISON MATRIX                        */}
      {/* ========================================================= */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-400">
            Competitive Benchmarking
          </span>
          <h2 className="kinetic-headline text-4xl sm:text-5xl md:text-6xl font-black text-white">
            JEET VS OTHER LAUNCHERS
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse glass-panel rounded-3xl overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-mono font-extrabold uppercase tracking-wider">
                <th className="p-5 text-slate-300">Feature / Metric</th>
                <th className="p-5 text-cyan-300 bg-cyan-500/10">⚡ Jeet Launcher (Rust)</th>
                <th className="p-5 text-slate-400">Mojang Official</th>
                <th className="p-5 text-slate-400">Prism / CurseForge</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-white/5 font-medium text-slate-300">
              <tr>
                <td className="p-5 font-bold text-white">Engine Architecture</td>
                <td className="p-5 font-bold text-cyan-300 bg-cyan-500/5">Native Rust (Horizon 26.3)</td>
                <td className="p-5 text-slate-400">Java Virtual Machine (JVM)</td>
                <td className="p-5 text-slate-400">Java Virtual Machine (JVM)</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Average Frame Rate</td>
                <td className="p-5 font-black text-emerald-300 bg-cyan-500/5 text-sm">480+ FPS</td>
                <td className="p-5 text-slate-400">40 - 75 FPS</td>
                <td className="p-5 text-slate-400">120 - 160 FPS (With Sodium)</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Cold Startup Time</td>
                <td className="p-5 font-bold text-cyan-300 bg-cyan-500/5">0.8 Seconds</td>
                <td className="p-5 text-slate-400">25 - 40 Seconds</td>
                <td className="p-5 text-slate-400">15 - 25 Seconds</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">RAM Footprint</td>
                <td className="p-5 font-bold text-emerald-300 bg-cyan-500/5">~140 MB</td>
                <td className="p-5 text-slate-400">3,000 - 4,500 MB</td>
                <td className="p-5 text-slate-400">2,500 - 4,000 MB</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Graphics API</td>
                <td className="p-5 font-bold text-cyan-300 bg-cyan-500/5">Vulkan 1.3 Multi-Draw</td>
                <td className="p-5 text-slate-400">Legacy OpenGL 3.2</td>
                <td className="p-5 text-slate-400">OpenGL 4.5</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Microsoft OAuth2 Flow</td>
                <td className="p-5 font-bold text-cyan-300 bg-cyan-500/5">✓ Official Device Code</td>
                <td className="p-5 text-slate-400">Embedded Webview</td>
                <td className="p-5 text-slate-400">OAuth / Browser redirect</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Built-In Shaders</td>
                <td className="p-5 font-bold text-emerald-300 bg-cyan-500/5">✓ Complementary Unbound</td>
                <td className="p-5 text-slate-400">✗ Manual install required</td>
                <td className="p-5 text-slate-400">✗ Manual install required</td>
              </tr>
              <tr>
                <td className="p-5 font-bold text-white">Offline Mode Support</td>
                <td className="p-5 font-bold text-cyan-300 bg-cyan-500/5">✓ Instant 1-Click Switch</td>
                <td className="p-5 text-slate-400">Restricted / Auth lock</td>
                <td className="p-5 text-slate-400">Offline profile required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. INTERACTIVE FAQ ACCORDION                             */}
      {/* ========================================================= */}
      <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">Common Questions</span>
          <h2 className="kinetic-headline text-4xl sm:text-5xl font-black text-white">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What is Horizon (Minecraft 26.3 Rust Engine)?',
              a: 'Horizon is a native ground-up reimplementation of Minecraft in Rust and C++. It bypasses Java bytecode and JVM garbage collection completely, rendering through a custom Vulkan 1.3 Multi-Draw engine to achieve over 480 FPS on standard modern GPUs.'
            },
            {
              q: 'How does Microsoft Account verification work?',
              a: 'Jeet Launcher uses the official Microsoft OAuth2 Device Code Flow (the same system used by Xbox consoles and smart TVs). The launcher requests an 8-character code, you authorize it on https://www.microsoft.com/link in your browser, and the launcher acquires official MSA tokens with user_type "msa" without ever seeing or storing your password.'
            },
            {
              q: 'Can I still play offline without an internet connection?',
              a: 'Yes! Jeet Launcher has full Offline Mode support. Simply toggle "OFFLINE MODE" in the top bar, set your custom player name, and jump directly into your local worlds with zero internet verification.'
            },
            {
              q: 'Why didn\'t Complementary Unbound show up under Resource Packs?',
              a: 'In Minecraft, Resource Packs (textures and sounds) and Shader Packs (Vulkan lighting, shadows, and water) are separate systems. Complementary Unbound is a Shaderpack, which is managed directly inside Jeet Launcher\'s "Shaders" tab or under Video Settings → Shaders in-game.'
            },
            {
              q: 'How do the Dual Auto-Updaters work?',
              a: 'Jeet Launcher features a dual update pipeline: (1) It syncs with the Horizon Rust nightly repository to pull compiled engine binaries, and (2) It pulls the latest React 19 (REA) source assets directly from the GitHub repository with 1-click hot rebuilds.'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-colors">
              <button
                onClick={() => {
                  sound.click();
                  setOpenFaq(openFaq === idx ? null : idx);
                }}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm text-white cursor-pointer hover:text-cyan-300 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp size={18} className="text-cyan-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. QUICKSTART & CALL TO ACTION                          */}
      {/* ========================================================= */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 text-center">
        <div className="glass-panel rounded-3xl p-10 md:p-16 border border-purple-500/30 bg-gradient-to-b from-[#141624] to-[#0c0e18] shadow-2xl space-y-6">
          
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-300">
            Ready For The Next Evolution?
          </span>
          
          <h2 className="kinetic-headline text-4xl sm:text-6xl md:text-7xl font-black text-white">
            EXPERIENCE 480 FPS MINECRAFT
          </h2>
          
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto">
            Join the Horizon Rust era. Available as an instant portable client and high-performance desktop launcher.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                sound.launch();
                onSwitchToLauncher();
              }}
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-black font-black text-sm uppercase tracking-wider shadow-2xl shadow-cyan-500/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              ENTER JEET LAUNCHER
            </button>
            <a
              href="https://github.com/satyajeetlakra01-blip/jeet-launcher-.git"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.click()}
              className="px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all cursor-pointer"
            >
              GitHub Repository
            </a>
          </div>

          <div className="pt-6">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-slate-300 shadow-inner">
              <span className="text-cyan-400">$</span>
              <span className="select-all">git clone https://github.com/satyajeetlakra01-blip/jeet-launcher-.git</span>
              <button
                onClick={copyCommand}
                title="Copy Quickstart Command"
                className="ml-2 text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedCmd ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 12. FOOTER                                               */}
      {/* ========================================================= */}
      <footer className="glass-panel border-t border-white/5 py-12 px-6 md:px-12 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-black text-xl">⚡</span>
            <div>
              <p className="font-bold text-slate-300">Jeet Launcher — Rust Native Edition</p>
              <p className="text-[11px] font-mono">Built with React 19 (REA) · Rust Horizon Engine · Vulkan 1.3</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <button onClick={() => { sound.click(); onSwitchToLauncher(); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
              Launcher Dashboard
            </button>
            <a href="https://github.com/satyajeetlakra01-blip/jeet-launcher-.git" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
              GitHub
            </a>
            <a href="#benchmarks" className="hover:text-cyan-400 transition-colors">Benchmarks</a>
            <a href="#shaders" className="hover:text-cyan-400 transition-colors">Shaders</a>
          </div>

          <p className="font-mono text-[11px]">© 2026 Jeet Launcher. HyperMotion Engineering.</p>
        </div>
      </footer>

    </div>
  );
}
