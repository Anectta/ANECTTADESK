import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { Device } from '../types';

interface TeamViewerRemoteSupportProps {
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

export const TeamViewerRemoteSupport: React.FC<TeamViewerRemoteSupportProps> = ({
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
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Top Pill Tabs */}
      <div className="flex justify-center mb-6">
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

        {/* Promo / Resource Box (bottom right like TeamViewer screenshot) */}
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
