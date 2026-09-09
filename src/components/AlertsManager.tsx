import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Activity, 
  HardDrive, 
  Cpu, 
  WifiOff, 
  ShieldAlert, 
  Monitor, 
  Terminal, 
  ArrowUpRight,
  Filter,
  Check,
  RotateCcw,
  Bell,
  Sliders,
  X
} from 'lucide-react';
import { SystemAlert, AlertSeverity, AlertType, Device } from '../types';

interface AlertsManagerProps {
  alerts: SystemAlert[];
  devices: Device[];
  onResolveAlert: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onConnectDevice: (device: Device) => void;
  onRunDiagnostic: (deviceId: string, alertType: AlertType) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  alerts,
  devices,
  onResolveAlert,
  onMarkAsRead,
  onMarkAllAsRead,
  onConnectDevice,
  onRunDiagnostic,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [resolvedFilter, setResolvedFilter] = useState<'unresolved' | 'all' | 'resolved'>('unresolved');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Threshold config state simulation
  const [thresholds, setThresholds] = useState({
    cpu: 85,
    ram: 85,
    disk: 10,
    heartbeatTimeout: 3,
  });

  const getAlertIcon = (type: AlertType, severity: AlertSeverity) => {
    switch (type) {
      case 'cpu_spike':
        return <Cpu className={`w-5 h-5 ${severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`} />;
      case 'disk_low':
        return <HardDrive className={`w-5 h-5 ${severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`} />;
      case 'ram_high':
        return <Activity className="w-5 h-5 text-amber-400" />;
      case 'heartbeat_loss':
        return <WifiOff className="w-5 h-5 text-rose-400" />;
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-cyan-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            <span>CRÍTICO</span>
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>ALERTA</span>
          </span>
        );
      case 'info':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>INFORMATIVO</span>
          </span>
        );
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesResolved = 
      resolvedFilter === 'all' 
        ? true 
        : resolvedFilter === 'resolved' 
          ? alert.isResolved 
          : !alert.isResolved;
    const matchesSearch = 
      alert.deviceHostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesResolved && matchesSearch;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.isResolved).length;
  const warningCount = alerts.filter((a) => a.severity === 'warning' && !a.isResolved).length;
  const unreadCount = alerts.filter((a) => !a.isRead && !a.isResolved).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Central de Alertas & Saúde Proativa
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                  REAL-TIME DAEMON
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Monitoramento contínuo dos agentes remotos. Disparo de alertas preventivos de hardware, recursos de sistema e conectividade antes que impactem a operação.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Limiares de Notificação</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="px-3.5 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Marcar Todos Lidos</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-md bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-rose-400">{criticalCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Alertas Críticos</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-amber-400">{warningCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Alertas de Atenção</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400">{unreadCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Não Lidos</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">
                {alerts.filter((a) => a.isResolved).length}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Incidentes Resolvidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setResolvedFilter('unresolved')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                resolvedFilter === 'unresolved'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ativos ({alerts.filter((a) => !a.isResolved).length})
            </button>
            <button
              onClick={() => setResolvedFilter('resolved')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                resolvedFilter === 'resolved'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Resolvidos ({alerts.filter((a) => a.isResolved).length})
            </button>
            <button
              onClick={() => setResolvedFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                resolvedFilter === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({alerts.length})
            </button>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                severityFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas Severidades
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                severityFilter === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Críticos
            </button>
            <button
              onClick={() => setSeverityFilter('warning')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                severityFilter === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Atenção
            </button>
          </div>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Filtrar por host, título ou detalhe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-semibold text-white">Nenhum alerta ativo encontrado</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Todos os endpoints reportaram métricas dentro dos parâmetros de conformidade esperados.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const targetDevice = devices.find((d) => d.id === alert.deviceId);

            return (
              <div
                key={alert.id}
                className={`bg-slate-900 border rounded-xl p-4 transition-all hover:border-slate-700 ${
                  alert.isResolved
                    ? 'border-slate-800/80 opacity-70'
                    : alert.severity === 'critical'
                    ? 'border-rose-900/50 bg-rose-950/10'
                    : alert.severity === 'warning'
                    ? 'border-amber-900/40 bg-amber-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Icon & Description */}
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`p-2.5 rounded-xl border mt-0.5 ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/10 border-rose-500/30'
                          : alert.severity === 'warning'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-cyan-500/10 border-cyan-500/30'
                      }`}
                    >
                      {getAlertIcon(alert.type, alert.severity)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getSeverityBadge(alert.severity)}
                        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                        <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {alert.deviceHostname}
                        </span>
                        <span className="text-[11px] text-slate-400">· {alert.timestamp}</span>
                        {alert.isResolved && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            RESOLVIDO
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {alert.message}
                      </p>

                      <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-400">
                        <span>
                          Valor Observado: <strong className="text-white font-mono">{alert.metricValue}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Limiar de Disparo: <span className="text-slate-300 font-mono">{alert.metricThreshold}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800 self-end lg:self-center">
                    {targetDevice && (
                      <button
                        onClick={() => onConnectDevice(targetDevice)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-cyan-900/20 transition-all"
                        title="Abrir sessão remota direta neste endpoint"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Acessar Host</span>
                      </button>
                    )}

                    <button
                      onClick={() => onRunDiagnostic(alert.deviceId, alert.type)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      title="Disparar script corretivo/diagnóstico em background"
                    >
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Diagnóstico</span>
                    </button>

                    {!alert.isResolved ? (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                        title="Marcar incidente como resolvido"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolver</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                        title="Reabrir alerta"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Threshold Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Parâmetros de Alerta Proativo</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Defina os limites de telemetria nos quais o agente local gera um alerta antes de impactar os usuários.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Limite de CPU Sustentada:</span>
                  <span className="text-cyan-400 font-mono">{thresholds.cpu}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={thresholds.cpu}
                  onChange={(e) => setThresholds({ ...thresholds, cpu: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Limite de Memória RAM:</span>
                  <span className="text-amber-400 font-mono">{thresholds.ram}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={thresholds.ram}
                  onChange={(e) => setThresholds({ ...thresholds, ram: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Espaço Livre Mínimo em Disco C:</span>
                  <span className="text-rose-400 font-mono">{thresholds.disk}% restante</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={thresholds.disk}
                  onChange={(e) => setThresholds({ ...thresholds, disk: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Tolerância de Heartbeat Perdido:</span>
                  <span className="text-purple-400 font-mono">{thresholds.heartbeatTimeout} pacotes</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={thresholds.heartbeatTimeout}
                  onChange={(e) => setThresholds({ ...thresholds, heartbeatTimeout: Number(e.target.value) })}
                  className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Configuração</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
