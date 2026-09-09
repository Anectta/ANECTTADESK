import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RefreshCw, 
  ChevronDown, 
  Info, 
  Monitor, 
  ArrowRight,
  ShieldCheck,
  Lock
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
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
      
      {/* Top Pill Navigation (ID do AnecttaDESK | Sessões Recentes) */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            Serviço de Acesso Remoto Ativo (TLS 1.3 • WebRTC P2P)
          </span>
        </div>

        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-sky-700 dark:text-cyan-300 font-bold text-xs shadow-sm transition"
          >
            ID do AnecttaDESK
          </button>
          <button
            type="button"
            onClick={onSwitchToSessions}
            className="px-4 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-xs transition"
          >
            Histórico de Sessões
          </button>
        </div>
      </div>

      {/* Main Dual Card (Permitir Controle Remoto + Controlar Dispositivo Remoto) */}
      <div className={`rounded-2xl border shadow-sm transition-colors ${
        isNocMode 
          ? 'bg-black border-cyan-500/40 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* ========================================================================= */}
          {/* COLUNA ESQUERDA: PERMITIR CONTROLE REMOTO */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
                  <span>Permitir controle remoto</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                  Pronto
                </span>
              </div>

              {/* Sub-Card: ID e Senha */}
              <div className="bg-[#f8fafc] dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 space-y-5 shadow-sm">
                {/* SUA ID */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Sua ID AnecttaDESK
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-wider font-mono select-all">
                      {localId}
                    </span>
                    <button
                      onClick={handleCopyId}
                      title="Copiar ID"
                      className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition active:scale-95"
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
                <div className="space-y-1.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Senha Temporária
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono select-all tracking-wide">
                      {localPassword}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={onRegeneratePassword}
                        title="Gerar nova senha aleatória"
                        className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition active:scale-95"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCopyPassword}
                        title="Copiar Senha"
                        className="p-2 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition active:scale-95"
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
              <div className="pt-1">
                <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={easyAccessEnabled}
                    onChange={(e) => setEasyAccessEnabled(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 focus:ring-offset-0 transition"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Permitir Acesso Fácil não supervisionado
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
                  <div className="mt-2.5 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-sky-900 dark:text-sky-200 text-xs animate-in fade-in">
                    O Acesso Fácil permite que operadores autenticados da sua conta AnecttaDESK ({userName}) conectem-se a este endpoint sem necessidade de aprovação presencial.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Agent Installer Note */}
            <div className="pt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <span>ChaCha20-Poly1305 / AES-256 E2E</span>
              </span>
              <button
                onClick={onOpenAgentModal}
                className="text-sky-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Instalar como Serviço
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUNA DIREITA: CONTROLAR DISPOSITIVO REMOTO */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Monitor className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
                <span>Controlar dispositivo remoto</span>
              </h2>

              {/* Mode Selector (Controle remoto ∨) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="inline-flex items-center space-x-1.5 text-sky-600 dark:text-cyan-400 hover:text-sky-700 text-xs font-semibold transition"
                >
                  <span>
                    Modo: {connectionMode === 'remote_control' && 'Controle remoto total'}
                    {connectionMode === 'file_transfer' && 'Transferência de arquivos'}
                    {connectionMode === 'direct_chat' && 'Chat direto com usuário'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showModeDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setConnectionMode('remote_control');
                        setShowModeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <span>Controle remoto</span>
                      {connectionMode === 'remote_control' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setConnectionMode('file_transfer');
                        setShowModeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <span>Transferência de arquivos</span>
                      {connectionMode === 'file_transfer' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setConnectionMode('direct_chat');
                        setShowModeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <span>Chat direto</span>
                      {connectionMode === 'direct_chat' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Form Input: ID, endereço IP ou nome do host */}
              <form onSubmit={handleSubmitConnect} className="space-y-4">
                <div className="relative">
                  <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl px-4 pt-2.5 pb-2 focus-within:border-sky-600 dark:focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-sky-600 dark:focus-within:ring-cyan-400 bg-white dark:bg-slate-900 transition">
                    <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      ID, endereço IP ou nome do host do cliente
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
                        title="Escolher dos seus computadores recentes"
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
                            <Monitor className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                            <div>
                              <div className="font-bold text-slate-800 dark:text-white">
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

                {/* Primary Action Button: Conectar */}
                <div>
                  <button
                    type="submit"
                    disabled={!canConnect}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center space-x-2 ${
                      canConnect
                        ? 'btn-emergency text-white active:scale-98 cursor-pointer'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>Conectar ao Endpoint</span>
                    {canConnect && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Host Lookup Tip */}
            <div className="pt-4 text-xs text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>Modo Supervisionado habilitado</span>
              </span>
              <button
                type="button"
                onClick={onOpenPwaModal}
                className="text-sky-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Instalar no Desktop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dispositivos Recentes / Quick Access Grid (Padrão AnyDesk/RustDesk) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
            Dispositivos Recentes para Conexão Imediata ({recentDevices.slice(0, 4).length})
          </h3>
          <span className="text-[11px] text-slate-400">Clique para conectar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {recentDevices.slice(0, 4).map((dev) => (
            <div
              key={dev.id}
              onClick={() => {
                setTargetIdInput(dev.anecttadeskId || '735 006 750');
                onConnect(dev.anecttadeskId || '735 006 750', 'supervised');
              }}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-500 dark:hover:border-cyan-400 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition">
                  <Monitor className="w-4 h-4" />
                </div>
                <span className={`w-2 h-2 rounded-full ${dev.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              </div>
              <div className="font-bold text-xs text-slate-800 dark:text-white truncate">
                {dev.hostname}
              </div>
              <div className="text-[11px] font-mono text-sky-600 dark:text-cyan-400 font-semibold mt-0.5">
                {dev.anecttadeskId || '735 006 750'}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-1">
                {dev.publicIp} • {dev.osType}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Rede P2P Anectta conectada (Latência média: 4ms)</span>
        </div>
        <span className="font-mono text-[11px]">AnecttaDESK v1.0.0 • Build 2026.09</span>
      </div>
    </div>
  );
};
