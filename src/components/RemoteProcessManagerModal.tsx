import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  X, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  ShieldAlert, 
  XCircle 
} from 'lucide-react';
import { Device, RemoteProcess } from '../types';

interface RemoteProcessManagerModalProps {
  device: Device;
  onClose: () => void;
}

const INITIAL_PROCESSES: RemoteProcess[] = [
  { pid: 4, name: 'System', cpuPercent: 1.2, memoryMb: 84, user: 'SYSTEM', description: 'Kernel NT & Driver Runtime', isCritical: true },
  { pid: 824, name: 'anecttadesk-service.exe', cpuPercent: 0.8, memoryMb: 36, user: 'SYSTEM', description: 'AnecttaDESK Host Daemon (Session 0)', isCritical: true },
  { pid: 1420, name: 'anecttadesk-worker.exe', cpuPercent: 2.1, memoryMb: 92, user: 'carlos.silva', description: 'DXGI 60FPS Video Capture Engine', isCritical: true },
  { pid: 2180, name: 'explorer.exe', cpuPercent: 1.5, memoryMb: 148, user: 'carlos.silva', description: 'Windows Shell Experience' },
  { pid: 3840, name: 'chrome.exe', cpuPercent: 14.8, memoryMb: 890, user: 'carlos.silva', description: 'Google Chrome Browser (12 abas)' },
  { pid: 4120, name: 'msedge.exe', cpuPercent: 0.4, memoryMb: 210, user: 'carlos.silva', description: 'Microsoft Edge' },
  { pid: 5492, name: 'sqlservr.exe', cpuPercent: 6.2, memoryMb: 1420, user: 'NETWORK SERVICE', description: 'Microsoft SQL Server Database Engine' },
  { pid: 6112, name: 'Teams.exe', cpuPercent: 3.4, memoryMb: 520, user: 'carlos.silva', description: 'Microsoft Teams Workplace' },
  { pid: 7428, name: 'powershell.exe', cpuPercent: 0.0, memoryMb: 68, user: 'carlos.silva', description: 'Windows PowerShell Host' },
  { pid: 8840, name: 'spoolsv.exe', cpuPercent: 0.1, memoryMb: 22, user: 'SYSTEM', description: 'Spooler de Impressão do Windows' },
  { pid: 9210, name: 'node.exe', cpuPercent: 4.5, memoryMb: 310, user: 'carlos.silva', description: 'Node.js JavaScript Runtime' },
];

export const RemoteProcessManagerModal: React.FC<RemoteProcessManagerModalProps> = ({
  device,
  onClose,
}) => {
  const [processes, setProcesses] = useState<RemoteProcess[]>(INITIAL_PROCESSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'cpu' | 'memory' | 'name'>('cpu');
  const [selectedProcess, setSelectedProcess] = useState<RemoteProcess | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // simulate live metric fluctuations
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpuPercent: p.isCritical ? p.cpuPercent : Math.max(0.1, +(p.cpuPercent + (Math.random() * 2 - 1)).toFixed(1)),
          memoryMb: Math.max(20, Math.floor(p.memoryMb + (Math.random() * 20 - 10))),
        }))
      );
      setIsRefreshing(false);
      showToast('Lista de processos atualizada em tempo real via agente.');
    }, 400);
  };

  const handleKillProcess = (proc: RemoteProcess) => {
    if (proc.isCritical) {
      showToast(`Atenção: O processo ${proc.name} é crítico para o sistema e não pode ser finalizado.`);
      return;
    }
    setProcesses((prev) => prev.filter((p) => p.pid !== proc.pid));
    setSelectedProcess(null);
    showToast(`Processo ${proc.name} (PID ${proc.pid}) finalizado no endpoint remoto.`);
  };

  const filtered = processes
    .filter((p) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.pid.toString().includes(term) ||
        p.user.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'cpu') return b.cpuPercent - a.cpuPercent;
      if (sortBy === 'memory') return b.memoryMb - a.memoryMb;
      return a.name.localeCompare(b.name);
    });

  const totalCpu = processes.reduce((acc, p) => acc + p.cpuPercent, 0).toFixed(1);
  const totalMem = (processes.reduce((acc, p) => acc + p.memoryMb, 0) / 1024).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Gerenciador de Tarefas Remoto</h3>
                <span className="font-mono text-xs text-cyan-400 font-bold">[{device.hostname}]</span>
              </div>
              <p className="text-xs text-slate-400">
                Monitoramento e controle de processos em execução no endpoint através do Agent Daemon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Resource Summary */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Uso Geral de CPU</span>
              <span className="text-lg font-mono font-bold text-emerald-400">{totalCpu}%</span>
            </div>
            <Cpu className="w-6 h-6 text-emerald-400/60" />
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Memória Alocada</span>
              <span className="text-lg font-mono font-bold text-cyan-400">{totalMem} GB</span>
            </div>
            <HardDrive className="w-6 h-6 text-cyan-400/60" />
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Processos Ativos</span>
              <span className="text-lg font-mono font-bold text-white">{processes.length}</span>
            </div>
            <Activity className="w-6 h-6 text-blue-400/60" />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar por nome, PID ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Ordenar:</span>
            <button
              onClick={() => setSortBy('cpu')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                sortBy === 'cpu' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              CPU %
            </button>
            <button
              onClick={() => setSortBy('memory')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                sortBy === 'memory' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              RAM
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                sortBy === 'name' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Nome
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Atualizar Lista"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Process Table */}
        <div className="flex-1 overflow-y-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 sticky top-0 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">Nome do Processo</th>
                <th className="px-4 py-2.5 font-mono">PID</th>
                <th className="px-4 py-2.5">CPU %</th>
                <th className="px-4 py-2.5">Memória (RAM)</th>
                <th className="px-4 py-2.5">Usuário</th>
                <th className="px-4 py-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {filtered.map((proc) => (
                <tr 
                  key={proc.pid} 
                  className={`hover:bg-slate-800/50 transition cursor-pointer ${
                    selectedProcess?.pid === proc.pid ? 'bg-cyan-950/40 border-l-2 border-cyan-500' : ''
                  }`}
                  onClick={() => setSelectedProcess(proc)}
                >
                  <td className="px-4 py-2.5 font-sans">
                    <div className="font-bold text-white flex items-center space-x-1.5">
                      <span>{proc.name}</span>
                      {proc.isCritical && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          Sistema
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs font-sans">
                      {proc.description}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 font-bold">{proc.pid}</td>
                  <td className="px-4 py-2.5">
                    <span className={proc.cpuPercent > 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {proc.cpuPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-cyan-300 font-semibold">{proc.memoryMb} MB</td>
                  <td className="px-4 py-2.5 font-sans text-slate-300">{proc.user}</td>
                  <td className="px-4 py-2.5 text-right font-sans whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKillProcess(proc);
                      }}
                      disabled={proc.isCritical}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                        proc.isCritical
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900/80 active:scale-95'
                      }`}
                    >
                      Finalizar Tarefa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toast / Notification */}
        {toastMessage && (
          <div className="mt-3 p-2.5 rounded-lg bg-cyan-950 border border-cyan-800 text-xs text-cyan-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Total: {processes.length} processos ativos • Polling a cada 2s via Protocolo Anectta v1.0
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
