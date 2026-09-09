import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Wifi, 
  Radio, 
  FolderTree, 
  Power, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  AlertTriangle, 
  Save 
} from 'lucide-react';
import { Device, DeviceStatus } from '../types';

interface DeviceSettingsModalProps {
  device: Device;
  availableGroups: string[];
  onClose: () => void;
  onSaveDevice: (updated: Device) => void;
  onTriggerWol: (macAddress: string, hostname: string) => void;
}

export const DeviceSettingsModal: React.FC<DeviceSettingsModalProps> = ({
  device,
  availableGroups,
  onClose,
  onSaveDevice,
  onTriggerWol,
}) => {
  const [hostname, setHostname] = useState(device.hostname);
  const [groupName, setGroupName] = useState(device.groupName || 'Sem Grupo');
  const [status, setStatus] = useState<DeviceStatus>(device.status);
  const [isUnattendedEnabled, setIsUnattendedEnabled] = useState(device.isUnattendedEnabled);
  const [wolSending, setWolSending] = useState(false);
  const [wolMessage, setWolMessage] = useState<string | null>(null);

  const handleSendWol = () => {
    setWolSending(true);
    setTimeout(() => {
      setWolSending(false);
      setWolMessage(`Magic Packet (WOL) enviado para ${device.hardwareSpec.macAddress} na sub-rede local.`);
      onTriggerWol(device.hardwareSpec.macAddress, device.hostname);
      setTimeout(() => setWolMessage(null), 4000);
    }, 600);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Device = {
      ...device,
      hostname: hostname.trim(),
      groupName: groupName === 'Sem Grupo' ? undefined : groupName,
      status,
      isUnattendedEnabled,
    };
    onSaveDevice(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Configurações do Endpoint</h3>
                <span className="font-mono text-xs text-cyan-400 font-bold">[{device.anecttadeskId}]</span>
              </div>
              <p className="text-xs text-slate-400">
                Políticas de governança, grupo organizacional e Wake-on-LAN
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

        <form onSubmit={handleSave} className="space-y-4 my-5 text-xs">
          {/* Hostname & Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Nome do Dispositivo (Hostname)
              </label>
              <input
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-cyan-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Grupo Organizacional
              </label>
              <select
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
              >
                <option value="Sem Grupo">Sem Grupo</option>
                {availableGroups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Operational Status */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Estado Operacional do Endpoint
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'online', label: 'Produção (Ativo)', color: 'text-emerald-400' },
                { key: 'maintenance', label: 'Em Manutenção', color: 'text-indigo-400' },
                { key: 'disabled', label: 'Desativado / Bloqueado', color: 'text-rose-400' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => setStatus(s.key as DeviceStatus)}
                  className={`py-2 px-2.5 rounded-lg border text-left transition ${
                    status === s.key
                      ? 'bg-slate-800 border-cyan-500 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <div className={`font-bold ${s.color}`}>{s.label}</div>
                  <div className="text-[10px] text-slate-500">Política de acesso</div>
                </button>
              ))}
            </div>
          </div>

          {/* Wake-on-LAN (WoL) Sub-system */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                <Radio className="w-4 h-4" />
                <span>Wake-on-LAN (WoL) Sub-rede</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                MAC: {device.hardwareSpec.macAddress}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Transmita um Magic Packet (FF:FF:FF:FF:FF:FF + 16x MAC) via broadcast UDP porta 9 através do agente local mais próximo.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Status Atual: <strong className="text-white uppercase">{device.status}</strong>
              </div>
              <button
                type="button"
                onClick={handleSendWol}
                disabled={wolSending}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 flex items-center space-x-1.5 transition active:scale-95"
              >
                <Power className="w-3.5 h-3.5 text-cyan-400" />
                <span>{wolSending ? 'Enviando...' : 'Despertar Computador (WoL)'}</span>
              </button>
            </div>
            {wolMessage && (
              <div className="mt-2 p-2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{wolMessage}</span>
              </div>
            )}
          </div>

          {/* Acesso Não Supervisionado Check */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-white text-xs">Acesso Não Supervisionado Habilitado</div>
              <div className="text-slate-400 text-[11px]">
                Permite conexão direta com autenticação de credencial fixa do endpoint
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isUnattendedEnabled}
                onChange={(e) => setIsUnattendedEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Footer Buttons */}
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
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
