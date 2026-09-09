import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronDown, 
  Info, 
  ExternalLink, 
  X, 
  Bookmark, 
  Monitor, 
  Laptop, 
  ArrowRight,
  ShieldCheck,
  Lock,
  Search,
  Zap,
  Globe,
  Award,
  MapPin,
  Activity
} from 'lucide-react';
import { Device } from '../types';

interface AnecttaRemoteSupportProps {
  localId: string;
  localPassword: string;
  onRegeneratePassword: () => void;
  onConnect: (targetId: string, mode: 'supervised' | 'unattended', password?: string) => void;
  recentDevices: Device[];
  onOpenDeviceDetail?: (device: Device) => void;
  onOpenAgentModal: () => void;
  onOpenPwaModal: () => void;
  onSwitchToSessions: () => void;
  userEmail?: string;
  userName?: string;
  isNocMode?: boolean;
}

export const AnecttaRemoteSupport: React.FC<AnecttaRemoteSupportProps> = ({
  localId,
  localPassword,
  onRegeneratePassword,
  onConnect,
  recentDevices,
  onOpenDeviceDetail,
  onOpenAgentModal,
  onOpenPwaModal,
  onSwitchToSessions,
  userEmail = 'carlosamorfbr@gmail.com',
  userName = 'Carlos Amor',
  isNocMode = false,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [targetIdInput, setTargetIdInput] = useState('');
  const [connectionMode, setConnectionMode] = useState<'remote_control' | 'file_transfer' | 'direct_chat'>('remote_control');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [easyAccessEnabled, setEasyAccessEnabled] = useState(true);
  const [showEasyAccessInfo, setShowEasyAccessInfo] = useState(false);
  const [showPromoWidget, setShowPromoWidget] = useState(true);
  const [targetPassword, setTargetPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // NetPulse Real-time Telemetry state
  const [currentSpeed, setCurrentSpeed] = useState(584.2);
  const [currentPing, setCurrentPing] = useState(4);
  const [currentJitter, setCurrentJitter] = useState(1);

  // Smooth live fluctuation for the cockpit gauge
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 18;
      setCurrentSpeed((prev) => {
        const next = Math.max(380, Math.min(890, prev + delta));
        return parseFloat(next.toFixed(2));
      });
      setCurrentPing((prev) => Math.max(2, Math.min(9, Math.round(prev + (Math.random() - 0.5) * 1.5))));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Copy local ID
  const handleCopyId = () => {
    navigator.clipboard.writeText(localId.replace(/\s+/g, ''));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Copy local password
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(localPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Format ID input as "XXX XXX XXX"
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
    let formatted = raw;
    if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
    }
    setTargetIdInput(formatted);
  };

  const handleSelectRecentDevice = (dev: Device) => {
    setTargetIdInput(dev.anecttadeskId || '735 006 750');
    setShowDeviceDropdown(false);
  };

  const handleSubmitConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = targetIdInput.replace(/\s+/g, '');
    if (cleanId.length < 9) return;
    
    // Check if target requires password or supervised
    onConnect(targetIdInput, 'supervised');
  };

  const canConnect = targetIdInput.replace(/\s+/g, '').length >= 9;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* ========================================================================= */}
      {/* HERO SECTION OFICIAL ANECTTA (CENTRAL DE OPERAÇÕES & TELEMETRIA NETPULSE) */}
      {/* ========================================================================= */}
      <section className="relative pt-2 pb-6 overflow-hidden select-none">
        {/* Elementos Decorativos de Fundo */}
        <div className="hero-glow-orb top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/10 pointer-events-none" />
        <div className="hero-glow-orb top-20 -left-10 w-[350px] h-[350px] bg-cyan-500/8 pointer-events-none" />
        <div className="hero-glow-orb bottom-0 -right-10 w-[350px] h-[350px] bg-emerald-500/8 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* COLUNA ESQUERDA: BADGES, HEADLINE, DESCRIÇÃO E CARDS DE DESTAQUE */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4">
            
            {/* BADGES SUPERIORES PREMIUM */}
            <div className="hero-badges-row justify-center lg:justify-start">
              {/* 1. Suporte 100% Remoto | Global */}
              <span className="hero-feature-badge badge-seq-1">
                <div className="badge-icon-squircle badge-squircle-sky text-white">
                  <Globe className="w-3 h-3" />
                </div>
                <span className="text-slate-400 font-medium">SUPORTE:</span>
                <span className="text-sky-700 font-bold font-mono">100% REMOTO | GLOBAL</span>
              </span>

              {/* 2. +10 Anos no Mercado */}
              <span className="hero-feature-badge badge-seq-2">
                <div className="badge-icon-squircle badge-squircle-sky text-white">
                  <Award className="w-3 h-3" />
                </div>
                <span className="text-slate-400 font-medium">EXPERIÊNCIA:</span>
                <span className="text-sky-700 font-bold font-mono">+10 ANOS EM TIC</span>
              </span>

              {/* 3. Atendimento Presencial */}
              <span className="hero-feature-badge badge-seq-3">
                <div className="badge-icon-squircle badge-squircle-sky text-white">
                  <MapPin className="w-3 h-3" />
                </div>
                <span className="text-slate-400 font-medium">PRESENCIAL:</span>
                <span className="text-sky-700 font-bold font-mono">RIO DE JANEIRO</span>
              </span>
            </div>

            {/* HEADLINE OFICIAL ANECTTA */}
            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold tracking-tight leading-[1.2]">
              <span className="bg-gradient-to-r from-[#0a1e3b] via-[#0f3460] to-[#0369a1] bg-clip-text text-transparent">
                Corretivo, Preventivo e Proativo.
              </span>{' '}
              <span className="bg-gradient-to-r from-[#0f3460] via-[#0284c7] to-[#0ea5e9] bg-clip-text text-transparent">
                Mais que suporte...
              </span>
              <br />
              <span className="gradient-text-accent bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent">
                Experimente!!
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              Equipe especializada em atendimento remoto para suporte imediato a usuários, computadores, servidores e redes. Eficiência operacional, zero perda de tempo e especialistas prontos para resolver ocorrências em segundos.
            </p>

            {/* SPOTLIGHT CARDS DESTAQUES: SIGILO GARANTIDO & ACESSO REMOTO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 pt-1">
              {/* Card 1: Sigilo Garantido */}
              <div className="spotlight-card p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Sigilo Garantido</h3>
                  <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">Controle de acesso rigoroso</p>
                </div>
              </div>

              {/* Card 2: Acesso Remoto */}
              <div className="spotlight-card p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Acesso Remoto</h3>
                  <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">ChaCha20 / AES-256 TLS 1.3</p>
                </div>
              </div>
            </div>

          </div>

          {/* COLUNA DIREITA: VELOCÍMETRO LIVE COCKPIT ANECTTA NETPULSE */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-2 relative">
            <div className="hero-gauge-container w-full flex flex-col items-center justify-center">
              <div className="hero-gauge-wrapper flex items-center justify-center select-none relative">
                
                {/* Círculos Concêntricos de Fundo */}
                <div className="nperf-gauge-external-rings pointer-events-none">
                  <div className="nperf-ext-ring nperf-ext-ring-1" />
                  <div className="nperf-ext-ring nperf-ext-ring-2" />
                  <div className="nperf-radiant-wave nperf-radiant-wave-1" />
                  <div className="nperf-radiant-wave nperf-radiant-wave-2" />
                </div>

                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible cockpit-speedometer-svg">
                  <defs>
                    <radialGradient id="baseBlueRadialBg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#075985" />
                      <stop offset="35%" stop-color="#034575" />
                      <stop offset="70%" stop-color="#022852" />
                      <stop offset="100%" stop-color="#01142e" />
                    </radialGradient>
                    <radialGradient id="dialDarkRadialBg" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.45" />
                      <stop offset="25%" stop-color="#035482" />
                      <stop offset="60%" stop-color="#052c52" />
                      <stop offset="85%" stop-color="#021a36" />
                      <stop offset="100%" stop-color="#010d1c" />
                    </radialGradient>
                    <radialGradient id="centerHubRadialBg" cx="45%" cy="38%" r="60%">
                      <stop offset="0%" stop-color="#0284c7" />
                      <stop offset="55%" stop-color="#063868" />
                      <stop offset="100%" stop-color="#021226" />
                    </radialGradient>
                    <linearGradient id="needleOrangeFireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stop-color="#ff3d00" stop-opacity="0.85" />
                      <stop offset="45%" stop-color="#ff6d00" />
                      <stop offset="80%" stop-color="#ff9100" />
                      <stop offset="100%" stop-color="#ffe57f" />
                    </linearGradient>
                    <linearGradient id="haloCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#00d2ff" />
                      <stop offset="50%" stop-color="#00f0ff" />
                      <stop offset="100%" stop-color="#0284c7" />
                    </linearGradient>
                    <linearGradient id="dialArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#00d2ff" />
                      <stop offset="50%" stop-color="#38bdf8" />
                      <stop offset="100%" stop-color="#0284c7" />
                    </linearGradient>
                  </defs>

                  {/* 1. Base circular cockpit */}
                  <circle cx="200" cy="200" r="194" fill="url(#baseBlueRadialBg)" stroke="#0284c7" stroke-width="1.5" stroke-opacity="0.4" />
                  <circle cx="200" cy="200" r="184" fill="none" stroke="url(#haloCyanGrad)" stroke-width="4.5" className="cockpit-neon-cyan-ring" />
                  <circle cx="200" cy="200" r="172" fill="none" stroke="#0284c7" stroke-width="3" opacity="0.6" />

                  {/* 2. Mostrador Principal */}
                  <circle cx="200" cy="200" r="150" fill="url(#dialDarkRadialBg)" stroke="#00d2ff" stroke-width="2.5" opacity="0.98" />

                  {/* 3. Ticks Principais */}
                  <g className="cockpit-major-ticks">
                    <line x1="94.3" y1="288.7" x2="108.1" y2="277.1" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
                    <text x="121.9" y="269.1" fill="#ffffff" font-size="9.2" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">0</text>
                    
                    <line x1="66.1" y1="233.4" x2="83.6" y2="229.0" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
                    <text x="101.0" y="228.2" fill="#ffffff" font-size="9.2" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">1M</text>
                    
                    <line x1="65.0" y1="171.3" x2="82.6" y2="175.1" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
                    <text x="100.2" y="182.3" fill="#ffffff" font-size="9.2" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">10M</text>
                    
                    <line x1="139.5" y1="76.0" x2="147.4" y2="92.1" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
                    <text x="155.3" y="111.8" fill="#ffffff" font-size="9.2" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">50M</text>
                    
                    <line x1="200.0" y1="62.0" x2="200.0" y2="80.0" stroke="#00f0ff" stroke-width="2.2" stroke-linecap="round" />
                    <text x="200.0" y="101.5" fill="#00f0ff" font-size="9.2" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">100M</text>
                    
                    <line x1="260.5" y1="76.0" x2="252.6" y2="92.1" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
                    <text x="244.7" y="111.8" fill="#ffffff" font-size="8.5" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">250M</text>
                    
                    <line x1="335.0" y1="171.3" x2="317.4" y2="175.1" stroke="#c084fc" stroke-width="2.2" stroke-linecap="round" />
                    <text x="299.8" y="182.3" fill="#c084fc" font-size="8.5" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">500M</text>
                    
                    <line x1="333.9" y1="233.4" x2="316.4" y2="229.0" stroke="#c084fc" stroke-width="2.2" stroke-linecap="round" />
                    <text x="299.0" y="228.2" fill="#c084fc" font-size="9.2" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">1G+</text>
                  </g>

                  {/* 4. Arco Dinâmico de Progresso */}
                  <circle cx="200" cy="200" r="138" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="7" stroke-dasharray="626.2 867.1" stroke-linecap="round" transform="rotate(140 200 200)" />
                  <circle 
                    cx="200" 
                    cy="200" 
                    r="138" 
                    fill="none" 
                    stroke="url(#dialArcGrad)" 
                    stroke-width="7" 
                    stroke-dasharray="626.2 867.1" 
                    stroke-dashoffset={626.2 - (Math.min(currentSpeed, 1000) / 1000) * 450} 
                    stroke-linecap="round" 
                    transform="rotate(140 200 200)" 
                    className="transition-all duration-300" 
                    filter="drop-shadow(0 0 8px #00d2ff)" 
                  />

                  {/* 5. Ponteiro Neon Flamejante Dinâmico */}
                  <g 
                    className="origin-center transition-transform duration-300 ease-out" 
                    style={{ 
                      transformOrigin: '200px 200px', 
                      transform: `rotate(${-130 + (Math.min(currentSpeed, 1000) / 1000) * 260}deg)` 
                    }}
                  >
                    <polygon points="193,200 200,68 207,200 200,224" fill="#ff6d00" opacity="0.35" filter="drop-shadow(0 0 10px #ff3d00)" />
                    <polygon points="195.5,200 200,74 204.5,200 200,220" fill="url(#needleOrangeFireGrad)" filter="drop-shadow(0 0 6px #ff6d00)" />
                    <line x1="200" y1="195" x2="200" y2="82" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                    <line x1="200" y1="195" x2="200" y2="90" stroke="#ffe57f" stroke-width="2.8" stroke-linecap="round" opacity="0.8" />
                  </g>

                  {/* 6. Cubo Central */}
                  <circle cx="200" cy="200" r="38" fill="url(#centerHubRadialBg)" stroke="#00d2ff" stroke-width="2" />
                  <circle cx="200" cy="200" r="30" fill="#011024" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" />
                  <circle cx="200" cy="200" r="7" fill="#00f0ff" filter="drop-shadow(0 0 4px #00f0ff)" />
                </svg>

                {/* Badge Central Live */}
                <div className="hero-gauge-center-badge shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-emerald mb-0.5" />
                  <span className="text-[9px] font-black tracking-widest text-white uppercase">LIVE</span>
                </div>

                {/* Display Digital Central da Velocidade */}
                <div className="hero-gauge-center-display">
                  <span className="nperf-speed-unit">MBPS</span>
                  <span className="nperf-speed-value">{currentSpeed.toFixed(2)}</span>
                  <span className="nperf-speed-brand">
                    ANECTTA <span>NETPULSE</span>
                  </span>
                </div>
              </div>

              {/* Sub-estatísticas Latência / Jitter */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono">
                <div className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
                  <span className="text-slate-400">PING:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentPing} ms</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
                  <span className="text-slate-400">JITTER:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{currentJitter} ms</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">ÓTIMO</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Top Pill Tabs */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner">
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs shadow-sm transition tracking-tight"
          >
            ID do AnecttaDESK
          </button>
          <button
            type="button"
            onClick={onSwitchToSessions}
            className="px-6 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-xs transition tracking-tight"
          >
            Sessões
          </button>
        </div>
      </div>

      {/* Main Dual Card (Permitir Controle Remoto + Controlar Dispositivo Remoto) */}
      <div className={`rounded-2xl border shadow-sm ${
        isNocMode 
          ? 'bg-black border-cyan-500/40 text-slate-100' 
          : 'bg-white border-slate-200/80 text-slate-800'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* ========================================================================= */}
          {/* COLUNA ESQUERDA: PERMITIR CONTROLE REMOTO */}
          {/* ========================================================================= */}
          <div className="p-7 sm:p-9 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Permitir controle remoto
              </h2>

              {/* Sub-Card: ID e Senha */}
              <div className="bg-[#f8fafc] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
                {/* SUA ID */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Sua ID
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-wider font-mono select-all">
                      {localId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      title="Copiar ID"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition active:scale-95"
                    >
                      {copiedId ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SENHA */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Senha
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono select-all tracking-wide">
                      {localPassword}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={onRegeneratePassword}
                        title="Gerar nova senha aleatória"
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition active:scale-95"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCopyPassword}
                        title="Copiar Senha"
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition active:scale-95"
                      >
                        {copiedPassword ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkbox: Permitir Acesso Fácil a este dispositivo */}
              <div className="pt-2">
                <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={easyAccessEnabled}
                    onChange={(e) => setEasyAccessEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 focus:ring-offset-0 transition"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Permitir Acesso Fácil a este dispositivo
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEasyAccessInfo(!showEasyAccessInfo)}
                    className="text-slate-400 hover:text-blue-600 transition"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </label>

                {showEasyAccessInfo && (
                  <div className="mt-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 text-xs animate-in fade-in">
                    O Acesso Fácil permite que operadores autorizados da sua conta AnecttaDESK (Carlos Amor) conectem-se a este computador sem a necessidade de confirmar uma senha temporária em cada sessão.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Agent Installer Note */}
            <div className="pt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Criptografia ponta a ponta ChaCha20 / AES-256</span>
              </span>
              <button
                onClick={onOpenAgentModal}
                className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Configurar Agente
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA DIREITA: CONTROLAR DISPOSITIVO REMOTO */}
          {/* ========================================================================= */}
          <div className="p-7 sm:p-9 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Controlar dispositivo remoto
              </h2>

              {/* Mode Selector (Controle remoto ∨) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-cyan-400 hover:text-blue-700 text-sm font-semibold transition"
                >
                  <span>
                    {connectionMode === 'remote_control' && 'Controle remoto'}
                    {connectionMode === 'file_transfer' && 'Transferência de arquivos'}
                    {connectionMode === 'direct_chat' && 'Chat direto'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showModeDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setConnectionMode('remote_control');
                        setShowModeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <span>Controle remoto</span>
                      {connectionMode === 'remote_control' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setConnectionMode('file_transfer');
                        setShowModeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <span>Transferência de arquivos</span>
                      {connectionMode === 'file_transfer' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setConnectionMode('direct_chat');
                        setShowModeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <span>Chat direto</span>
                      {connectionMode === 'direct_chat' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Form Input: ID, endereço IP ou nome do host */}
              <form onSubmit={handleSubmitConnect} className="space-y-4">
                <div className="relative">
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl px-4 pt-2.5 pb-2 focus-within:border-blue-600 dark:focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-blue-600 dark:focus-within:ring-cyan-400 bg-white dark:bg-slate-900 transition">
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      ID, endereço IP ou nome do host
                    </label>
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={targetIdInput}
                        onChange={handleIdChange}
                        placeholder="735 006 750"
                        className="w-full bg-transparent text-slate-900 dark:text-white font-mono text-base font-semibold focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                        title="Escolher dos seus dispositivos recentes"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown with Recent Devices */}
                  {showDeviceDropdown && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in">
                      <div className="p-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Computadores Recentes na Sua Rede:
                      </div>
                      {recentDevices.map((dev) => (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={() => handleSelectRecentDevice(dev)}
                          className="w-full p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <Monitor className="w-4 h-4 text-cyan-500" />
                            <div>
                              <div className="font-bold text-slate-800 dark:text-white">
                                {dev.hostname}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {dev.publicIp} • {dev.osType}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-xs">
                            {dev.anecttadeskId || '735 006 750'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Action Button: Conectar */}
                <div>
                  <button
                    type="submit"
                    disabled={!canConnect}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center space-x-2 ${
                      canConnect
                        ? 'bg-[#0e56f0] hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-98 cursor-pointer'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>Conectar</span>
                    {canConnect && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Host Lookup Tip */}
            <div className="pt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span>Modo supervisionado ativo</span>
              <button
                type="button"
                onClick={onOpenPwaModal}
                className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Instalar no Windows
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Promo/Resource Banner + Status Bar */}
      <div className="mt-8 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
        {/* Connection Status: "● Pronto para a conexão (conexão segura)" */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
          <span>Pronto para a conexão (conexão segura WebRTC)</span>
        </div>

        {/* Central de Recursos Rápidos AnecttaDESK */}
        {showPromoWidget && (
          <div className="relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => setShowPromoWidget(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-3 pr-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug">
                  Explore nosso centro de recursos e fique por dentro das nossas últimas atualizações.
                </p>
                <button
                  onClick={onOpenAgentModal}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center space-x-1"
                >
                  <span>Comece agora</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
