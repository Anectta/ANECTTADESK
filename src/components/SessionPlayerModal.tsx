import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Download, 
  X, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Terminal, 
  MousePointer, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Calendar, 
  User, 
  Monitor, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { RecordedSession, SessionTimelineEvent } from '../types';

interface SessionPlayerModalProps {
  session: RecordedSession;
  onClose: () => void;
}

export const SessionPlayerModal: React.FC<SessionPlayerModalProps> = ({ session, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'screen' | 'timeline' | 'details'>('screen');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback timer ticker
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= session.durationSeconds) {
            setIsPlaying(false);
            return session.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, session.durationSeconds]);

  const handleSeek = (newTime: number) => {
    setCurrentTime(Math.min(Math.max(0, newTime), session.durationSeconds));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Find active or closest event
  const currentEvents = session.timelineEvents.filter((ev) => ev.timeSeconds <= currentTime);
  const latestEvent = currentEvents[currentEvents.length - 1];

  const getEventIcon = (type: SessionTimelineEvent['type']) => {
    switch (type) {
      case 'terminal':
        return <Terminal className="w-3.5 h-3.5 text-cyan-400" />;
      case 'file_transfer':
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      case 'uac_elevation':
        return <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <MousePointer className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Reprodução de Gravação Forense: {session.deviceHostname}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  {session.codec}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  {session.fps} FPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Operador: <span className="text-slate-200 font-semibold">{session.operatorName}</span> ({session.operatorRole}) · Gravado em {session.recordedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={`#download-${session.id}`}
              onClick={(e) => {
                e.preventDefault();
                alert(`Exportando gravação criptografada da sessão (${session.fileSizeFormatted}, Codec ${session.codec}). O download do pacote de auditoria iniciará agora.`);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Exportar ({session.fileSizeFormatted})</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher for Player */}
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('screen')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'screen' ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Visor de Vídeo
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'timeline' ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Eventos Forenses ({session.timelineEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'details' ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Metadados Criptográficos
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Posição: <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span> / {session.durationFormatted}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 flex flex-col items-center justify-center min-h-[340px]">
          {activeTab === 'screen' && (
            <div className="w-full h-full max-h-[460px] bg-black border border-slate-800 rounded-xl relative overflow-hidden flex flex-col shadow-inner select-none">
              {/* Fake Windows/Linux Desktop Window */}
              <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold">{session.deviceHostname}</span>
                  <span className="text-slate-500">|</span>
                  <span>{session.resolution}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-700"></div>
                </div>
              </div>

              {/* Simulated Desktop Content */}
              <div className="flex-1 p-6 relative flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40">
                {/* Simulated Desktop Icons */}
                <div className="grid grid-cols-6 gap-6 pointer-events-none opacity-60">
                  <div className="flex flex-col items-center space-y-1 text-center w-16">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-300">Este Computador</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 text-center w-16">
                    <div className="w-9 h-9 rounded-lg bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-300">PowerShell Admin</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 text-center w-16">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-slate-300">Anectta Agent</span>
                  </div>
                </div>

                {/* Simulated Active Window during session */}
                <div className="mx-auto my-auto w-full max-w-xl bg-slate-900/95 border border-cyan-500/30 rounded-lg shadow-2xl p-4 space-y-2 backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2 text-xs text-cyan-300 font-mono">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Administrador: Windows PowerShell (PID: 4018)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                      LIVE AT: {formatTime(currentTime)}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-300 space-y-1 bg-black/60 p-3 rounded border border-slate-800">
                    <p className="text-slate-500">Windows PowerShell - Copyright (C) Microsoft Corporation.</p>
                    <p className="text-cyan-400">PS C:\Users\Administrator&gt; Get-Service -Name anecttadesk-agent</p>
                    <p className="text-emerald-400">Status: Running | DisplayName: AnecttaDESK Remote Service</p>
                    {latestEvent && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-amber-300">
                        <span className="text-slate-500">[{formatTime(latestEvent.timeSeconds)}] </span>
                        <strong>{latestEvent.label}:</strong> {latestEvent.details}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Floating Status Overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] flex items-center space-x-3 text-slate-300 backdrop-blur-sm">
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>GRAVAÇÃO ÍNTEGRA</span>
                  </span>
                  <span>|</span>
                  <span>Buffer: 100%</span>
                  <span>|</span>
                  <span>Hash SHA-256: 7f8b91...d2a</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="w-full max-w-3xl space-y-2 py-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Eventos Críticos Registrados Durante a Sessão
              </h4>
              {session.timelineEvents.map((ev, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSeek(ev.timeSeconds)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    currentTime >= ev.timeSeconds
                      ? 'bg-slate-900 border-cyan-500/40 text-white'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      {getEventIcon(ev.type)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{ev.label}</div>
                      <div className="text-[11px] text-slate-400">{ev.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-cyan-400">
                    <span>{formatTime(ev.timeSeconds)}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Certificado de Autenticidade Forense</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">ID da Sessão:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{session.sessionId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">IP de Origem do Operador:</span>
                  <span className="font-mono text-slate-300 font-semibold">{session.clientIp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Técnico Responsável:</span>
                  <span className="text-slate-200 font-semibold">{session.operatorName} ({session.operatorRole})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Endpoint Remoto:</span>
                  <span className="font-mono text-slate-200 font-semibold">{session.deviceHostname}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Formato & Criptografia:</span>
                  <span className="text-slate-200 font-semibold">WebM ({session.codec}) + ChaCha20-Poly1305</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tamanho do Arquivo:</span>
                  <span className="text-slate-200 font-semibold">{session.fileSizeFormatted}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
                <span className="text-slate-500 block font-sans text-[10px] uppercase font-bold">Assinatura Digital (ED25519)</span>
                ed25519:3a91b49fce82a881d77a2810a9c6901f41d6b0521630b91e9882fa1807d91782a5108cb921
              </div>
            </div>
          )}
        </div>

        {/* Video Player Controller Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          {/* Progress / Seek Bar with event dots */}
          <div className="relative group">
            <input
              type="range"
              min="0"
              max={session.durationSeconds}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer transition-all"
            />
            {/* Timeline Event Dots */}
            {session.timelineEvents.map((ev, idx) => {
              const leftPercent = (ev.timeSeconds / session.durationSeconds) * 100;
              return (
                <div
                  key={idx}
                  onClick={() => handleSeek(ev.timeSeconds)}
                  style={{ left: `${leftPercent}%` }}
                  title={`${formatTime(ev.timeSeconds)} - ${ev.label}`}
                  className="absolute top-0.5 w-2 h-2 rounded-full bg-amber-400 -translate-x-1/2 cursor-pointer ring-2 ring-slate-950 hover:scale-150 transition-transform"
                />
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Voltar ao início"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                {[1, 2, 4].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      playbackSpeed === speed ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <div className="font-mono text-slate-300 ml-2">
                <span className="text-white font-bold">{formatTime(currentTime)}</span> / {session.durationFormatted}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={isMuted ? 'Ativar áudio' : 'Mutar áudio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <div className="text-[11px] text-slate-400 hidden sm:block">
                Taxa de compressão: <span className="text-slate-200 font-semibold font-mono">1.8 Mbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
