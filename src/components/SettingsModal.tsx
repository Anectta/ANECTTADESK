import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Server, 
  ShieldCheck, 
  Video, 
  Film, 
  Save, 
  CheckCircle2, 
  Radio, 
  Lock,
  Contrast,
  Eye,
  Terminal,
  Activity
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsModalProps {
  settings: SystemSettings;
  onClose: () => void;
  onSaveSettings: (newSettings: SystemSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onClose,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'network' | 'security' | 'video' | 'recording' | 'noc'>('network');
  const [form, setForm] = useState<SystemSettings>({
    ...settings,
    themeMode: settings.themeMode || 'standard_dark',
    nocHighContrastLogs: settings.nocHighContrastLogs ?? true,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configurações Gerais do AnecttaDESK</h3>
              <p className="text-xs text-slate-400">
                Parâmetros de rede, nós de sinalização, criptografia e codec de transmissão
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 my-4 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('network')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-2 transition ${
              activeTab === 'network'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Rede & Signaling</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-2 transition ${
              activeTab === 'security'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Segurança & Cripto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-2 transition ${
              activeTab === 'video'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Codec & Vídeo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recording')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-2 transition ${
              activeTab === 'recording'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Auditoria & Vídeo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('noc')}
            className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-2 transition ${
              activeTab === 'noc'
                ? 'bg-cyan-600 text-white shadow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Contrast className="w-3.5 h-3.5 text-cyan-400" />
            <span>NOC & Contraste</span>
          </button>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
          {/* 1. NETWORK TAB */}
          {activeTab === 'network' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Servidor de Sinalização (Signaling WebSocket)
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    URL do Cluster de Signaling:
                  </label>
                  <input
                    type="text"
                    value={form.signalingUrl}
                    onChange={(e) => setForm({ ...form, signalingUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 outline-none"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Conexão segura bidirecional WSS com keep-alive a cada 15 segundos.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Servidor STUN (NAT Traversal RFC 5389):
                  </label>
                  <input
                    type="text"
                    value={form.stunServer}
                    onChange={(e) => setForm({ ...form, stunServer: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nó de Relay Prioritário (Fallback quando P2P é bloqueado):
                  </label>
                  <select
                    value={form.relayCluster}
                    onChange={(e) => setForm({ ...form, relayCluster: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="sa-east-1-sp1">São Paulo (SP1 - Latência ~12ms)</option>
                    <option value="sa-east-2-rj1">Rio de Janeiro (RJ1 - Latência ~16ms)</option>
                    <option value="sa-east-3-bsb1">Brasília (BSB1 - Latência ~21ms)</option>
                    <option value="auto">Seleção Automática de Menor RTT</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Criptografia de Ponta a Ponta (E2EE)
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Suíte Criptográfica Preferencial:
                  </label>
                  <select
                    value={form.preferredCipher}
                    onChange={(e) => setForm({ ...form, preferredCipher: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 (Alta performance em CPU sem AES-NI)</option>
                    <option value="AES-256-GCM">AES-256-GCM (Aceleração por hardware Intel/AMD)</option>
                  </select>
                </div>

                <div className="pt-2 space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.requireMfaForUnattended}
                      onChange={(e) => setForm({ ...form, requireMfaForUnattended: e.target.checked })}
                      className="rounded text-cyan-500"
                    />
                    <span className="text-slate-200">Exigir autenticação multifator (2FA/TOTP) para acesso não supervisionado</span>
                  </label>

                  <div className="pt-2">
                    <label className="block text-slate-300 font-medium mb-1">
                      Tempo Limite de Inatividade da Sessão (Minutos):
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={form.sessionInactivityTimeoutMinutes}
                      onChange={(e) => setForm({ ...form, sessionInactivityTimeoutMinutes: Number(e.target.value) })}
                      className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. VIDEO & CODEC TAB */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Mecanismo de Renderização & Codec
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Codec de Vídeo Padrão:
                  </label>
                  <select
                    value={form.defaultVideoCodec}
                    onChange={(e) => setForm({ ...form, defaultVideoCodec: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="auto">Automático (Detecção adaptativa por largura de banda)</option>
                    <option value="h264">H.264 / AVC (Aceleração por hardware NVENC / QuickSync)</option>
                    <option value="vp9">VP9 (Melhor fidelidade de texto fino e contraste)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Limite Máximo de Taxa de Quadros (FPS):
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, maxFpsLimit: 30 })}
                      className={`px-4 py-2 rounded-lg border font-bold ${
                        form.maxFpsLimit === 30
                          ? 'bg-cyan-600 border-cyan-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      30 FPS (Modo Econômico)
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, maxFpsLimit: 60 })}
                      className={`px-4 py-2 rounded-lg border font-bold ${
                        form.maxFpsLimit === 60
                          ? 'bg-cyan-600 border-cyan-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      60 FPS (Ultra Fluido DirectX Duplication)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. AUDIT & RECORDING TAB */}
          {activeTab === 'recording' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
                  Gravação Automática de Sessões
                </div>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.autoRecordSessions}
                    onChange={(e) => setForm({ ...form, autoRecordSessions: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span className="text-slate-200">
                    Gravar automaticamente todas as sessões remotas para conformidade e auditoria forense
                  </span>
                </label>

                <p className="text-[11px] text-slate-400">
                  Os arquivos de evidência são salvos em formato `.adrec` com integridade criptográfica SHA-256 e carimbo de tempo assinado.
                </p>
              </div>
            </div>
          )}

          {/* 5. NOC & HIGH CONTRAST TAB */}
          {activeTab === 'noc' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center space-x-2">
                    <Contrast className="w-4 h-4 text-cyan-400" />
                    <span>Ambiente NOC (Network Operations Center) & Alto Contraste</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    WCAG AAA
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Otimizado especificamente para salas de controle, telões 24/7 de videowall e operadores em turnos com baixa luz ambiente. Elimina ofuscamento e vazamento de backlight, proporcionando contraste superior para logs de auditoria e métricas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option 1: Standard Dark */}
                  <div
                    onClick={() => setForm({ ...form, themeMode: 'standard_dark' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      form.themeMode === 'standard_dark'
                        ? 'bg-slate-900 border-cyan-500 shadow-lg ring-1 ring-cyan-500/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-100 text-xs">Standard Dark</span>
                      {form.themeMode === 'standard_dark' && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="h-10 rounded bg-slate-900 border border-slate-800 flex items-center px-2 space-x-1.5 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/50" />
                      <div className="w-12 h-2 rounded bg-slate-700" />
                      <div className="w-8 h-2 rounded bg-slate-800" />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Paleta Slate 900 balanceada para estações de trabalho em salas convencionais.
                    </p>
                  </div>

                  {/* Option 2: NOC High Contrast */}
                  <div
                    onClick={() => setForm({ ...form, themeMode: 'noc_high_contrast' })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      form.themeMode === 'noc_high_contrast'
                        ? 'bg-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-white text-xs">NOC High Contrast</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          OLED
                        </span>
                      </div>
                      {form.themeMode === 'noc_high_contrast' && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="h-10 rounded bg-black border border-cyan-500/50 flex items-center px-2 space-x-1.5 mb-2 shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00ff88]" />
                      <div className="w-12 h-2 rounded bg-cyan-400/80" />
                      <div className="w-8 h-2 rounded bg-emerald-400/80" />
                    </div>
                    <p className="text-[10px] text-slate-300 leading-tight font-medium">
                      Fundo preto absoluto (OLED void), texto fosforescente nítido e bordas de alta definição.
                    </p>
                  </div>
                </div>

                {/* Additional NOC options */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.nocHighContrastLogs ?? true}
                      onChange={(e) => setForm({ ...form, nocHighContrastLogs: e.target.checked })}
                      className="mt-0.5 rounded text-cyan-500 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <span className="text-slate-200 font-semibold block text-xs">
                        Realce Monospace de Logs em Baixa Luminosidade
                      </span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        Exibe IPs, carimbos de tempo UTC, códigos de retorno e eventos forenses com contraste cromático phosphor aumentado (Cyan/Verde/Âmbar).
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Configurações salvas com sucesso!</span>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
