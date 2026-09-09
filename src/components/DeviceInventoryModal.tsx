import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Network, 
  X, 
  ShieldCheck, 
  Clock, 
  Server, 
  CheckCircle2, 
  Copy 
} from 'lucide-react';
import { Device } from '../types';

interface DeviceInventoryModalProps {
  device: Device;
  onClose: () => void;
  onConnect: (device: Device) => void;
}

export const DeviceInventoryModal: React.FC<DeviceInventoryModalProps> = ({
  device,
  onClose,
  onConnect,
}) => {
  const spec = device.hardwareSpec;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{device.hostname}</h3>
                <span className="font-mono text-xs text-cyan-400 font-bold">
                  [{device.anecttadeskId}]
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inventário Físico & Informações do Endpoint AnecttaDESK
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

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-xs">
          {/* Hardware & CPU */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Processador & Memória</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">CPU:</span>
              <strong className="font-medium text-slate-100">{spec.cpu}</strong>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Memória RAM:</span>
              <span className="font-mono text-emerald-400 font-bold">{spec.ramGb} GB DDR4/DDR5</span>
            </div>
            {spec.gpu && (
              <div className="text-slate-300">
                <span className="text-slate-400 block text-[11px]">GPU / Adaptador de Vídeo:</span>
                <span>{spec.gpu}</span>
              </div>
            )}
          </div>

          {/* Sistema & Armazenamento */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Sistema & Disco</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Sistema Operacional:</span>
              <span className="font-semibold text-white">{device.osVersion}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Armazenamento Principal:</span>
              <span className="font-mono text-cyan-400 font-bold">{spec.diskGb} GB NVMe SSD</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Número de Série:</span>
              <span className="font-mono text-slate-400">{spec.serialNumber || 'N/A'}</span>
            </div>
          </div>

          {/* Rede & Conectividade */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Network className="w-3.5 h-3.5" />
              <span>Rede & Endereçamento</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">IP Local:</span>
              <span className="font-mono text-cyan-300">{device.localIp}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">IP Público:</span>
              <span className="font-mono text-slate-400">{device.publicIp}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Endereço MAC:</span>
              <span className="font-mono text-slate-400">{spec.macAddress}</span>
            </div>
          </div>

          {/* Agent & Uptime */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Agent & Uptime</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Versão do Agent:</span>
              <span className="font-mono text-emerald-400 font-semibold">{device.agentVersion}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Tempo de Atividade (Uptime):</span>
              <span className="font-semibold text-white">{spec.uptimeHours} horas consecutivas</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400 block text-[11px]">Monitores Detectados:</span>
              <span>{spec.monitorsCount} display(s) ({spec.resolution})</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Último Heartbeat: {device.lastHeartbeat}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onClose();
                onConnect(device);
              }}
              disabled={device.status === 'offline'}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white shadow"
            >
              Conectar a este Endpoint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
