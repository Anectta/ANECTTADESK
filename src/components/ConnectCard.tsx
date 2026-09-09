import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Copy, 
  Check, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowRight, 
  KeyRound, 
  Sliders, 
  Clock, 
  CheckCircle2,
  Lock,
  Radio
} from 'lucide-react';
import { Device } from '../types';

interface ConnectCardProps {
  onConnectById: (remoteId: string, mode: 'supervised' | 'unattended', password?: string) => void;
  recentDevices: Device[];
  onOpenDeviceDetail: (device: Device) => void;
}

export const ConnectCard: React.FC<ConnectCardProps> = ({
  onConnectById,
  recentDevices,
  onOpenDeviceDetail,
}) => {
  // Local Machine State (Seu Computador)
  const [localId] = useState('734 912 805');
  const [tempPassword, setTempPassword] = useState('k7#m9P$x');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [expiresIn, setExpiresIn] = useState(540); // 9 minutes countdown
  const [isUnattendedActive, setIsUnattendedActive] = useState(false);
  const [showUnattendedModal, setShowUnattendedModal] = useState(false);
  const [unattendedPassword, setUnattendedPassword] = useState('');

  // Remote Target State (Conectar a um Computador Remoto)
  const [remoteIdInput, setRemoteIdInput] = useState('');
  const [connectMode, setConnectMode] = useState<'supervised' | 'unattended'>('supervised');
  const [remoteAuthPassword, setRemoteAuthPassword] = useState('');
  const [inputError, setInputError] = useState('');

  // Password countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          // Regenerate password when expired
          generateNewPassword();
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateNewPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789#$!*';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(result);
    setExpiresIn(600);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(localId.replace(/\s+/g, ''));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Format 9-digit input as "XXX XXX XXX"
  const handleIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
    let formatted = raw;
    if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6)}`;
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
    }
    setRemoteIdInput(formatted);
    setInputError('');
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = remoteIdInput.replace(/\s+/g, '');
    if (cleanId.length < 9) {
      setInputError('Informe o ID completo de 9 dígitos (ex: 847 231 559)');
      return;
    }
    if (connectMode === 'unattended' && !remoteAuthPassword) {
      setInputError('Informe a senha de acesso não supervisionado para este ID');
      return;
    }
    onConnectById(remoteIdInput, connectMode, remoteAuthPassword);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
      {/* 1. SEU COMPUTADOR (CARD DA ESQUERDA) */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        {/* Subtle accent border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/80 text-cyan-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">Seu Computador</h2>
                <div className="text-xs text-slate-400">Pronto para receber conexões remotas</div>
              </div>
            </div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
              Online
            </div>
          </div>

          {/* ID Section */}
          <div className="mt-5 bg-slate-950/80 rounded-lg p-4 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              <span>Seu ID AnecttaDESK</span>
              <span className="text-[11px] text-slate-500">Identificador exclusivo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-cyan-400 select-all">
                {localId}
              </span>
              <button
                onClick={handleCopyId}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
                title="Copiar ID"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Senha de Uso Único */}
          <div className="mt-4 bg-slate-950/80 rounded-lg p-4 border border-slate-800/90">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium uppercase tracking-wider">
              <div className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Senha de Uso Único</span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-amber-400/90">
                <Clock className="w-3 h-3" />
                <span>Expira em {formatTime(expiresIn)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-mono font-bold tracking-wider text-slate-100 select-all min-w-[120px]">
                  {showPassword ? tempPassword : '••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                  title={showPassword ? 'Ocultar' : 'Exibir'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={generateNewPassword}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                  title="Gerar nova senha"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleCopyPassword}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
                >
                  {copiedPassword ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiar Senha</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Acesso Não Supervisionado Toggle */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Acesso não supervisionado</div>
              <div className="text-[11px] text-slate-400">
                {isUnattendedActive ? 'Ativo com senha permanente' : 'Desativado para este endpoint'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUnattendedModal(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
              isUnattendedActive
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isUnattendedActive ? 'Configurar / Desativar' : 'Ativar Acesso'}
          </button>
        </div>
      </div>

      {/* 2. CONECTAR A UM COMPUTADOR REMOTO (CARD DA DIREITA) */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400" />

        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/80 text-blue-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  Conectar a um Computador Remoto
                </h2>
                <div className="text-xs text-slate-400">
                  Insira o ID de 9 dígitos da máquina de destino
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleConnectSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                ID do Computador Remoto
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: 847 231 559"
                  value={remoteIdInput}
                  onChange={handleIdInputChange}
                  maxLength={11}
                  className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-4 py-3 font-mono text-xl text-white placeholder-slate-600 tracking-wider transition outline-none"
                />
                {remoteIdInput && (
                  <button
                    type="button"
                    onClick={() => setRemoteIdInput('')}
                    className="absolute right-3 top-3.5 text-xs text-slate-500 hover:text-slate-300"
                  >
                    Limpar
                  </button>
                )}
              </div>
              {inputError && (
                <div className="text-xs text-rose-400 mt-1 font-medium">{inputError}</div>
              )}
            </div>

            {/* Mode selection: Supervisionado vs Não Supervisionado */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setConnectMode('supervised')}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                  connectMode === 'supervised'
                    ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>Acesso Supervisionado</span>
              </button>

              <button
                type="button"
                onClick={() => setConnectMode('unattended')}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                  connectMode === 'unattended'
                    ? 'bg-blue-950/90 border-blue-500 text-blue-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Não Supervisionado</span>
              </button>
            </div>

            {connectMode === 'unattended' && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Senha Permanente de Acesso
                </label>
                <input
                  type="password"
                  placeholder="Senha configurada no endpoint"
                  value={remoteAuthPassword}
                  onChange={(e) => setRemoteAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-cyan-500 outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-cyan-950/50 active:scale-[0.99] transition tracking-wide text-sm"
            >
              <span>Conectar ao Dispositivo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Recentes Rápidos */}
        <div className="mt-5 pt-3 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Dispositivos Recentes na Organização:
          </div>
          <div className="flex flex-wrap gap-2">
            {recentDevices.slice(0, 3).map((dev) => (
              <button
                key={dev.id}
                onClick={() => {
                  setRemoteIdInput(dev.anecttadeskId);
                  onOpenDeviceDetail(dev);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    dev.status === 'online' ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
                <span className="font-medium">{dev.hostname}</span>
                <span className="text-[10px] text-slate-500">({dev.anecttadeskId})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: Configuração de Acesso Não Supervisionado */}
      {showUnattendedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Acesso Não Supervisionado</h3>
                <p className="text-xs text-slate-400">Permite conexões mesmo sem usuário local logado</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <label className="block text-slate-400 font-semibold mb-1">
                  Definir Senha Permanente
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 10 caracteres complexos"
                  value={unattendedPassword}
                  onChange={(e) => setUnattendedPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  A senha é cifrada com Argon2id + Sal criptográfico local.
                </p>
              </div>

              <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="font-semibold text-slate-300 mb-1">Permissões Permitidas:</div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                  <span>Visualizar tela & controlar mouse/teclado</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                  <span>Sincronizar área de transferência (Clipboard)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                  <span>Transferência de arquivos bidirecional</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded text-cyan-500" />
                  <span>Permitir reinicialização da máquina remota</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUnattendedModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setIsUnattendedActive(!isUnattendedActive);
                  setShowUnattendedModal(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow"
              >
                {isUnattendedActive ? 'Desativar Acesso' : 'Salvar e Ativar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
