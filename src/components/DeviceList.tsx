import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  Info, 
  FolderOpen, 
  MessageSquare, 
  Cpu, 
  Settings, 
  Star, 
  MoreVertical, 
  Monitor, 
  Laptop, 
  Server, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Trash2,
  Power,
  Radio,
  Terminal
} from 'lucide-react';
import { Device, DeviceStatus, OSType } from '../types';
import { DeviceSettingsModal } from './DeviceSettingsModal';

interface DeviceListProps {
  devices: Device[];
  onConnectDevice: (device: Device) => void;
  onOpenDeviceDetail: (device: Device) => void;
  onOpenFileManager: (device: Device) => void;
  onOpenChat: (device: Device) => void;
  onToggleFavorite: (deviceId: string) => void;
  onlyFavorites?: boolean;
  onUpdateDevice?: (updated: Device) => void;
  onTriggerWol?: (macAddress: string, hostname: string) => void;
  onOpenAutomation?: () => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  onConnectDevice,
  onOpenDeviceDetail,
  onOpenFileManager,
  onOpenChat,
  onToggleFavorite,
  onlyFavorites = false,
  onUpdateDevice,
  onTriggerWol,
  onOpenAutomation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deviceToConfigure, setDeviceToConfigure] = useState<Device | null>(null);

  // Filter devices
  const filteredDevices = devices.filter((d) => {
    if (onlyFavorites && !d.isFavorite) return false;

    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (groupFilter !== 'all' && d.groupName !== groupFilter) return false;

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchHost = d.hostname.toLowerCase().includes(term);
      const matchId = d.anecttadeskId.replace(/\s+/g, '').includes(term.replace(/\s+/g, ''));
      const matchUser = d.currentUser?.toLowerCase().includes(term) ?? false;
      const matchIp = d.publicIp.includes(term) || d.localIp.includes(term);
      if (!matchHost && !matchId && !matchUser && !matchIp) return false;
    }

    return true;
  });

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Online
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5" />
            Offline
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-700/60 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
            Ocupado
          </span>
        );
      case 'connecting':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-ping" />
            Conectando
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-700/60 text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-1.5" />
            Manutenção
          </span>
        );
      case 'disabled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-800 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
            Desativado
          </span>
        );
    }
  };

  const getOsIcon = (os: OSType) => {
    switch (os) {
      case 'windows':
        return <Laptop className="w-4 h-4 text-cyan-400" title="Windows" />;
      case 'linux':
        return <Server className="w-4 h-4 text-amber-400" title="Linux" />;
      case 'macos':
        return <Monitor className="w-4 h-4 text-purple-400" title="macOS" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-emerald-400" title="Android" />;
    }
  };

  const uniqueGroups = Array.from(new Set(devices.map((d) => d.groupName).filter(Boolean)));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
      {/* Table Top Controls & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">
            {onlyFavorites ? 'Dispositivos Favoritos' : 'Meus Dispositivos'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento de computadores registrados e inventário de rede
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar Nome, ID ou IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="all">Todos os Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="busy">Ocupado</option>
            <option value="maintenance">Manutenção</option>
          </select>

          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="all">Todos os Grupos</option>
            {uniqueGroups.map((grp) => (
              <option key={grp} value={grp!}>
                {grp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 w-10 text-center">Fav</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3 font-mono">ID AnecttaDESK</th>
              <th className="px-4 py-3">Sistema Operacional</th>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Última Conexão</th>
              <th className="px-4 py-3">Grupo</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500 text-sm">
                  Nenhum dispositivo encontrado correspondente aos filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredDevices.map((dev) => (
                <tr
                  key={dev.id}
                  className="hover:bg-slate-800/40 transition group select-none"
                >
                  {/* Favorite Toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onToggleFavorite(dev.id)}
                      className="text-slate-500 hover:text-amber-400 transition"
                      title={dev.isFavorite ? 'Remover dos favoritos' : 'Marcar como favorito'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          dev.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(dev.status)}
                  </td>

                  {/* Nome */}
                  <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="group-hover:text-cyan-400 transition">
                        {dev.hostname}
                      </span>
                      {dev.isUnattendedEnabled && (
                        <Shield className="w-3.5 h-3.5 text-cyan-400" title="Acesso Não Supervisionado Ativo" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      IP: {dev.localIp}
                    </div>
                  </td>

                  {/* ID */}
                  <td className="px-4 py-3 font-mono font-bold text-cyan-400 whitespace-nowrap tracking-wider">
                    {dev.anecttadeskId}
                  </td>

                  {/* Sistema Operacional */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getOsIcon(dev.osType)}
                      <span className="text-slate-200">{dev.osVersion}</span>
                    </div>
                  </td>

                  {/* Usuário */}
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {dev.currentUser || <span className="text-slate-600">Sem sessão</span>}
                  </td>

                  {/* Última Conexão / Heartbeat */}
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                    {dev.lastHeartbeat}
                  </td>

                  {/* Grupo */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60">
                      {dev.groupName || 'Padrão'}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* Conectar button */}
                      <button
                        onClick={() => onConnectDevice(dev)}
                        disabled={dev.status === 'offline'}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-bold transition active:scale-95 ${
                          dev.status === 'offline'
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow shadow-cyan-950'
                        }`}
                        title="Iniciar Conexão Remota"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Conectar</span>
                      </button>

                      {/* Dropdown Menu trigger for additional actions */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === dev.id ? null : dev.id)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Mais Ações"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === dev.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-slate-950 border border-slate-700 rounded-lg shadow-2xl py-1 z-30 text-xs text-slate-200">
                            <button
                              onClick={() => {
                                onOpenDeviceDetail(dev);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                            >
                              <Info className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Informações</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenFileManager(dev);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                              <span>Arquivos</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenChat(dev);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Chat</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenDeviceDetail(dev);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2"
                            >
                              <Cpu className="w-3.5 h-3.5 text-purple-400" />
                              <span>Inventário</span>
                            </button>
                            <div className="border-t border-slate-800 my-1" />
                            <button
                              onClick={() => {
                                setDeviceToConfigure(dev);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 text-slate-300"
                            >
                              <Settings className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Configurações</span>
                            </button>
                            <button
                              onClick={() => {
                                onOpenAutomation?.();
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 text-slate-300"
                            >
                              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Executar Script</span>
                            </button>
                            {dev.status === 'offline' && (
                              <button
                                onClick={() => {
                                  onTriggerWol?.(dev.hardwareSpec.macAddress, dev.hostname);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center space-x-2 text-emerald-400 font-semibold"
                              >
                                <Power className="w-3.5 h-3.5" />
                                <span>Wake-on-LAN</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Exibindo {filteredDevices.length} de {devices.length} dispositivos totais</span>
        <span>AnecttaDESK Control Plane v1.4.2</span>
      </div>

      {/* Device Settings Modal */}
      {deviceToConfigure && (
        <DeviceSettingsModal
          device={deviceToConfigure}
          availableGroups={uniqueGroups}
          onClose={() => setDeviceToConfigure(null)}
          onSaveDevice={(updated) => {
            onUpdateDevice?.(updated);
            setDeviceToConfigure(null);
          }}
          onTriggerWol={(mac, host) => {
            onTriggerWol?.(mac, host);
          }}
        />
      )}
    </div>
  );
};
