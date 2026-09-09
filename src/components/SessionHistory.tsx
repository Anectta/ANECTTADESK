import React, { useState } from 'react';
import { History, Search, Filter, Clock, Wifi, Activity, ArrowUpRight, CheckCircle2, XCircle, Play, Video, ShieldCheck, Download } from 'lucide-react';
import { RemoteSession, RecordedSession } from '../types';

interface SessionHistoryProps {
  sessions: RemoteSession[];
  recordings?: RecordedSession[];
  onPlayRecording?: (recording: RecordedSession) => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ 
  sessions, 
  recordings = [], 
  onPlayRecording 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [historyTab, setHistoryTab] = useState<'all' | 'recordings'>('all');

  const filteredSessions = sessions.filter((s) => {
    if (modeFilter !== 'all' && s.connectionMode !== modeFilter) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchDevice = s.deviceHostname.toLowerCase().includes(term);
      const matchOp = s.operatorName.toLowerCase().includes(term);
      const matchId = s.deviceAnecttadeskId.replace(/\s+/g, '').includes(term.replace(/\s+/g, ''));
      if (!matchDevice && !matchOp && !matchId) return false;
    }
    return true;
  });

  const filteredRecordings = recordings.filter((r) => {
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        r.deviceHostname.toLowerCase().includes(term) ||
        r.operatorName.toLowerCase().includes(term) ||
        r.sessionId.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
              <History className="w-5 h-5 text-cyan-400" />
              <span>Histórico & Gravações de Sessão</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
              AUDIT TRAIL & VIDEO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro de todas as conexões estabelecidas e reprodução de gravações com trilha de eventos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setHistoryTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                historyTab === 'all'
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas Conexões ({sessions.length})
            </button>
            <button
              onClick={() => setHistoryTab('recordings')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition-colors ${
                historyTab === 'recordings'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Gravações ({recordings.length})</span>
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar Operador ou PC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          {historyTab === 'all' && (
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
            >
              <option value="all">Todos os Tipos</option>
              <option value="direct_p2p">Direta (P2P)</option>
              <option value="relay">Relay</option>
            </select>
          )}
        </div>
      </div>

      {/* RECORDINGS GALLERY VIEW */}
      {historyTab === 'recordings' ? (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecordings.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col justify-between"
            >
              {/* Fake Video Preview Header */}
              <div className="relative h-36 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 flex flex-col justify-between p-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 text-cyan-300 border border-cyan-800/60 backdrop-blur-sm">
                    {rec.codec}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 text-purple-300 border border-purple-800/60 backdrop-blur-sm">
                    {rec.fileSizeFormatted}
                  </span>
                </div>

                <div className="self-center my-auto">
                  <button
                    onClick={() => onPlayRecording?.(rec)}
                    className="w-12 h-12 rounded-full bg-cyan-600/90 group-hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    title="Reproduzir Sessão Gravada"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                  <span>{rec.resolution} @ {rec.fps}fps</span>
                  <span className="text-white font-bold">{rec.durationFormatted}</span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-4 space-y-2.5">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {rec.deviceHostname}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    Operador: <span className="text-slate-200 font-semibold">{rec.operatorName}</span> ({rec.operatorRole})
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Data: {rec.recordedAt}</span>
                  <span className="text-cyan-400 font-medium">
                    {rec.timelineEvents.length} eventos
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onPlayRecording?.(rec)}
                    className="w-full py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-cyan-300" />
                    <span>Abrir no Player Forense</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* History Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Início</th>
                <th className="px-5 py-3">Término</th>
                <th className="px-5 py-3">Duração</th>
                <th className="px-5 py-3">Operador</th>
                <th className="px-5 py-3">Dispositivo Destino</th>
                <th className="px-5 py-3">Tipo de Conexão</th>
                <th className="px-5 py-3">Tráfego (TX / RX)</th>
                <th className="px-5 py-3">Vídeo</th>
                <th className="px-5 py-3 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSessions.map((ses) => {
                const matchedRecording = recordings.find((r) => r.sessionId === ses.id || r.deviceHostname === ses.deviceHostname);

                return (
                  <tr key={ses.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-300">
                      {ses.startedAt}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {ses.endedAt || <span className="text-emerald-400 font-bold">Em andamento</span>}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono font-semibold text-white">
                      {formatDuration(ses.durationSeconds)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-200">
                      {ses.operatorName}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-bold text-cyan-400">{ses.deviceHostname}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {ses.deviceAnecttadeskId}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {ses.connectionMode === 'direct_p2p' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Direta (P2P)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                          Relay ({ses.relayNode || 'SP1'})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      ↑ {formatBytes(ses.bytesSent)} / ↓ {formatBytes(ses.bytesReceived)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {matchedRecording ? (
                        <button
                          onClick={() => onPlayRecording?.(matchedRecording)}
                          className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 font-semibold flex items-center space-x-1 transition-colors"
                          title="Reproduzir gravação de tela"
                        >
                          <Play className="w-3 h-3 fill-purple-300" />
                          <span>Assistir</span>
                        </button>
                      ) : (
                        <span className="text-slate-600 font-mono text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      {ses.status === 'active' ? (
                        <span className="text-emerald-400 font-bold">● Ativa</span>
                      ) : ses.status === 'closed' ? (
                        <span className="text-slate-400">Concluída</span>
                      ) : (
                        <span className="text-rose-400 font-semibold">{ses.status}</span>
                      )}
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
