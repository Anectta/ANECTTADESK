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
  Brain,
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
import { RotatingLoopArrows } from './RotatingLoopArrows';

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
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
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
              <Brain className="w-5 h-5 text-white drop-shadow-sm" />
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


      </div>

      {/* 2. SEÇÃO PRINCIPAL: TELAS À ESQUERDA + ENDPOINTS EMPILHADOS AO LADO */}
      <div className="grid grid-cols-1 lg:grid-cols-[365px_1fr] gap-6 items-start">
        
        {/* COLUNA ESQUERDA: TELAS DE COMPUTADOR (HOST + P2P + REMOTO) */}
        <div className="flex flex-col items-center space-y-1 w-full max-w-[365px]">
        
        {/* ========================================================================= */}
        {/* TELA DE COMPUTADOR 1 (EM CIMA): ESTE PC • COR AZUL ROYAL / SAPPHIRE       */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col">
          {/* Moldura / Chassi do Monitor (Sem o Pé) */}
          <div className="flex-1 rounded-[20px] p-2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/90 shadow-xl flex flex-col relative group transition-all">
            
            {/* Top Bezel do Monitor com Câmera / Sensor */}
            <div className="flex items-center justify-between px-2.5 py-0.5 mb-0.5 select-none text-[9px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="font-mono font-bold tracking-wider text-slate-400 uppercase">
                  DISPLAY 01 • HOST PC
                </span>
              </div>
              {/* Lente da Câmera / Sensor */}
              <div className="w-2 h-2 rounded-full bg-slate-800 ring-1 ring-slate-600/60 shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-400/80" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-emerald-400 font-bold">ONLINE</span>
              </div>
            </div>

            {/* Tela de Vidro do Computador (COR 1: Azul Profundo / Sapphire) */}
            <div className="flex-1 rounded-[14px] p-3.5 sm:p-4 bg-gradient-to-br from-[#0c244d] via-[#103166] to-[#081938] text-white border border-blue-400/30 relative overflow-hidden flex flex-col justify-between shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]">
              
              {/* Reflexo Diagonal de Vidro da Tela (Efeito Vidro Real) */}
              <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-25 transform-gpu" />
              <div className="pointer-events-none absolute top-0 left-0 w-48 h-48 bg-sky-400/15 rounded-full blur-3xl" />

              <div className="space-y-2.5 relative z-10">
                {/* Header da Tela */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 text-cyan-300 flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-tight drop-shadow-sm">
                        Minha Conexão
                      </h2>
                      <span className="text-[10px] text-cyan-200/80 font-medium">Túnel Seguro P2P ChaCha20</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 shadow-sm">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    STANDBY
                  </span>
                </div>

                {/* Sub-Cards: SUA ID e SENHA LADO A LADO NA HORIZONTAL */}
                <div className="grid grid-cols-2 gap-1.5">
                  {/* BOX 1: SUA ID */}
                  <div className="rounded-xl p-2 bg-black/35 backdrop-blur-md border border-white/15 flex flex-col justify-between space-y-1 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold text-cyan-200 uppercase tracking-wider truncate">
                        Sua ID
                      </span>
                      <span className="text-[7px] text-cyan-400 font-mono font-bold bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-500/30">
                        FIXO
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xs sm:text-sm font-black text-white tracking-tight font-mono select-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        {localId}
                      </span>
                      <button
                        onClick={handleCopyId}
                        title="Copiar ID"
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 hover:text-white border border-white/20 transition active:scale-95 shadow-sm"
                      >
                        {copiedId ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* BOX 2: SENHA TEMPORÁRIA */}
                  <div className="rounded-xl p-2 bg-black/35 backdrop-blur-md border border-white/15 flex flex-col justify-between space-y-1 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold text-cyan-200 uppercase tracking-wider truncate">
                        Senha
                      </span>
                      <span className="text-[7px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-500/30">
                        OTP
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-white font-mono select-all tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        {localPassword}
                      </span>
                      <div className="flex items-center space-x-0.5">
                        <button
                          onClick={onRegeneratePassword}
                          title="Gerar nova chave aleatória"
                          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 hover:text-white border border-white/20 transition active:scale-95 shadow-sm"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={handleCopyPassword}
                          title="Copiar Senha"
                          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 hover:text-white border border-white/20 transition active:scale-95 shadow-sm"
                        >
                          {copiedPassword ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkbox: Permitir Acesso Fácil */}
                <div className="pt-0.5">
                  <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={easyAccessEnabled}
                      onChange={(e) => setEasyAccessEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 text-cyan-500 rounded border-white/30 bg-black/40 focus:ring-cyan-400 focus:ring-offset-0 transition"
                    />
                    <span className="text-[11px] font-semibold text-cyan-100">
                      Acesso Não Supervisionado com MFA
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowEasyAccessInfo(!showEasyAccessInfo)}
                      className="text-cyan-300 hover:text-white transition"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </label>

                  {showEasyAccessInfo && (
                    <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-cyan-400/40 text-cyan-100 text-[11px] animate-in fade-in">
                      Permite que operadores autenticados da sua organização ({userName}) conectem-se a este endpoint sem confirmação presencial de senha.
                    </div>
                  )}
                </div>
              </div>

              {/* Rodapé da Tela do Monitor 1 */}
              <div className="pt-2 text-[10px] text-cyan-200/70 flex items-center justify-between border-t border-white/10 relative z-10 mt-2">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Zero-Trust Architecture</span>
                </span>
                <button
                  onClick={onOpenAgentModal}
                  className="text-cyan-300 hover:text-white hover:underline font-bold transition"
                >
                  Instalar Serviço
                </button>
              </div>
            </div>

            {/* Borda Inferior / Queixo do Monitor */}
            <div className="flex items-center justify-between px-2.5 pt-1 text-[8px] font-mono text-slate-400 select-none">
              <span className="tracking-widest uppercase font-bold text-slate-300">ANECTTA DISPLAY • HOST</span>
              <div className="flex items-center space-x-1">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                <span>1080p • 60Hz</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONECTOR P2P: SOMENTE AS SETAS EM FUNDO VAZADO (SEM ENCOSTAR NAS CAIXAS)  */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center py-0 relative z-20">
          {/* Duas setas retas verticais com espaçamento amplo */}
          <RotatingLoopArrows size={42} />
        </div>

        {/* ========================================================================= */}
        {/* TELA DE COMPUTADOR 2 (EMBAIXO): ENDPOINT REMOTO • COR CYAN / TEAL (VERDE) */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col">
          {/* Moldura / Chassi do Monitor (Sem o Pé) */}
          <div className="flex-1 rounded-[20px] p-2 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/90 shadow-xl flex flex-col relative group transition-all">
            
            {/* Top Bezel do Monitor com Câmera / Sensor */}
            <div className="flex items-center justify-between px-2.5 py-0.5 mb-0.5 select-none text-[9px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="font-mono font-bold tracking-wider text-slate-400 uppercase">
                  DISPLAY 02 • REMOTE CLIENT
                </span>
              </div>
              {/* Lente da Câmera / Sensor */}
              <div className="w-2 h-2 rounded-full bg-slate-800 ring-1 ring-slate-600/60 shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-cyan-300/80" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-cyan-300 font-bold">P2P DIRECT</span>
              </div>
            </div>

            {/* Tela de Vidro do Computador (Harmonizado com a cor Safira / Azul Profundo do Layout) */}
            <div className="flex-1 rounded-[14px] p-3.5 sm:p-4 bg-gradient-to-br from-[#0c244d] via-[#103166] to-[#081938] text-white border border-blue-400/30 relative overflow-hidden flex flex-col justify-between shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]">
              
              {/* Reflexo Diagonal de Vidro da Tela */}
              <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-25 transform-gpu" />
              <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 bg-sky-400/15 rounded-full blur-3xl" />

              <div className="space-y-2.5 relative z-10">
                {/* Header da Tela */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 text-cyan-300 flex items-center justify-center shadow-sm">
                      <Monitor className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-tight drop-shadow-sm">
                        Acessar PC Remotamente
                      </h2>
                      <span className="text-[10px] text-cyan-200/80 font-medium">Conexão instantânea via ID ou Hostname</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 flex items-center gap-1 shadow-sm">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    P2P DIRECT
                  </span>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 p-0.5 bg-black/35 backdrop-blur-md rounded-lg border border-white/15 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setConnectionMode('remote_control')}
                    className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 ${
                      connectionMode === 'remote_control'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                        : 'text-cyan-100/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>Controle Total</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectionMode('file_transfer')}
                    className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 ${
                      connectionMode === 'file_transfer'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                        : 'text-cyan-100/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Arquivos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectionMode('direct_chat')}
                    className={`flex-1 py-1 px-2 rounded-md font-bold transition flex items-center justify-center gap-1 ${
                      connectionMode === 'direct_chat'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                        : 'text-cyan-100/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Activity className="w-3 h-3" />
                    <span>Suporte</span>
                  </button>
                </div>

                {/* Form Input e Botão de Conectar Lado a Lado na Horizontal */}
                <form onSubmit={handleSubmitConnect} className="grid grid-cols-2 gap-1.5 items-stretch">
                  <div className="relative">
                    <div className="h-full relative border border-cyan-400/40 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-400/20 bg-black/40 backdrop-blur-md rounded-xl px-2.5 pt-1.5 pb-1.5 transition shadow-inner flex flex-col justify-between min-h-[46px]">
                      <label className="block text-[8px] font-bold text-cyan-200 uppercase tracking-wider truncate">
                        ID / IP Remoto
                      </label>
                      <div className="flex items-center justify-between pt-0.5">
                        <input
                          type="text"
                          value={targetIdInput}
                          onChange={handleIdChange}
                          placeholder="735 006 750"
                          className="w-full bg-transparent text-white font-mono text-xs sm:text-sm font-bold focus:outline-none placeholder:text-cyan-200/30 tracking-tight drop-shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                          className="p-0.5 text-cyan-300 hover:text-white transition rounded hover:bg-white/10"
                          title="Escolher dos seus computadores recentes"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dropdown com Dispositivos Recentes */}
                    {showDeviceDropdown && (
                      <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl z-40 max-h-56 overflow-y-auto divide-y divide-slate-800 animate-in fade-in zoom-in-95">
                        <div className="p-2 text-[9px] font-bold uppercase text-cyan-300 tracking-wider flex items-center justify-between">
                          <span>Endpoints Recentes</span>
                          <span className="text-emerald-400 font-mono text-[9px]">IA Ativa</span>
                        </div>
                        {recentDevices.map((dev) => (
                          <button
                            key={dev.id}
                            type="button"
                            onClick={() => handleSelectRecentDevice(dev)}
                            className="w-full p-2 text-left hover:bg-cyan-950/60 transition flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center space-x-1.5">
                              <Monitor className="w-3 h-3 text-cyan-400" />
                              <div>
                                <div className="font-bold text-white text-xs truncate max-w-[120px]">
                                  {dev.hostname}
                                </div>
                                <div className="text-[9px] text-cyan-200/60">
                                  {dev.publicIp}
                                </div>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-cyan-300 text-[10px]">
                              {dev.anecttadeskId || '735 006 750'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botão de Conexão com Estilo IA Tech - Lado a Lado */}
                  <button
                    type="submit"
                    disabled={!canConnect}
                    className={`h-full min-h-[46px] py-1.5 px-2 rounded-xl font-extrabold text-[11px] tracking-wider uppercase transition shadow-md flex items-center justify-center space-x-1 cursor-pointer ${
                      canConnect
                        ? 'btn-emergency text-white active:scale-98 shadow-cyan-500/30'
                        : 'bg-white/10 text-cyan-200/40 cursor-not-allowed border border-white/10'
                    }`}
                  >
                    <Zap className="w-3 h-3 shrink-0" />
                    <span>CONECTAR</span>
                    {canConnect && <ArrowRight className="w-3 h-3 shrink-0" />}
                  </button>
                </form>
              </div>

              {/* Live Telemetry Pill Mini HUD */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-cyan-200/80 relative z-10 mt-2">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center gap-1 font-mono bg-black/30 px-2 py-0.5 rounded border border-white/10">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>{p2pLatency}ms</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono bg-black/30 px-2 py-0.5 rounded border border-white/10">
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    <span>IA {neuralScore}%</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenPwaModal}
                  className="text-cyan-300 hover:text-white hover:underline font-bold transition"
                >
                  Instalar Windows
                </button>
              </div>
            </div>

            {/* Borda Inferior / Queixo do Monitor */}
            <div className="flex items-center justify-between px-2.5 pt-1 text-[8px] font-mono text-slate-400 select-none">
              <span className="tracking-widest uppercase font-bold text-slate-300">ANECTTA DISPLAY • REMOTE</span>
              <div className="flex items-center space-x-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span>H.265 • 3ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: ENDPOINTS FREQUENTES EMPILHADOS AO LADO DAS TELAS */}
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                Endpoints Frequentes Sugeridos pela IA ({recentDevices.slice(0, 4).length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">1-Clique para conectar</span>
          </div>

          <div className="flex flex-col space-y-2.5">
            {recentDevices.slice(0, 4).map((dev, idx) => (
              <div
                key={dev.id}
                onClick={() => {
                  setTargetIdInput(dev.anecttadeskId || '735 006 750');
                  onConnect(dev.anecttadeskId || '735 006 750', 'supervised');
                }}
                className="p-3.5 rounded-2xl border border-blue-400/30 bg-gradient-to-br from-[#0c244d] via-[#103166] to-[#081938] text-white hover:border-blue-400/60 shadow-md hover:shadow-lg hover:shadow-blue-950/50 transition-all duration-200 cursor-pointer group relative overflow-hidden flex items-center justify-between gap-3"
              >
                {/* Reflexo sutil de vidro / luz */}
                <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-25 transform-gpu" />
                <div className="pointer-events-none absolute top-0 left-0 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl" />

                {/* IA Confidence Glow Indicator */}
                <div className="flex items-center space-x-3 min-w-0 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-cyan-300 flex items-center justify-center group-hover:scale-105 transition shadow-inner shrink-0">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">
                      {dev.hostname}
                    </div>
                    <div className="text-[11px] font-mono text-cyan-300 font-bold mt-0.5">
                      {dev.anecttadeskId || '735 006 750'}
                    </div>
                    <div className="text-[10px] text-cyan-200/70 truncate mt-0.5">
                      {dev.publicIp} • {dev.osType}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1.5 shrink-0 relative z-10">
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/30 border border-white/15 text-cyan-200 font-bold">
                      IA 99%
                    </span>
                    <span className={`w-2 h-2 rounded-full ${dev.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-300 group-hover:text-white group-hover:translate-x-0.5 transition-all flex items-center gap-0.5">
                    Conectar <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>


    </div>
  );
};
