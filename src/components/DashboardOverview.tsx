import React from 'react';
import { 
  Monitor, 
  Wifi, 
  WifiOff, 
  Activity, 
  Clock, 
  Play, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileUp, 
  UserCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Device, AuditLog, RemoteSession } from '../types';

interface DashboardOverviewProps {
  devices: Device[];
  sessions: RemoteSession[];
  auditLogs: AuditLog[];
  onConnectDevice: (device: Device) => void;
  onOpenDeviceDetail: (device: Device) => void;
  onOpenReportModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  devices,
  sessions,
  auditLogs,
  onConnectDevice,
  onOpenDeviceDetail,
  onOpenReportModal,
}) => {
  const onlineDevices = devices.filter((d) => d.status === 'online');
  const offlineDevices = devices.filter((d) => d.status === 'offline');
  const activeSessions = sessions.filter((s) => s.status === 'active');

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Olá, Carlos Amor</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
              Técnico N3
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organização: <strong className="text-slate-300 font-medium">Anectta Enterprise Corp</strong> • Painel de Controle de Endpoints
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex flex-wrap items-center gap-3">
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold shadow-sm transition active:scale-95"
              title="Exportar Relatório Mensal Consolidado de SLA em PDF"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Relatório SLA (PDF)</span>
            </button>
          )}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Relays: <strong className="text-emerald-400">100% Operacionais</strong></span>
          </div>
        </div>
      </div>

      {/* Metric Cards (128 Computadores, 87 Online, 41 Offline, 6 Sessões ativas, 32 Hoje) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Computadores */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
            <span>Computadores</span>
            <Monitor className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            128
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total gerenciados</div>
        </div>

        {/* Online */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2 font-semibold">
            <span>Online</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            87
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Disponíveis agora</div>
        </div>

        {/* Offline */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-semibold">
            <span>Offline</span>
            <WifiOff className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-400 font-mono tracking-tight">
            41
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sem comunicação</div>
        </div>

        {/* Sessões Ativas */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-2 font-semibold">
            <span>Sessões Ativas</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
            06
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Em andamento</div>
        </div>

        {/* Sessões Hoje */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-blue-400 mb-2 font-semibold">
            <span>Sessões Hoje</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400 font-mono tracking-tight">
            32
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Concluídas hoje</div>
        </div>
      </div>

      {/* Two-Column Area: Computadores Online & Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Computadores Online */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                Computadores Online
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Exibindo principais estações ativas
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {onlineDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition">
                        {device.hostname}
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 border border-emerald-800/80 text-emerald-400">
                        ● Online
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5 font-mono">
                      <span>ID: {device.anecttadeskId}</span>
                      <span>•</span>
                      <span>{device.osVersion.split(' ')[0]}</span>
                      {device.currentUser && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500">{device.currentUser}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenDeviceDetail(device)}
                    className="px-2.5 py-1.5 rounded text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={() => onConnectDevice(device)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow transition active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Conectar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Atividade Recente */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Atividade Recente</span>
            </h2>
            <span className="text-xs text-slate-400">Tempo real</span>
          </div>

          <div className="mt-4 space-y-3">
            {auditLogs.slice(0, 5).map((log) => {
              let icon = <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
              let title = '';

              if (log.action === 'SESSION_STARTED') {
                icon = <Play className="w-4 h-4 text-emerald-400" />;
                title = `${log.userName?.split(' ')[0]} iniciou sessão em ${log.deviceHostname}`;
              } else if (log.action === 'SESSION_ENDED') {
                icon = <CheckCircle2 className="w-4 h-4 text-slate-400" />;
                title = `${log.userName?.split(' ')[0]} encerrou sessão em ${log.deviceHostname}`;
              } else if (log.action === 'FILE_UPLOAD' || log.action === 'FILE_DOWNLOAD') {
                icon = <FileUp className="w-4 h-4 text-amber-400" />;
                title = `Arquivo transferido para ${log.deviceHostname}`;
              } else if (log.action === 'LOGIN') {
                icon = <UserCheck className="w-4 h-4 text-blue-400" />;
                title = `${log.userName?.split(' ')[0]} fez login na plataforma`;
              } else {
                icon = <ShieldCheck className="w-4 h-4 text-cyan-400" />;
                title = `Dispositivo ${log.deviceHostname} auditado`;
              }

              return (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="mt-0.5 p-1.5 rounded bg-slate-900 border border-slate-800">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                      <span>IP: {log.ipAddress}</span>
                      <span>{log.timestamp.split(' ')[1]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
