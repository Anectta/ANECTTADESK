import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronDown, 
  Info, 
  Monitor, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  Sparkles,
  Cpu,
  Zap,
  Activity,
  Terminal,
  Wifi,
  Bot,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Layers
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

  // AI Copilot & Neural Network telemetry states
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiIsAnalyzing, setAiIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(
    'Rede neural Anectta ativa: Túneis P2P com taxa de compressão H.265 adaptativa e latência de 3ms.'
  );
  const [aiOptimizationActive, setAiOptimizationActive] = useState(true);

  // Live telemetry mock values
  const [neuralScore, setNeuralScore] = useState(99.4);
  const [p2pLatency, setP2pLatency] = useState(3.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralScore((prev) => parseFloat((98.5 + Math.random() * 1.4).toFixed(1)));
      setP2pLatency((prev) => parseFloat((3.2 + Math.random() * 1.5).toFixed(1)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(localId.replace(/\s+/g, ''));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(localPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

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
    onConnect(targetIdInput, 'supervised');
  };

  const handleAiCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptInput.trim()) return;
    setAiIsAnalyzing(true);
    setTimeout(() => {
      const q = aiPromptInput.toLowerCase();
      if (q.includes('conectar') || q.includes('servidor') || q.includes('srv')) {
        const found = recentDevices.find(d => d.hostname.toLowerCase().includes('srv') || d.hostname.toLowerCase().includes('server')) || recentDevices[0];
        setTargetIdInput(found.anecttadeskId);
        setAiAnalysisResult(`Agente Anectta IA identificou o dispositivo ${found.hostname} (${found.anecttadeskId}). Clique em "Conectar ao Endpoint" ou pressione Enter.`);
      } else if (q.includes('diagnostico') || q.includes('lentidao') || q.includes('lento')) {
        setAiAnalysisResult(`Diagnóstico Neural executado: 3 máquinas com alto consumo de memória identificadas. Recomenda-se execução do script "Limpeza de Spooler & Cache".`);
      } else if (q.includes('reiniciar') || q.includes('offline')) {
        setAiAnalysisResult(`Agente IA: Wake-on-LAN enviado para endpoints suspensos na sub-rede 192.168.1.0/24.`);
      } else {
        setAiAnalysisResult(`Comando recebido: "${aiPromptInput}". O Agente Autônomo Anectta preparou a rota P2P mais veloz com criptografia Zero-Trust.`);
      }
      setAiIsAnalyzing(false);
    }, 700);
  };

  const canConnect = targetIdInput.replace(/\s+/g, '').length >= 9;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      
      {/* 1. TOP AI COPILOT INTERACTIVE BAR (Anectta Neural Assistant) */}
      <div className="ai-glass-card rounded-2xl p-4 sm:p-5 border border-sky-300/40 shadow-lg relative overflow-hidden">
        {/* Glow ambient light */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-bl from-sky-400/20 via-indigo-400/15 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center shadow-md ai-pulse-orb shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '9s' }} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  Anectta Neural Copilot
                </span>
                <span className="ai-badge px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  IA AUTÔNOMA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Assistente preditivo de infraestrutura, conexão inteligente e telemetria forense.
              </p>
            </div>
          </div>

          {/* AI Command Input Bar */}
          <form onSubmit={handleAiCommandSubmit} className="w-full md:max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Bot className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder="Ex: 'Conectar ao servidor de produção' ou 'Diagnosticar lentidão'"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-800 dark:text-white shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={aiIsAnalyzing || !aiPromptInput.trim()}
              className="px-3.5 py-2 rounded-xl btn-emergency text-xs font-bold text-white shadow-md transition disabled:opacity-50 shrink-0 flex items-center gap-1.5"
            >
              {aiIsAnalyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Executar</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Dynamic Output Message */}
        {aiAnalysisResult && (
          <div className="mt-3 pt-3 border-t border-sky-100/80 dark:border-slate-800 flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="leading-snug">{aiAnalysisResult}</span>
          </div>
        )}
      </div>

      {/* 2. MAIN DUAL CARD (Permitir Controle Remoto + Controlar Dispositivo com visual Neural) */}
      <div className={`rounded-3xl border shadow-xl transition-all relative overflow-hidden ${
        isNocMode 
          ? 'bg-black border-cyan-500/40 text-slate-100' 
          : 'bg-white/90 backdrop-blur-md border-slate-200/90 text-slate-800'
      }`}>
        {/* Subtle decorative mesh gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400" />

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* ========================================================================= */}
          {/* COLUNA ESQUERDA: PERMITIR CONTROLE REMOTO (5 Colunas no Desktop) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-cyan-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      Permitir Acesso a Este PC
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium">Túnel Seguro P2P ChaCha20</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300/60 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  STANDBY
                </span>
              </div>

              {/* Sub-Card: ID e Senha com visual HUD Futurista */}
              <div className="rounded-2xl p-5 bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-inner">
                {/* SUA ID */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Sua ID AnecttaDESK
                    </span>
                    <span className="text-[10px] text-sky-600 dark:text-cyan-400 font-mono font-semibold">
                      ID FIXO
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-wider font-mono select-all">
                      {localId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      title="Copiar ID"
                      className="p-2.5 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-white dark:hover:bg-slate-800 transition active:scale-95 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
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
                <div className="space-y-1 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Senha Temporária Dinâmica
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                      OTP SEGURO
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono select-all tracking-wide">
                      {localPassword}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={onRegeneratePassword}
                        title="Gerar nova chave aleatória"
                        className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-white dark:hover:bg-slate-800 transition active:scale-95 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCopyPassword}
                        title="Copiar Senha"
                        className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-white dark:hover:bg-slate-800 transition active:scale-95 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        {copiedPassword ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkbox: Permitir Acesso Fácil */}
              <div className="pt-1">
                <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={easyAccessEnabled}
                    onChange={(e) => setEasyAccessEnabled(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 focus:ring-offset-0 transition"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Acesso Não Supervisionado com MFA
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEasyAccessInfo(!showEasyAccessInfo)}
                    className="text-slate-400 hover:text-sky-600 transition"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </label>

                {showEasyAccessInfo && (
                  <div className="mt-2 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-sky-900 dark:text-sky-200 text-xs animate-in fade-in">
                    Permite que operadores autenticados da sua organização ({userName}) conectem-se a este endpoint sem confirmação presencial de senha.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Agent Status */}
            <div className="pt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <span>Zero-Trust Architecture</span>
              </span>
              <button
                onClick={onOpenAgentModal}
                className="text-sky-600 dark:text-cyan-400 hover:underline font-bold"
              >
                Instalar Serviço
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA DIREITA: CONTROLAR DISPOSITIVO REMOTO (7 Colunas no Desktop) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      Controlar Endpoint Remoto
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium">Conexão instantânea via ID ou Hostname</span>
                  </div>
                </div>

                {/* AI Adaptive Route Badge */}
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-sky-500" />
                  P2P DIRECT
                </span>
              </div>

              {/* Mode Selector Tabs (Controle Remoto / Arquivos / Chat) */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setConnectionMode('remote_control')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    connectionMode === 'remote_control'
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-cyan-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Controle Total</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConnectionMode('file_transfer')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    connectionMode === 'file_transfer'
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-cyan-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Transferir Arquivos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConnectionMode('direct_chat')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                    connectionMode === 'direct_chat'
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-cyan-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Chat & Suporte</span>
                </button>
              </div>

              {/* Form Input: ID ou Hostname com Autocomplete */}
              <form onSubmit={handleSubmitConnect} className="space-y-4">
                <div className="relative">
                  <div className="relative border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-4 pt-3 pb-2.5 focus-within:border-sky-500 dark:focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-sky-500/10 bg-white dark:bg-slate-900 transition shadow-sm">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      ID AnecttaDESK ou Endereço IP do Cliente
                    </label>
                    <div className="flex items-center justify-between pt-0.5">
                      <input
                        type="text"
                        value={targetIdInput}
                        onChange={handleIdChange}
                        placeholder="735 006 750"
                        className="w-full bg-transparent text-slate-900 dark:text-white font-mono text-xl font-bold focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Escolher dos seus computadores recentes"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown com Dispositivos Recentes */}
                  {showDeviceDropdown && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-30 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95">
                      <div className="p-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                        <span>Endpoints Recentes Detectados</span>
                        <span className="text-emerald-500 font-mono">IA Cache Ativo</span>
                      </div>
                      {recentDevices.map((dev) => (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={() => handleSelectRecentDevice(dev)}
                          className="w-full p-3 text-left hover:bg-sky-50/70 dark:hover:bg-slate-800 transition flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Monitor className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">
                                {dev.hostname}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {dev.publicIp} • {dev.osType}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-sky-600 dark:text-cyan-400 text-xs">
                            {dev.anecttadeskId || '735 006 750'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botão de Conexão com Estilo IA Tech */}
                <button
                  type="submit"
                  disabled={!canConnect}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase transition shadow-lg flex items-center justify-center space-x-2.5 cursor-pointer ${
                    canConnect
                      ? 'btn-emergency text-white active:scale-98 shadow-sky-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>CONECTAR AO ENDPOINT</span>
                  {canConnect && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>

            {/* Live Telemetry Pill Mini HUD */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Latência: {p2pLatency}ms</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Otimização IA: {neuralScore}%</span>
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenPwaModal}
                className="text-sky-600 dark:text-cyan-400 hover:underline font-bold text-xs"
              >
                Instalar no Windows
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. QUICK CONNECT ENDPOINTS WITH AI SMART TAGS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Endpoints Frequentes Sugeridos pela IA ({recentDevices.slice(0, 4).length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">1-Clique para conectar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {recentDevices.slice(0, 4).map((dev, idx) => (
            <div
              key={dev.id}
              onClick={() => {
                setTargetIdInput(dev.anecttadeskId || '735 006 750');
                onConnect(dev.anecttadeskId || '735 006 750', 'supervised');
              }}
              className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-sky-500 dark:hover:border-cyan-400 shadow-sm hover:shadow-md transition cursor-pointer group relative overflow-hidden"
            >
              {/* IA Confidence Glow Indicator */}
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold">
                    IA 99%
                  </span>
                  <span className={`w-2 h-2 rounded-full ${dev.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                </div>
              </div>

              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {dev.hostname}
              </div>
              <div className="text-[11px] font-mono text-sky-600 dark:text-cyan-400 font-bold mt-0.5">
                {dev.anecttadeskId || '735 006 750'}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-1">
                {dev.publicIp} • {dev.osType}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. BOTTOM NEURAL STATUS BAR */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Malha Neural Anectta conectada (WebRTC DataChannel 128-bit)
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          AnecttaDESK AI Edition • Build 2026.09-NEURAL
        </span>
      </div>

    </div>
  );
};
