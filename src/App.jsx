import React, { useState, useEffect } from 'react';
import {
  Play,
  Globe,
  Boxes,
  Palette,
  Settings,
  RefreshCw,
  FolderOpen,
  Plus,
  Trash2,
  Archive,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Gauge,
  Zap,
  Sliders,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Flame,
  Check,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Sun,
  Eye,
  User,
  Lock,
  Unlock,
  Shield,
  Laptop,
  Radio,
  GitBranch,
  Github
} from 'lucide-react';
import { sound } from './sound';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootText, setBootText] = useState('POWERING UP HYPER-ENGINE...');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [activeTab, setActiveTab] = useState('play');
  const [status, setStatus] = useState({ engineReady: false, gameRunning: false, version: 'Loading...' });
  const [account, setAccount] = useState({
    mode: 'offline', // 'offline' or 'online'
    username: 'Player_Jeet',
    isOnlineAuth: false,
    authEmail: ''
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [playerNameInput, setPlayerNameInput] = useState('Player_Jeet');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [onlineEmailInput, setOnlineEmailInput] = useState('');

  const [worlds, setWorlds] = useState([]);
  const [mods, setMods] = useState([]);
  const [packs, setPacks] = useState([]);
  const [shaderPacks, setShaderPacks] = useState([]);
  const [activeShader, setActiveShader] = useState('');
  const [settings, setSettings] = useState({
    screenRecordingSafe: true,
    fullscreen: false,
    renderDistance: 8,
    simulationDistance: 6,
    overlay: 'precise',
    presentMode: 'immediate',
    culling: true,
    enableVsync: false,
    pickedShaderPack: ''
  });

  const [selectedWorld, setSelectedWorld] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [isSlamming, setIsSlamming] = useState(false);
  const [toast, setToast] = useState(null);

  const [showCreateWorld, setShowCreateWorld] = useState(false);
  const [newWorldName, setNewWorldName] = useState('Devil Realm');
  const [newWorldDiff, setNewWorldDiff] = useState('hard');

  const [gameUpdateLogs, setGameUpdateLogs] = useState('Horizon Engine Update Service Ready.\nClick "Check Engine Updates" to verify binary hashes with the Rust backend.');
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [launcherUpdateLogs, setLauncherUpdateLogs] = useState('Jeet Launcher Git Update Service Ready.\nConnected to: https://github.com/satyajeetlakra01-blip/jeet-launcher-.git\nFramework: React 19 (REA) + Vite + Tailwind CSS\nBranch: main');
  const [isLauncherUpdating, setIsLauncherUpdating] = useState(false);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    let p = 0;
    const bootSteps = [
      { at: 15, text: 'SCANNING INTEL CPU & THREAD MATRIX...' },
      { at: 35, text: 'INITIALIZING VULKAN MULTI-DRAW PIPELINE...' },
      { at: 55, text: 'UNBINDING 60HZ CAP · ACTIVATING IMMEDIATE MODE...' },
      { at: 75, text: 'CALIBRATING BORDERLESS SCREEN-RECORDING HOOK...' },
      { at: 90, text: 'SYNCHRONIZING SHADER & DEVIL REALM ASSETS...' },
      { at: 100, text: 'JEET LAUNCHER HYPER-ENGINE ACTIVE' }
    ];

    const timer = setInterval(() => {
      p += 3;
      if (p > 100) p = 100;
      setBootProgress(p);

      const step = bootSteps.find((s) => s.at <= p && p < s.at + 20);
      if (step) setBootText(step.text);

      if (p >= 100) {
        clearInterval(timer);
        sound.launch();
        setTimeout(() => setIsBooting(false), 550);
      }
    }, 45);

    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    if (type === 'error') sound.toggle(false);
    else sound.click();
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAccount = async () => {
    try {
      const res = await fetch('/api/account');
      const data = await res.json();
      setAccount(data);
      setPlayerNameInput(data.username || 'Player_Jeet');
    } catch (e) {}
  };

  const handleSavePlayerName = async () => {
    sound.click();
    if (!playerNameInput.trim()) return;
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: playerNameInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        setIsEditingName(false);
        showToast(`Player username set to "${data.account.username}"!`);
      }
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleToggleMode = async (newMode) => {
    sound.toggle(true);
    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        showToast(`Game profile switched to ${newMode.toUpperCase()} Mode!`);
      }
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleOnlineLogin = async () => {
    sound.launch();
    if (!onlineEmailInput.trim()) {
      showToast('Please enter your Horizon account email or username', 'error');
      return;
    }
    try {
      const res = await fetch('/api/account/login-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: onlineEmailInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        setShowLoginModal(false);
        showToast(data.message);
      } else {
        showToast(data.error || 'Login failed', 'error');
      }
    } catch (e) {
      showToast('Login error: ' + e.message, 'error');
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
      if (data.account) setAccount(data.account);
    } catch (e) {}
  };

  const fetchWorlds = async () => {
    try {
      const res = await fetch('/api/worlds');
      const data = await res.json();
      setWorlds(data.worlds || []);
      if (data.worlds && data.worlds.length > 0 && !selectedWorld) {
        setSelectedWorld(data.worlds[0].name);
      }
    } catch (e) {}
  };

  const fetchMods = async () => {
    try {
      const res = await fetch('/api/mods');
      const data = await res.json();
      setMods(data.mods || []);
    } catch (e) {}
  };

  const fetchPacks = async () => {
    try {
      const res = await fetch('/api/packs');
      const data = await res.json();
      setPacks(data.packs || []);
      setShaderPacks(data.shaderPacks || []);
      setActiveShader(data.activeShader || '');
    } catch (e) {}
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchAccount();
    fetchStatus();
    fetchWorlds();
    fetchMods();
    fetchPacks();
    fetchSettings();

    const interval = setInterval(() => {
      fetchStatus();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchGame = async () => {
    sound.launch();
    setIsSlamming(true);
    setIsLaunching(true);

    setTimeout(() => setIsSlamming(false), 450);

    try {
      const res = await fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          world: selectedWorld,
          mode: account.mode,
          playerName: account.username
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Rust Minecraft Engine running in [${(data.mode || 'offline').toUpperCase()}] mode!`);
        fetchStatus();
      } else {
        showToast('Launch failed: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    } finally {
      setTimeout(() => setIsLaunching(false), 2500);
    }
  };

  const handleCheckGameUpdate = async () => {
    sound.click();
    setIsGameUpdating(true);
    setGameUpdateLogs((prev) => prev + '\n>>> Querying Horizon Rust engine release registry...');
    try {
      const res = await fetch('/api/updates/game/check');
      const data = await res.json();
      setGameUpdateLogs((prev) => prev + '\n' + (data.output || 'Horizon Rust engine verified.'));
      showToast('Game engine verified!');
    } catch (e) {
      setGameUpdateLogs((prev) => prev + '\nError: ' + e.message);
    } finally {
      setIsGameUpdating(false);
    }
  };

  const handleRunGameUpdate = async () => {
    sound.launch();
    setIsGameUpdating(true);
    setGameUpdateLogs((prev) => prev + '\n>>> Synchronizing Horizon 26.3 Rust Vulkan binaries...');
    try {
      const res = await fetch('/api/updates/game/run', { method: 'POST' });
      const data = await res.json();
      setGameUpdateLogs((prev) => prev + '\n' + (data.output || 'Update completed successfully!'));
      showToast('Horizon engine updated!');
    } catch (e) {
      setGameUpdateLogs((prev) => prev + '\nUpdate failed: ' + e.message);
    } finally {
      setIsGameUpdating(false);
    }
  };

  const handleCheckLauncherUpdate = async () => {
    sound.click();
    setIsLauncherUpdating(true);
    setLauncherUpdateLogs((prev) => prev + '\n>>> Querying GitHub remote repository...');
    try {
      const res = await fetch('/api/updates/launcher/check');
      const data = await res.json();
      setLauncherUpdateLogs((prev) => prev + '\n' + (data.output || 'Launcher is at the latest release.'));
      showToast('Launcher repo checked!');
    } catch (e) {
      setLauncherUpdateLogs((prev) => prev + '\nError: ' + e.message);
    } finally {
      setIsLauncherUpdating(false);
    }
  };

  const handleRunLauncherUpdate = async () => {
    sound.launch();
    setIsLauncherUpdating(true);
    setLauncherUpdateLogs((prev) => prev + '\n>>> Synchronizing React web bundle and Git state...');
    try {
      const res = await fetch('/api/updates/launcher/run', { method: 'POST' });
      const data = await res.json();
      setLauncherUpdateLogs((prev) => prev + '\n' + (data.output || 'Launcher updated successfully!'));
      showToast('Jeet Launcher updated!');
    } catch (e) {
      setLauncherUpdateLogs((prev) => prev + '\nUpdate failed: ' + e.message);
    } finally {
      setIsLauncherUpdating(false);
    }
  };

  const handleTabChange = (id) => {
    sound.tab();
    setActiveTab(id);
  };

  const handleCreateWorld = async () => {
    sound.click();
    if (!newWorldName.trim()) return;
    try {
      const res = await fetch('/api/worlds/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorldName, difficulty: newWorldDiff })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateWorld(false);
        fetchWorlds();
        setSelectedWorld(newWorldName);
        showToast(`Created world "${newWorldName}"!`);
      } else {
        showToast(data.error || 'Failed to create world', 'error');
      }
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleDeleteWorld = async (name) => {
    sound.click();
    if (!confirm(`Are you sure you want to delete "${name}" permanently?`)) return;
    try {
      await fetch('/api/worlds/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      fetchWorlds();
      showToast(`Deleted world "${name}"`);
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleBackupWorld = async (name) => {
    sound.click();
    try {
      showToast(`Zipping backup for "${name}"...`, 'info');
      const res = await fetch('/api/worlds/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Backup saved to ${data.path}`);
      } else {
        showToast('Backup failed: ' + data.error, 'error');
      }
    } catch (e) {
      showToast('Backup error: ' + e.message, 'error');
    }
  };

  const handleToggleMod = async (name) => {
    sound.toggle(true);
    try {
      await fetch('/api/mods/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      fetchMods();
    } catch (e) {}
  };

  const handleDeleteMod = async (name) => {
    sound.click();
    if (!confirm(`Delete mod "${name}"?`)) return;
    try {
      await fetch('/api/mods/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      fetchMods();
      showToast(`Removed mod "${name}"`);
    } catch (e) {}
  };

  const handleToggleShader = async (name) => {
    sound.toggle(true);
    try {
      const res = await fetch('/api/shaderpacks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      setActiveShader(data.activeShader || '');
      fetchPacks();
      showToast(data.activeShader ? `Shader pack "${name}" turned ON!` : `Shader pack turned OFF`);
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleDeletePack = async (name) => {
    sound.click();
    if (!confirm(`Delete pack "${name}"?`)) return;
    try {
      await fetch('/api/packs/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      fetchPacks();
      showToast(`Removed pack "${name}"`);
    } catch (e) {}
  };

  const handleSaveSettings = async () => {
    sound.click();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      showToast('Hyper Performance & Engine Settings Applied!');
    } catch (e) {
      showToast('Failed to save settings: ' + e.message, 'error');
    }
  };

  const handleOpenFolder = async (type) => {
    sound.click();
    try {
      await fetch('/api/open-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
    } catch (e) {}
  };

  // Boot sequence animation overlay
  if (isBooting) {
    return (
      <div className="relative w-screen h-screen bg-[#07080b] flex flex-col items-center justify-center overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] select-none">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#9333ea] via-[#3b82f6] to-[#06b6d4] p-[2px] shadow-2xl shadow-purple-500/30 animate-float">
              <div className="w-full h-full bg-[#0d0e14] rounded-[22px] flex items-center justify-center">
                <Zap className="text-purple-400 w-12 h-12 fill-purple-400" />
              </div>
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-purple-500/20 blur-xl animate-ping opacity-75"></div>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight kinetic-headline text-white">
              JEET LAUNCHER
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-cyan-400 kinetic-subheadline">
              RUST NATIVE HYPER-ENGINE · MINECRAFT 26.3
            </p>
          </div>

          <div className="w-80 md:w-96 p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-left font-['JetBrains_Mono',monospace] text-[11px] space-y-1 text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-white/5 text-[10px]">
              <span>SYSTEM DIAGNOSTICS</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            <div className="text-purple-300 font-semibold tracking-wide truncate">{bootText}</div>
            <div className="text-[10px] text-slate-500">
              SHADERS: <span className="text-yellow-400">COMPLEMENTARY UNBOUND</span> · GPU: <span className="text-cyan-400">VULKAN UHD</span>
            </div>
          </div>

          <div className="w-80 md:w-96 space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
              <span className="text-purple-400">BOOT CALIBRATION</span>
              <span>{bootProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-[1px] border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition-all duration-75 relative shadow-lg shadow-purple-500/50"
                style={{ width: `${bootProgress}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.launch();
              setIsBooting(false);
            }}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-300 underline uppercase tracking-widest pt-2 transition-colors cursor-pointer"
          >
            [ Skip Intro Sequence ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen w-screen bg-[#090a0e] text-[#f1f5f9] select-none overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] ${
        isSlamming ? 'slam-active' : ''
      }`}
    >
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none"></div>

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 border ${
            toast.type === 'error'
              ? 'bg-[#ef4444]/25 border-[#ef4444]/50 text-[#fca5a5]'
              : 'bg-[#9333ea]/25 border-[#9333ea]/50 text-[#e9d5ff]'
          }`}
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 bg-[#0e1017]/90 border-r border-white/5 flex flex-col justify-between p-4 z-20 backdrop-blur-xl">
        <div>
          <div className="px-3 py-4 mb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9333ea] to-[#06b6d4] p-[2px] shadow-lg shadow-purple-500/25">
                <div className="w-full h-full bg-[#0d0e14] rounded-[14px] flex items-center justify-center">
                  <Zap className="text-white w-5 h-5 fill-purple-400" />
                </div>
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-wider kinetic-headline bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  JEET LAUNCHER
                </h1>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">HYPER-MOTION 2026</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'play', label: 'Play Game', icon: Play },
              { id: 'worlds', label: 'Worlds Manager', icon: Globe },
              { id: 'mods', label: 'Mods Browser', icon: Boxes },
              { id: 'packs', label: 'Shaders & Packs', icon: Palette },
              { id: 'settings', label: 'Settings & FPS', icon: Sliders },
              { id: 'updates', label: 'Updates', icon: RefreshCw }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onMouseEnter={() => sound.hover()}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/35 to-purple-600/10 text-purple-200 border border-purple-500/30 shadow-lg shadow-purple-500/15 translate-x-1'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-purple-400 fill-purple-400/20' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              sound.toggle(!soundEnabled);
              setSoundEnabled(!soundEnabled);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs text-slate-300 font-semibold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {soundEnabled ? <Volume2 size={15} className="text-purple-400" /> : <VolumeX size={15} className="text-slate-500" />}
              <span>Tactile Audio SFX</span>
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${soundEnabled ? 'text-purple-300 bg-purple-500/20' : 'text-slate-500 bg-white/5'}`}>
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs space-y-1.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Shader Status:</span>
              <span className={`font-bold ${activeShader ? 'text-yellow-400' : 'text-slate-500'}`}>
                {activeShader ? 'Complementary ON' : 'Off'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Screen Record:</span>
              <span className="text-cyan-400 font-bold">Flicker-Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        {/* ============================================================ */}
        {/* TAB 1: PLAY DASHBOARD */}
        {/* ============================================================ */}
        {activeTab === 'play' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight kinetic-headline text-white">
                  PLAY MINECRAFT
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  Rust Native Engine · Vulkan Pipeline · Uncapped Framerate
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Sun size={14} className="text-yellow-400 animate-spin" />
                <span>SHADERS LINKED</span>
              </div>
            </div>

            {/* HORIZON ACCOUNT & OFFLINE/ONLINE MODE SELECTOR */}
            <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-r from-[#12141c]/90 via-[#181a26]/90 to-[#12141c]/90 glass-card flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center p-[2px] shadow-lg ${
                  account.mode === 'online' 
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/20' 
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/20'
                }`}>
                  <div className="w-full h-full bg-[#0d0e14] rounded-[14px] flex items-center justify-center">
                    <User size={20} className={account.mode === 'online' ? 'text-cyan-400' : 'text-emerald-400'} />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={playerNameInput}
                          onChange={(e) => setPlayerNameInput(e.target.value)}
                          className="bg-[#1c1f2e] border border-purple-500 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none w-36"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSavePlayerName(); }}
                        />
                        <button
                          onClick={handleSavePlayerName}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-white tracking-wide">
                          {account.username || 'Player_Jeet'}
                        </span>
                        <button
                          onClick={() => {
                            sound.click();
                            setIsEditingName(true);
                          }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 cursor-pointer"
                        >
                          Change Name
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {account.mode === 'offline' 
                      ? 'Local Offline Player Profile · Custom Name active' 
                      : (account.isOnlineAuth ? `Signed in as ${account.authEmail || account.username}` : 'Horizon Online Mode · Microsoft Network')}
                  </p>
                </div>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center gap-2 bg-[#0d0e14] p-1.5 rounded-2xl border border-white/5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleToggleMode('offline')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    account.mode === 'offline'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Laptop size={14} />
                  <span>OFFLINE MODE</span>
                </button>
                <button
                  onClick={() => {
                    handleToggleMode('online');
                    if (!account.isOnlineAuth) setShowLoginModal(true);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    account.mode === 'online'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Radio size={14} />
                  <span>ONLINE HORIZON</span>
                </button>
              </div>
            </div>

            {/* Hero Launch Card with Micro-Drift */}
            <div className="relative overflow-hidden rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-[#151722]/90 via-[#11131a]/95 to-[#1c142b]/90 shadow-2xl glass-panel animate-micro-drift animate-border-glow">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-md">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/20">
                      <Sparkles size={14} />
                      <span>Complementary Unbound Shaders</span>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      account.mode === 'online'
                        ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                        : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    }`}>
                      {account.mode === 'online' ? <Radio size={12} /> : <Laptop size={12} />}
                      <span>{account.mode === 'online' ? 'Online Horizon' : `Offline (${account.username})`}</span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-extrabold text-white leading-tight kinetic-headline">
                    Vulkan Minecraft Java 26.3
                  </h3>

                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Zero VSync lock. Unthrottled processor rendering (200+ FPS) and anti-flicker recording protection enabled.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Globe size={14} className="text-purple-400" />
                      Select World to Launch:
                    </label>
                    <select
                      value={selectedWorld}
                      onChange={(e) => {
                        sound.click();
                        setSelectedWorld(e.target.value);
                      }}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="">[Title Screen / Main Menu]</option>
                      {worlds.map((w) => (
                        <option key={w.name} value={w.name}>
                          {w.isDevil ? '🔥 ' : '🌍 '}
                          {w.name} ({w.size})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={handleLaunchGame}
                    disabled={isLaunching}
                    onMouseEnter={() => sound.hover()}
                    className="laser-shimmer group relative flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-extrabold text-xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/60 hover:scale-[1.04] active:scale-[0.96] transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    <Play size={28} className="fill-white group-hover:scale-110 transition-transform" />
                    <span className="tracking-wide">{isLaunching ? 'WARPING IN...' : 'LAUNCH GAME'}</span>
                  </button>

                  <p className="text-xs text-slate-400 text-center font-mono">
                    {status.gameRunning ? '🟢 Process Live (PID Active)' : '⚡ Ready for High CPU Priority Launch'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-white/5 bg-[#12141c]/80 glass-card space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm kinetic-subheadline">
                  <Monitor size={18} />
                  <span>Recording Anti-Flicker</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Borderless Windowed mode enforced. Zero black screen flashes in OBS Studio or Discord.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-[#12141c]/80 glass-card space-y-2">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm kinetic-subheadline">
                  <Sun size={18} />
                  <span>Complementary Shaders</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Complementary Unbound r5.9.3 active with realistic lighting and PBR water reflections.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-white/5 bg-[#12141c]/80 glass-card space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm kinetic-devil">
                  <Flame size={18} />
                  <span>Devil Edition Enabled</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Hardcore challenge world included with custom difficulty presets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: WORLDS MANAGER */}
        {/* ============================================================ */}
        {activeTab === 'worlds' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight kinetic-headline text-white">
                  WORLDS MANAGER
                </h2>
                <p className="text-sm text-slate-400 font-medium">Single-player worlds stored in your Horizon instance</p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    sound.click();
                    setShowCreateWorld(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  <Plus size={16} />
                  <span>Create World</span>
                </button>
                <button
                  onClick={() => handleOpenFolder('saves')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] font-semibold text-sm text-slate-200 transition-colors cursor-pointer border border-white/5"
                >
                  <FolderOpen size={16} />
                  <span>Open Folder</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worlds.map((w) => (
                <div
                  key={w.name}
                  className={`p-6 rounded-2xl border transition-all duration-300 space-y-4 glass-card ${
                    w.isDevil
                      ? 'bg-gradient-to-br from-[#1f1118]/80 to-[#12141c]/90 border-red-500/25 hover:border-red-500/50'
                      : 'bg-[#12141c]/80 border-white/5 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        {w.isDevil ? (
                          <Flame className="text-red-500 w-6 h-6 animate-pulse" />
                        ) : (
                          <Globe className="text-purple-400 w-6 h-6" />
                        )}
                        <h3 className={`font-extrabold text-xl ${w.isDevil ? 'kinetic-devil text-red-200' : 'text-white'}`}>
                          {w.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        Size: <span className="text-slate-200 font-bold">{w.size}</span> · {w.lastPlayed}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                        w.isDevil
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/20'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/20'
                      }`}
                    >
                      {w.isDevil ? 'Hardcore Realm' : 'Survival'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <button
                      onClick={() => {
                        sound.click();
                        setSelectedWorld(w.name);
                        setActiveTab('play');
                      }}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer hover:underline"
                    >
                      <Play size={14} className="fill-purple-400" /> Select & Play
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBackupWorld(w.name)}
                        title="Create ZIP Backup"
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-colors cursor-pointer"
                      >
                        <Archive size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteWorld(w.name)}
                        title="Delete World"
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showCreateWorld && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#141620] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl animate-float">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-white kinetic-headline flex items-center gap-2">
                      <Plus size={20} className="text-purple-400" />
                      CREATE NEW WORLD
                    </h3>
                    <button
                      onClick={() => setShowCreateWorld(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        World Name:
                      </label>
                      <input
                        type="text"
                        value={newWorldName}
                        onChange={(e) => setNewWorldName(e.target.value)}
                        placeholder="e.g. Devil Fortress"
                        className="w-full bg-[#1b1e2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Difficulty Preset:
                      </label>
                      <select
                        value={newWorldDiff}
                        onChange={(e) => setNewWorldDiff(e.target.value)}
                        className="w-full bg-[#1b1e2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="hard">Hardcore / Hard Mode (Devil Edition)</option>
                        <option value="normal">Normal Survival</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3">
                    <button
                      onClick={() => setShowCreateWorld(false)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateWorld}
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-extrabold text-white shadow-lg shadow-purple-600/30 cursor-pointer"
                    >
                      Create World
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: MODS BROWSER */}
        {/* ============================================================ */}
        {activeTab === 'mods' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight kinetic-headline text-white">
                  MODS MANAGER
                </h2>
                <p className="text-sm text-slate-400 font-medium">Fabric & native Horizon mods installed in your client</p>
              </div>
              <div className="flex gap-2.5">
                <a
                  href="https://modrinth.com/mods?f=categories:fabric"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-emerald-600/25"
                >
                  <ExternalLink size={15} />
                  <span>Browse Modrinth</span>
                </a>
                <button
                  onClick={() => handleOpenFolder('mods')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] font-semibold text-sm text-slate-200 transition-colors cursor-pointer border border-white/5"
                >
                  <FolderOpen size={16} />
                  <span>Open Folder</span>
                </button>
              </div>
            </div>

            {mods.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <Boxes size={48} className="mx-auto text-slate-500 mb-3" />
                <h3 className="font-extrabold text-white text-lg kinetic-headline">NO MODS INSTALLED YET</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 font-medium">
                  Drop `.jar` or `.hmod` files into your mods folder or install performance mods via Modrinth.
                </p>
                <button
                  onClick={() => handleOpenFolder('mods')}
                  className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-xs text-white cursor-pointer"
                >
                  Open Mods Directory
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {mods.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#12141c]/80 glass-card"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${
                          m.enabled ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-slate-600'
                        }`}
                      ></div>
                      <div>
                        <h4 className={`text-sm font-extrabold ${m.enabled ? 'text-white' : 'text-slate-500'}`}>
                          {m.name.replace(/\.disabled$/, '')}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">{m.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleToggleMod(m.name)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          m.enabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/[0.05] text-slate-400 border border-white/5'
                        }`}
                      >
                        {m.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => handleDeleteMod(m.name)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: SHADERS & TEXTURE PACKS (WITH COMPLEMENTARY SHADER)  */}
        {/* ============================================================ */}
        {activeTab === 'packs' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight kinetic-headline text-white">
                  SHADERS & RESOURCE PACKS
                </h2>
                <p className="text-sm text-slate-400 font-medium">Vulkan GPU Shaders, PBR lighting, and visual enhancement packs</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenFolder('shaders')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-600/20 hover:bg-yellow-600/30 font-bold text-sm text-yellow-300 transition-colors cursor-pointer border border-yellow-500/30"
                >
                  <Sun size={16} />
                  <span>Open Shaders Folder</span>
                </button>
                <button
                  onClick={() => handleOpenFolder('packs')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] font-semibold text-sm text-slate-200 transition-colors cursor-pointer border border-white/5"
                >
                  <FolderOpen size={16} />
                  <span>Open Resourcepacks</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: SHADER PACKS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-yellow-400 uppercase tracking-wider font-mono">
                <Sun size={16} />
                <span>Installed Vulkan Shaders</span>
              </div>

              {shaderPacks.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                  <Sun size={36} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No shader packs detected in folder.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {shaderPacks.map((s) => {
                    const isOn = activeShader === s.name;
                    return (
                      <div
                        key={s.name}
                        className={`p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                          isOn
                            ? 'bg-gradient-to-r from-yellow-500/10 via-[#181a24] to-[#12141c] border-yellow-500/40 shadow-lg shadow-yellow-500/10'
                            : 'bg-[#12141c]/80 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${isOn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-slate-400'}`}>
                            <Sun size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h4 className="text-base font-extrabold text-white">{s.name}</h4>
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                  isOn ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' : 'bg-white/5 text-slate-400'
                                }`}
                              >
                                {isOn ? 'ACTIVE SHADER' : 'INACTIVE'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              Size: {s.size} · Real-time Dynamic Lighting, Soft Shadows, PBR Reflections
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleToggleShader(s.name)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                              isOn
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/25'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {isOn ? 'TURN OFF' : 'ACTIVATE SHADER'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: RESOURCE PACKS */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-purple-400 uppercase tracking-wider font-mono">
                <Palette size={16} />
                <span>Installed Resource Packs</span>
              </div>

              {packs.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                  <Palette size={36} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No custom texture packs installed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {packs.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#12141c]/80 glass-card"
                    >
                      <div className="flex items-center gap-3">
                        <Palette size={20} className="text-purple-400" />
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{p.name}</h4>
                          <p className="text-xs text-slate-400 font-mono">Size: {p.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePack(p.name)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: SETTINGS & FPS ENGINE */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight kinetic-headline text-white">
                ENGINE & GRAPHICS SETTINGS
              </h2>
              <p className="text-sm text-slate-400 font-medium">Hardware framerate, screen recording, and chunk pipeline controls</p>
            </div>

            <div className="space-y-5">
              <div className="p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#101b22]/90 to-[#0e1017]/95 glass-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-cyan-400 w-6 h-6" />
                    <div>
                      <h3 className="font-extrabold text-lg text-white kinetic-subheadline">
                        Screen Recording Anti-Flicker Safe Mode
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Prevents black screen and flickering in OBS Studio, Discord, and Game Bar.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.screenRecordingSafe}
                    onChange={(e) => {
                      sound.toggle(e.target.checked);
                      setSettings({ ...settings, screenRecordingSafe: e.target.checked });
                    }}
                    className="w-6 h-6 accent-cyan-500 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-[#211a10]/90 to-[#0e1017]/95 glass-card space-y-4">
                <div className="flex items-center gap-3">
                  <Gauge className="text-yellow-400 w-6 h-6" />
                  <div>
                    <h3 className="font-extrabold text-lg text-white kinetic-subheadline">
                      True Processor Render FPS & Overlay
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Renders frames at maximum CPU/GPU capability (e.g. 200+ FPS), ignoring physical 60Hz limits.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Hardware FPS Meter:
                    </label>
                    <select
                      value={settings.overlay}
                      onChange={(e) => {
                        sound.click();
                        setSettings({ ...settings, overlay: e.target.value });
                      }}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
                    >
                      <option value="precise">Precise (Shows True 200+ Processor Render Rate)</option>
                      <option value="graph">Full Performance & Frametime Graph</option>
                      <option value="reduced">Reduced Simple Stats</option>
                      <option value="off">Off (Hidden)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Vulkan Frame Presentation Mode:
                    </label>
                    <select
                      value={settings.presentMode}
                      onChange={(e) => {
                        sound.click();
                        setSettings({ ...settings, presentMode: e.target.value });
                      }}
                      className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
                    >
                      <option value="immediate">Immediate (Raw Uncapped Processor FPS · 200+ FPS)</option>
                      <option value="mailbox">Mailbox (Fast-Sync Low Latency, Tear-Free)</option>
                      <option value="fifo">Fifo (Standard 60Hz Monitor VSync Cap)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-white/10 bg-[#12141c]/80 glass-card space-y-5">
                <h3 className="font-extrabold text-lg text-white kinetic-headline flex items-center gap-2">
                  <Sliders size={20} className="text-purple-400" />
                  CHUNK & HARDWARE ALLOCATIONS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold font-mono">
                      <span className="text-slate-300">Render Distance:</span>
                      <span className="text-purple-400">{settings.renderDistance} chunks</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={32}
                      step={2}
                      value={settings.renderDistance}
                      onChange={(e) => setSettings({ ...settings, renderDistance: parseInt(e.target.value, 10) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold font-mono">
                      <span className="text-slate-300">Simulation Distance:</span>
                      <span className="text-purple-400">{settings.simulationDistance} chunks</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={16}
                      step={1}
                      value={settings.simulationDistance}
                      onChange={(e) => setSettings({ ...settings, simulationDistance: parseInt(e.target.value, 10) })}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-6 text-xs text-slate-300 font-bold">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.culling}
                      onChange={(e) => {
                        sound.toggle(e.target.checked);
                        setSettings({ ...settings, culling: e.target.checked });
                      }}
                      className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                    />
                    <span>Entity & Particle Culling (Intel UHD GPU Optimizer)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.highPriority}
                      onChange={(e) => {
                        sound.toggle(e.target.checked);
                        setSettings({ ...settings, highPriority: e.target.checked });
                      }}
                      className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                    />
                    <span>High CPU Process Priority</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 font-extrabold text-white text-base shadow-2xl shadow-purple-600/30 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                SAVE & APPLY ALL HYPER SETTINGS
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: DUAL UPDATES (GAME ENGINE + LAUNCHER REACT CLIENT)    */}
        {/* ============================================================ */}
        {activeTab === 'updates' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight kinetic-headline text-white">
                SYSTEM & ENGINE UPDATES
              </h2>
              <p className="text-sm text-slate-400 font-medium">Independent update pipelines for the Rust Game Engine and React Desktop Launcher</p>
            </div>

            {/* CARD 1: HORIZON GAME ENGINE UPDATES */}
            <div className="p-6 rounded-3xl border border-white/10 bg-[#12141c]/80 glass-card space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider font-mono">Game Engine Architecture:</span>
                  </div>
                  <h3 className="font-extrabold text-xl text-white kinetic-subheadline">
                    {status.version || 'Horizon Rust Client (Minecraft 26.3)'}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    Rust Vulkan 1.3 Multi-Draw Pipeline · Uncapped Framerate · Devil World Ready
                  </p>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={handleCheckGameUpdate}
                    disabled={isGameUpdating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] font-bold text-sm text-white transition-colors cursor-pointer border border-white/5 disabled:opacity-50"
                  >
                    <RefreshCw size={15} className={isGameUpdating ? 'animate-spin' : ''} />
                    <span>Check Engine Updates</span>
                  </button>
                  <button
                    onClick={handleRunGameUpdate}
                    disabled={isGameUpdating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-extrabold text-sm text-white transition-colors cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50"
                  >
                    <Zap size={15} />
                    <span>Sync Rust Engine</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                  <span className="flex items-center gap-2 text-purple-400">
                    <Terminal size={14} />
                    <span>Engine Update Console</span>
                  </span>
                  <span className="text-slate-500">Target: Horizon Nightly 26.3</span>
                </div>
                <pre className="w-full h-40 p-4 rounded-2xl bg-[#08090d] border border-white/5 text-slate-300 font-['JetBrains_Mono',monospace] text-xs overflow-y-auto leading-relaxed shadow-inner">
                  {gameUpdateLogs}
                </pre>
              </div>
            </div>

            {/* CARD 2: JEET LAUNCHER REACT CLIENT UPDATES (GITHUB / REA) */}
            <div className="p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#101b22]/90 to-[#0e1017]/95 glass-card space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Github size={14} className="text-cyan-400" />
                    <span className="text-xs text-cyan-300 uppercase font-bold tracking-wider font-mono">React Desktop Application:</span>
                  </div>
                  <h3 className="font-extrabold text-xl text-white kinetic-headline">
                    JEET LAUNCHER v2.4.0 (REA)
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    GitHub: <a href="https://github.com/satyajeetlakra01-blip/jeet-launcher-.git" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">satyajeetlakra01-blip/jeet-launcher-.git</a>
                  </p>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={handleCheckLauncherUpdate}
                    disabled={isLauncherUpdating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 font-bold text-sm text-cyan-300 transition-colors cursor-pointer border border-cyan-500/30 disabled:opacity-50"
                  >
                    <RefreshCw size={15} className={isLauncherUpdating ? 'animate-spin' : ''} />
                    <span>Check GitHub Repo</span>
                  </button>
                  <button
                    onClick={handleRunLauncherUpdate}
                    disabled={isLauncherUpdating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-extrabold text-sm text-white transition-colors cursor-pointer shadow-lg shadow-cyan-600/30 disabled:opacity-50"
                  >
                    <GitBranch size={15} />
                    <span>Pull & Rebuild UI</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Terminal size={14} />
                    <span>Launcher Git & Asset Console</span>
                  </span>
                  <span className="text-slate-500">React 19 (REA) · Vite 6 · Tailwind</span>
                </div>
                <pre className="w-full h-40 p-4 rounded-2xl bg-[#08090d] border border-white/5 text-slate-300 font-['JetBrains_Mono',monospace] text-xs overflow-y-auto leading-relaxed shadow-inner">
                  {launcherUpdateLogs}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ONLINE HORIZON / MICROSOFT LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141620] border border-cyan-500/30 rounded-3xl p-7 space-y-6 shadow-2xl animate-float">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Radio size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white kinetic-headline">
                    HORIZON ONLINE SIGN-IN
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Connect for online multiplayer & Horizon servers</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Horizon / Microsoft Account Email or Gamertag:
                </label>
                <input
                  type="text"
                  value={onlineEmailInput}
                  onChange={(e) => setOnlineEmailInput(e.target.value)}
                  placeholder="e.g. warrior@horizon.dev or Spartan117"
                  className="w-full bg-[#1b1e2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-cyan-500"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleOnlineLogin(); }}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 font-medium space-y-1">
                <p>✓ Grants authenticated online token for multiplayer servers</p>
                <p>✓ Keeps your custom offline worlds and skins safe</p>
                <p>✓ Switch back to Offline Mode anytime with 1 click</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleOnlineLogin}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-sm font-extrabold text-white shadow-lg shadow-cyan-600/30 cursor-pointer"
              >
                Connect Horizon Online
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
