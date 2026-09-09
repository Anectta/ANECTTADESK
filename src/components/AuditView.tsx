import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Copy, 
  Terminal, 
  ListFilter, 
  Contrast,
  Radio,
  ExternalLink,
  Code
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditViewProps {
  logs: AuditLog[];
  isNocMode?: boolean;
  onToggleNocMode?: () => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ 
  logs, 
  isNocMode = false,
  onToggleNocMode 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [viewFormat, setViewFormat] = useState<'console' | 'table'>('console');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchOp = log.userName?.toLowerCase().includes(term) ?? false;
      const matchDevice = log.deviceHostname?.toLowerCase().includes(term) ?? false;
      const matchIp = log.ipAddress.includes(term);
      const matchAction = log.action.toLowerCase().includes(term);
      const matchMeta = JSON.stringify(log.metadata).toLowerCase().includes(term);
      if (!matchOp && !matchDevice && !matchIp && !matchAction && !matchMeta) return false;
    }
    return true;
  });

  const getActionTag = (action: string) => {
    switch (action) {
      case 'SESSION_STARTED':
      case 'CONNECTION_ACCEPTED':
        return {
          label: action,
          colorClass: isNocMode 
            ? 'bg-emerald-950 text-[#00ff88] border-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.3)]' 
            : 'bg-emerald-950 text-emerald-400 border-emerald-800'
        };
      case 'SESSION_ENDED':
      case 'LOGOUT':
        return {
          label: action,
          colorClass: isNocMode 
            ? 'bg-slate-900 text-slate-200 border-slate-600' 
            : 'bg-slate-800 text-slate-300 border-slate-700'
        };
      case 'FILE_UPLOAD':
      case 'FILE_DOWNLOAD':
        return {
          label: action,
          colorClass: isNocMode 
            ? 'bg-amber-950 text-[#ffb703] border-[#ffb703] shadow-[0_0_8px_rgba(255,183,3,0.3)]' 
            : 'bg-amber-950 text-amber-300 border-amber-800'
        };
      case 'CONNECTION_REQUESTED':
        return {
          label: action,
          colorClass: isNocMode 
            ? 'bg-cyan-950 text-[#00f0ff] border-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.3)]' 
            : 'bg-cyan-950 text-cyan-300 border-cyan-800'
        };
      case 'CONNECTION_REJECTED':
        return {
          label: action,
          colorClass: isNocMode 
            ? 'bg-rose-950 text-[#ff334b] border-[#ff334b] shadow-[0_0_8px_rgba(255,51,75,0.3)]' 
            : 'bg-rose-950 text-rose-400 border-rose-800'
        };
      case 'EXECUTE_AUTOMATION_SCRIPT':
        return {
          label: 'EXEC_SCRIPT',
          colorClass: isNocMode 
            ? 'bg-purple-950 text-[#c084fc] border-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.3)]' 
            : 'bg-purple-950 text-purple-300 border-purple-800'
        };
      default:
        return {
          label: action,
          colorClass: 'bg-slate-900 text-slate-300 border-slate-800'
        };
    }
  };

  const handleCopyLogLine = (log: AuditLog) => {
    const rawLine = `[${log.timestamp}] [${log.action}] USER="${log.userName || 'SYSTEM'}" HOST="${log.deviceHostname || 'GLOBAL'}" IP=${log.ipAddress} STATUS=${log.status} META=${JSON.stringify(log.metadata)}`;
    navigator.clipboard.writeText(rawLine);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportAll = () => {
    const textData = filteredLogs.map((log, index) => 
      `#${String(index + 1).padStart(3, '0')} [${log.timestamp}] [${log.action}] USER="${log.userName || 'SYSTEM'}" HOST="${log.deviceHostname || 'GLOBAL'}" IP=${log.ipAddress} STATUS=${log.status} META=${JSON.stringify(log.metadata)}`
    ).join('\n');
    
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `anecttadesk-audit-${new Date().toISOString().slice(0,10)}.log`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    const textData = filteredLogs.map((log, index) => 
      `#${String(index + 1).padStart(3, '0')} [${log.timestamp}] [${log.action}] USER="${log.userName || 'SYSTEM'}" HOST="${log.deviceHostname || 'GLOBAL'}" IP=${log.ipAddress} STATUS=${log.status} META=${JSON.stringify(log.metadata)}`
    ).join('\n');
    navigator.clipboard.writeText(textData);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className={`rounded-xl border shadow-2xl overflow-hidden transition-colors ${
      isNocMode 
        ? 'bg-black border-slate-700/80' 
        : 'bg-slate-900 border-slate-800'
    }`}>
      {/* NOC Header Controls */}
      <div className={`p-4 sm:p-5 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        isNocMode ? 'border-slate-800 bg-[#03060f]' : 'border-slate-800 bg-slate-900'
      }`}>
        <div>
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg border ${
              isNocMode 
                ? 'bg-black text-[#00f0ff] border-[#00f0ff]/60 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                : 'bg-cyan-950 text-cyan-400 border-cyan-800'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Trilha de Auditoria & Logs de Telemetria
                </h2>
                {isNocMode && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black text-[#00ff88] border border-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                    NOC HIGH CONTRAST
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${isNocMode ? 'text-slate-300' : 'text-slate-400'}`}>
                Registro forense imutável com carimbo SHA-256 e visualização otimizada para baixa luminosidade
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Format Switcher (Console Streamer vs Table) */}
          <div className="flex rounded-lg p-1 bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewFormat('console')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition ${
                viewFormat === 'console'
                  ? isNocMode ? 'bg-[#06202a] text-[#00f0ff] border border-[#00f0ff]/50 font-bold' : 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualizador Console NOC (Monospace Tail de Alto Contraste)"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console NOC</span>
            </button>
            <button
              onClick={() => setViewFormat('table')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition ${
                viewFormat === 'table'
                  ? isNocMode ? 'bg-[#06202a] text-[#00f0ff] border border-[#00f0ff]/50 font-bold' : 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tabela Estruturada de Auditoria"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Tabela</span>
            </button>
          </div>

          {/* Quick NOC Mode Switch in view header */}
          {onToggleNocMode && (
            <button
              onClick={onToggleNocMode}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1.5 transition active:scale-95 ${
                isNocMode
                  ? 'bg-black text-[#00f0ff] border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Alternar contraste NOC para leitura de logs em tela escura"
            >
              <Contrast className="w-3.5 h-3.5 text-cyan-400" />
              <span>NOC: {isNocMode ? 'LIGADO' : 'DESLIGADO'}</span>
            </button>
          )}

          {/* Copy all / Export .LOG */}
          <button
            onClick={handleCopyAll}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center space-x-1.5 transition active:scale-95"
            title="Copiar todos os logs filtrados"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{copiedAll ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleExportAll}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center space-x-1.5 transition active:scale-95"
            title="Exportar logs em arquivo .log"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className={`px-4 sm:px-5 py-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isNocMode ? 'border-slate-800/80 bg-black' : 'border-slate-800/60 bg-slate-950/60'
      }`}>
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isNocMode ? 'text-cyan-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Buscar por IP, Hostname, Operador ou Ação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition ${
                isNocMode 
                  ? 'bg-[#020409] border border-slate-700 text-[#f8fafc] focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]' 
                  : 'bg-slate-950 border border-slate-700 focus:border-cyan-500'
              }`}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={`rounded-lg px-3 py-1.5 text-xs outline-none transition ${
              isNocMode
                ? 'bg-[#020409] border border-slate-700 text-slate-200 focus:border-[#00f0ff]'
                : 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-cyan-500'
            }`}
          >
            <option value="all">Todas as Categorias de Log</option>
            <option value="SESSION_STARTED">SESSION_STARTED (Início)</option>
            <option value="SESSION_ENDED">SESSION_ENDED (Término)</option>
            <option value="CONNECTION_REQUESTED">CONNECTION_REQUESTED (Tentativa)</option>
            <option value="CONNECTION_ACCEPTED">CONNECTION_ACCEPTED (Aceita)</option>
            <option value="CONNECTION_REJECTED">CONNECTION_REJECTED (Bloqueada)</option>
            <option value="FILE_UPLOAD">FILE_UPLOAD (Transferência)</option>
            <option value="FILE_DOWNLOAD">FILE_DOWNLOAD (Download)</option>
            <option value="EXECUTE_AUTOMATION_SCRIPT">EXECUTE_AUTOMATION_SCRIPT (Script)</option>
          </select>
        </div>

        {/* Telemetry Stream Badge */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
            <span className={`text-[11px] font-bold ${isNocMode ? 'text-[#00ff88]' : 'text-emerald-400'}`}>
              STREAM TELEMETRIA ATIVO
            </span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">
            {filteredLogs.length} registro(s)
          </span>
        </div>
      </div>

      {/* VIEW FORMAT 1: NOC CONSOLE STREAMER (Optimized for Low-Light & NOC screens) */}
      {viewFormat === 'console' && (
        <div className={`p-4 font-mono text-xs overflow-x-auto ${
          isNocMode ? 'bg-[#000000] text-slate-100' : 'bg-[#050811] text-slate-200'
        }`}>
          {/* NOC Console Subheader */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center space-x-4">
              <span>CANAL: <strong className="text-white">SIEM-FORENSIC-01</strong></span>
              <span>BUFFER: <strong className="text-emerald-400">SYNC OK</strong></span>
              <span>ENCODING: <strong className="text-cyan-400">UTF-8 / SHA-256</strong></span>
            </div>
            <div className="text-[10px] text-slate-400">
              Clique no ícone de cópia para extrair a linha RFC-5424
            </div>
          </div>

          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredLogs.map((log, index) => {
              const tag = getActionTag(log.action);
              return (
                <div
                  key={log.id}
                  className={`group flex items-start space-x-2.5 p-2 rounded border transition-all ${
                    isNocMode
                      ? 'bg-[#02050b] hover:bg-[#080f1e] border-slate-800/90 hover:border-cyan-500/60'
                      : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Line Number */}
                  <span className="text-[11px] text-slate-500 select-none font-bold w-9 text-right flex-shrink-0">
                    {String(index + 1).padStart(3, '0')}
                  </span>

                  {/* Timestamp in High Contrast Phosphor Cyan */}
                  <span className={`text-[11px] font-bold flex-shrink-0 ${
                    isNocMode ? 'text-[#00f0ff]' : 'text-cyan-400'
                  }`}>
                    [{log.timestamp}]
                  </span>

                  {/* Action Pill Tag */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${tag.colorClass}`}>
                    {tag.label}
                  </span>

                  {/* Operator */}
                  <span className="text-white font-semibold flex-shrink-0">
                    @{log.userName || 'SYSTEM'}
                  </span>

                  <span className="text-slate-500 select-none">→</span>

                  {/* Target Host */}
                  <span className={`font-bold flex-shrink-0 ${
                    isNocMode ? 'text-[#22d3ee]' : 'text-cyan-300'
                  }`}>
                    {log.deviceHostname || 'GLOBAL'}
                  </span>

                  {/* IP Address in Green */}
                  <span className={`text-[11px] flex-shrink-0 ${
                    isNocMode ? 'text-[#00ff88] font-bold' : 'text-emerald-400'
                  }`}>
                    ({log.ipAddress})
                  </span>

                  {/* Metadata JSON */}
                  <span className={`text-[11px] truncate flex-1 ${
                    isNocMode ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {JSON.stringify(log.metadata)}
                  </span>

                  {/* Status Outcome */}
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                    log.status === 'SUCCESS'
                      ? isNocMode ? 'text-[#00ff88] bg-emerald-950/80' : 'text-emerald-400 bg-emerald-950/40'
                      : isNocMode ? 'text-[#ff334b] bg-rose-950/80' : 'text-rose-400 bg-rose-950/40'
                  }`}>
                    {log.status}
                  </span>

                  {/* Copy Row Button */}
                  <button
                    onClick={() => handleCopyLogLine(log)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition flex-shrink-0"
                    title="Copiar linha de log"
                  >
                    {copiedId === log.id ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="py-12 text-center text-slate-500 font-sans">
                <p className="text-sm">Nenhum evento corresponde aos filtros informados.</p>
                <button
                  onClick={() => { setSearchTerm(''); setActionFilter('all'); }}
                  className="mt-2 text-xs text-cyan-400 hover:underline font-bold"
                >
                  Limpar filtros de busca
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW FORMAT 2: STRUCTURED TABLE */}
      {viewFormat === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className={`border-b text-[11px] font-bold uppercase tracking-wider ${
              isNocMode 
                ? 'bg-[#02050b] border-slate-700 text-slate-200' 
                : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}>
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Operador / Usuário</th>
                <th className="px-5 py-3">Dispositivo Alvo</th>
                <th className="px-5 py-3">Ação Executada</th>
                <th className="px-5 py-3 font-mono">Endereço IP</th>
                <th className="px-5 py-3">Metadados Forenses</th>
                <th className="px-5 py-3 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isNocMode ? 'divide-slate-800/90 bg-black' : 'divide-slate-800/80 bg-slate-900/40'
            }`}>
              {filteredLogs.map((log) => {
                const tag = getActionTag(log.action);
                return (
                  <tr 
                    key={log.id} 
                    className={`transition ${
                      isNocMode ? 'hover:bg-[#060e1d]' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className={`px-5 py-3.5 whitespace-nowrap font-mono text-[11px] font-medium ${
                      isNocMode ? 'text-[#00f0ff]' : 'text-slate-300'
                    }`}>
                      {log.timestamp}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-slate-100">
                      {log.userName || 'Sistema / Daemon'}
                    </td>
                    <td className={`px-5 py-3.5 whitespace-nowrap font-bold ${
                      isNocMode ? 'text-[#22d3ee]' : 'text-cyan-400'
                    }`}>
                      {log.deviceHostname || 'Plataforma Global'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tag.colorClass}`}>
                        {tag.label}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 whitespace-nowrap font-mono font-medium ${
                      isNocMode ? 'text-[#00ff88]' : 'text-slate-300'
                    }`}>
                      {log.ipAddress}
                    </td>
                    <td className={`px-5 py-3.5 whitespace-nowrap text-[11px] font-mono max-w-xs truncate ${
                      isNocMode ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                      {JSON.stringify(log.metadata)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <span className={`font-bold font-mono text-[11px] ${
                        log.status === 'SUCCESS' 
                          ? isNocMode ? 'text-[#00ff88]' : 'text-emerald-400' 
                          : isNocMode ? 'text-[#ff334b]' : 'text-rose-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
