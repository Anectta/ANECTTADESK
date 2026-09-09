import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  MousePointer, 
  Keyboard, 
  Clipboard, 
  FolderOpen, 
  MessageSquare, 
  Sliders, 
  Settings, 
  Power, 
  ShieldCheck, 
  X, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Check, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Folder, 
  Send, 
  AlertTriangle, 
  Terminal,
  Activity,
  Wifi,
  Lock,
  PenTool,
  Video,
  StopCircle,
  Play,
  Headphones,
  Minus,
  Square,
  MoreHorizontal,
  Smile,
  Paperclip,
  Tv,
  LayoutGrid,
  Copy
} from 'lucide-react';
import { Device, FileItem, SessionChatMessage, FileTransferLog } from '../types';
import { INITIAL_LOCAL_FILES, INITIAL_REMOTE_FILES } from '../data/mockData';
import { WhiteboardOverlay } from './WhiteboardOverlay';
import { RemoteProcessManagerModal } from './RemoteProcessManagerModal';
import { RemoteTerminalModal } from './RemoteTerminalModal';
import { VoipAudioCallPanel } from './VoipAudioCallPanel';

interface RemoteSessionViewerProps {
  device: Device;
  onCloseSession: () => void;
  connectionMode: 'direct_p2p' | 'relay';
}

export const RemoteSessionViewer: React.FC<RemoteSessionViewerProps> = ({
  device,
  onCloseSession,
  connectionMode = 'direct_p2p',
}) => {
  // Session Metrics & Status
  const [latency, setLatency] = useState(connectionMode === 'direct_p2p' ? 14 : 32);
  const [fps, setFps] = useState(59.9);
  const [bytesSent, setBytesSent] = useState(1284000);
  const [bytesReceived, setBytesReceived] = useState(48920000);
  const [elapsedSeconds, setElapsedSeconds] = useState(38);
  const [quality, setQuality] = useState<'auto' | 'fluid' | 'hd'>('auto');
  const [activeMonitor, setActiveMonitor] = useState<number>(1);
  const totalMonitors = device.hardwareSpec.monitorsCount || 2;

  // Controls State
  const [mouseEnabled, setMouseEnabled] = useState(true);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [clipboardSynced, setClipboardSynced] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Drawers
  const [showFileModal, setShowFileModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showProcessManager, setShowProcessManager] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showVoipCall, setShowVoipCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [powerAction, setPowerAction] = useState<'reboot' | 'shutdown' | 'lock' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // File Manager State
  const [localFiles, setLocalFiles] = useState<FileItem[]>(INITIAL_LOCAL_FILES);
  const [remoteFiles, setRemoteFiles] = useState<FileItem[]>(INITIAL_REMOTE_FILES);
  const [selectedLocalFile, setSelectedLocalFile] = useState<FileItem | null>(null);
  const [selectedRemoteFile, setSelectedRemoteFile] = useState<FileItem | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);

  // Chat State
  const [chatMessages, setChatMessages] = useState<SessionChatMessage[]>([
    {
      id: 'msg-1',
      sessionId: 'ses-active',
      senderType: 'system',
      senderName: 'AnecttaDESK Control Plane',
      message: `Sessão iniciada com ${device.hostname} (${connectionMode === 'direct_p2p' ? 'Conexão Direta P2P' : 'Relay SP1'}). Criptografia E2EE ativa.`,
      timestamp: '10:04:12',
    },
    {
      id: 'msg-2',
      senderType: 'operator',
      senderName: 'Carlos Amor (Técnico)',
      message: 'Olá, me chamo Carlos. Vou verificar os logs de diagnóstico do sistema.',
      timestamp: '10:04:30',
    },
    {
      id: 'msg-3',
      senderType: 'remote_user',
      senderName: device.currentUser || 'Usuário Remoto',
      message: 'Perfeito, a lentidão começou após a atualização de ontem.',
      timestamp: '10:04:55',
    },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  // Floating HUD Widgets State (Reference Layout)
  const [showToolPanel, setShowToolPanel] = useState(true);
  const [showChatNotes, setShowChatNotes] = useState(true);
  const [chatNotesTab, setChatNotesTab] = useState<'notes' | 'chat'>('notes');
  const [sessionNotes, setSessionNotes] = useState('Your entries here');
  const [chatInputText, setChatInputText] = useState('');

  // Interactive Remote Desktop Simulation in Canvas
  const [remoteMousePos, setRemoteMousePos] = useState({ x: 450, y: 280 });
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [activeWindow, setActiveWindow] = useState<'cmd' | 'diag' | null>('cmd');

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setBytesSent((b) => b + Math.floor(Math.random() * 45000 + 10000));
      setBytesReceived((b) => b + Math.floor(Math.random() * 850000 + 300000));
      // jitter latency slightly
      setLatency((prev) => {
        const base = connectionMode === 'direct_p2p' ? 14 : 32;
        return Math.max(8, base + Math.floor(Math.random() * 5 - 2));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [connectionMode]);

  // Session Recording Timer
  useEffect(() => {
    let recTimer: any;
    if (isRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      showToast('Gravação de auditoria de vídeo iniciada (codec H.264 / 60 FPS).');
    } else {
      setIsRecording(false);
      showToast(`Gravação finalizada (${recordingSeconds}s). Arquivo session-${device.hostname}-${Date.now()}.adrec gerado.`);
    }
  };

  const formatRecordingTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendCad = () => {
    showToast('Sinal de Interrupção Seguro (Ctrl+Alt+Del) injetado com sucesso no Windows Service!');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    const now = new Date().toLocaleTimeString();
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sessionId: 'ses-active',
        senderType: 'operator',
        senderName: 'Carlos Amor (Técnico)',
        message: newChatMessage.trim(),
        timestamp: now,
      },
    ]);
    setNewChatMessage('');
  };

  const handleTransferFile = (direction: 'upload' | 'download') => {
    if (direction === 'upload' && !selectedLocalFile) return;
    if (direction === 'download' && !selectedRemoteFile) return;

    setIsTransferring(true);
    setTransferProgress(10);

    const interval = setInterval(() => {
      setTransferProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsTransferring(false);
          showToast(
            direction === 'upload'
              ? `Arquivo "${selectedLocalFile?.name}" enviado com sucesso!`
              : `Arquivo "${selectedRemoteFile?.name}" descarregado com sucesso!`
          );
          return 0;
        }
        return p + 20;
      });
    }, 300);
  };

  const handlePowerConfirm = () => {
    if (!powerAction) return;
    const actionNames = {
      reboot: 'Reinicialização do sistema operacional remota',
      shutdown: 'Desligamento do sistema remoto',
      lock: 'Bloqueio de estação de trabalho (Win+L)',
    };
    showToast(`${actionNames[powerAction]} enviada ao AnecttaDESK Windows Service!`);
    setShowPowerModal(false);
    setPowerAction(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none"
    >
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-cyan-950 border border-cyan-500 text-cyan-200 px-4 py-2 rounded-lg shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 1. FLOATING TOP BAR & QUICK DOCK (USER REFERENCE LAYOUT) */}
      {/* ============================================================ */}
      <div className="absolute top-4 left-6 z-40 flex flex-col items-start gap-2 select-none pointer-events-auto">
        {/* Main Window Header Capsule */}
        <div className="bg-[#181d26]/95 border border-slate-700/60 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center space-x-4 backdrop-blur-md text-xs">
          {/* Blue Logo Box */}
          <div className="w-6 h-6 rounded-lg bg-blue-600/90 flex items-center justify-center text-white font-black text-xs shadow-md">
            A
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-tight">Anectta Control</span>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-700/60 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="text-slate-200 font-semibold">Conectado: {device.hostname}</span>
            <span className="text-slate-400">Ping: {latency}ms</span>
            <span className="text-slate-400">{fps.toFixed(0)} FPS</span>
          </div>

          {/* Window Controls (— ▢ ✕) */}
          <div className="flex items-center space-x-1 pl-4 border-l border-slate-700/60 text-slate-400">
            <button 
              onClick={() => {
                setShowToolPanel(!showToolPanel);
                setShowChatNotes(!showChatNotes);
              }} 
              className="p-1 hover:text-white rounded hover:bg-slate-700/50 transition"
              title="Minimizar / Alternar Painéis HUD"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="p-1 hover:text-white rounded hover:bg-slate-700/50 transition"
              title="Tela Cheia"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onCloseSession} 
              className="p-1 hover:text-rose-400 rounded hover:bg-rose-950/60 transition"
              title="Encerrar Sessão"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Attached Floating Quick Action Capsule */}
        <div className="ml-56 sm:ml-72 bg-[#181d26]/95 border border-slate-700/60 shadow-2xl rounded-2xl px-4 py-2 flex items-center space-x-3.5 backdrop-blur-md text-slate-300">
          <button 
            onClick={() => {
              const next = activeMonitor === 1 ? 2 : 1;
              setActiveMonitor(next);
              showToast(`Alternado para Monitor ${next}`);
            }} 
            className="hover:text-cyan-400 transition"
            title={`Monitor Ativo: ${activeMonitor}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => showToast(`Resolução: 1920x1080 @ 60 FPS (${quality.toUpperCase()})`)}
            className="hover:text-cyan-400 transition"
            title="Ajuste de Tela & Resolução"
          >
            <Tv className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowFileModal(true)}
            className="hover:text-amber-400 transition"
            title="Transferência de Arquivos"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setClipboardSynced(!clipboardSynced);
              showToast(clipboardSynced ? 'Clipboard bidirecional desativado' : 'Clipboard sincronizado com endpoint remoto');
            }}
            className={`hover:text-emerald-400 transition ${clipboardSynced ? 'text-emerald-400' : 'text-slate-500'}`}
            title="Sincronizar Clipboard"
          >
            <Clipboard className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hover:text-white transition"
            title="Alternar Tela Cheia"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleToggleRecording}
            className={`transition ${isRecording ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-rose-400'}`}
            title={isRecording ? `Gravando (${recordingSeconds}s)` : 'Iniciar Gravação de Sessão'}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isRecording ? 'border-rose-500 bg-rose-500/30' : 'border-rose-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-rose-500'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. FLOATING PAINEL DE FERRAMENTAS (TOP-RIGHT) */}
      {/* ============================================================ */}
      {showToolPanel && (
        <div className="absolute top-6 right-8 z-40 w-64 bg-[#1c212c]/95 border border-slate-700/60 shadow-2xl rounded-2xl p-4 backdrop-blur-md text-slate-200 select-none animate-in fade-in slide-in-from-right-3 pointer-events-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 mb-3">
            <span className="font-semibold text-xs tracking-wide text-slate-100">Painel de Ferramentas</span>
            <button 
              onClick={() => setShowToolPanel(false)}
              className="text-slate-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setShowTerminal(true)}
              className="bg-[#252b38]/80 hover:bg-[#2d3545] border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5 transition group active:scale-95"
            >
              <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              <span className="text-[11px] font-semibold text-slate-300">CLI / Terminal</span>
            </button>

            <button
              onClick={() => setShowProcessManager(true)}
              className="bg-[#252b38]/80 hover:bg-[#2d3545] border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5 transition group active:scale-95"
            >
              <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              <span className="text-[11px] font-semibold text-slate-300">Task Manager</span>
            </button>

            <button
              onClick={() => {
                const next = !mouseEnabled;
                setMouseEnabled(next);
                setKeyboardEnabled(next);
                showToast(next ? 'Entrada remota desbloqueada' : 'Entrada remota BLOQUEADA');
              }}
              className={`border rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5 transition group active:scale-95 ${
                !mouseEnabled 
                  ? 'bg-amber-950/80 border-amber-600 text-amber-200' 
                  : 'bg-[#252b38]/80 hover:bg-[#2d3545] border-slate-700/50 text-slate-300'
              }`}
            >
              <Lock className={`w-5 h-5 ${!mouseEnabled ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'} transition`} />
              <span className="text-[11px] font-semibold">Bloquear Entrada</span>
            </button>

            <button
              onClick={handleSendCad}
              className="bg-[#252b38]/80 hover:bg-[#2d3545] border border-slate-700/50 hover:border-emerald-500/50 rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5 transition group active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
              <span className="text-[11px] font-semibold text-slate-300">Modo Seguro</span>
            </button>

            <button
              onClick={handleToggleRecording}
              className={`border rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5 transition group active:scale-95 ${
                isRecording
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200 animate-pulse'
                  : 'bg-[#252b38]/80 hover:bg-[#2d3545] border-slate-700/50 text-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isRecording ? 'border-rose-400 bg-rose-500/20' : 'border-rose-500'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-400' : 'bg-rose-500'}`} />
              </div>
              <span className="text-[11px] font-semibold">Gravação</span>
            </button>

            <button
              onClick={() => setShowVoipCall(!showVoipCall)}
              className={`border rounded-xl p-3 flex flex-col items-center justify-center space-y-1.5 transition group active:scale-95 ${
                showVoipCall
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                  : 'bg-[#252b38]/80 hover:bg-[#2d3545] border-slate-700/50 text-slate-300'
              }`}
            >
              <Headphones className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              <span className="text-[11px] font-semibold">Voz (VoIP)</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. FLOATING CHAT / NOTAS (BOTTOM-LEFT) */}
      {/* ============================================================ */}
      {showChatNotes && (
        <div className="absolute bottom-8 left-8 z-40 w-72 bg-[#1c212c]/95 border border-slate-700/60 shadow-2xl rounded-2xl p-4 backdrop-blur-md text-slate-200 select-none animate-in fade-in slide-in-from-left-3 pointer-events-auto">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/50 mb-2.5">
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <button
                onClick={() => setChatNotesTab('notes')}
                className={`pb-1 border-b-2 transition ${
                  chatNotesTab === 'notes' ? 'border-cyan-400 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Chat / Notas
              </button>
            </div>
            <button 
              onClick={() => setShowChatNotes(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 mb-2">
            Your chat notes here
          </div>

          <div className="bg-[#12161f] border border-slate-800 rounded-xl p-2.5 mb-3 h-28 overflow-y-auto">
            {chatNotesTab === 'notes' ? (
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Your entries here"
                className="w-full h-full bg-transparent border-none outline-none resize-none text-xs text-slate-200 placeholder-slate-500 font-sans"
              />
            ) : (
              <div className="space-y-2 text-xs">
                {chatMessages.map((m) => (
                  <div key={m.id} className="leading-tight">
                    <span className="font-bold text-cyan-400 text-[10px]">{m.senderName}: </span>
                    <span className="text-slate-300">{m.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!chatInputText.trim()) return;
              const now = new Date().toLocaleTimeString();
              setChatMessages((prev) => [
                ...prev,
                {
                  id: `msg-${Date.now()}`,
                  sessionId: 'ses-active',
                  senderType: 'operator',
                  senderName: 'Carlos Amor',
                  message: chatInputText.trim(),
                  timestamp: now,
                },
              ]);
              showToast('Mensagem enviada com sucesso!');
              setChatInputText('');
            }}
            className="bg-[#12161f] border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2 text-xs"
          >
            <button type="button" onClick={() => showToast('Seletor de emojis')} className="text-slate-400 hover:text-yellow-400 transition">
              <Smile className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setShowFileModal(true)} className="text-slate-400 hover:text-cyan-400 transition">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              placeholder="Chat / Notas"
              className="flex-1 bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500"
            />
            <button type="submit" className="text-cyan-400 hover:text-cyan-300 transition">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. FLOATING OVERLAY DOCK (BOTTOM-CENTER/RIGHT) */}
      {/* ============================================================ */}
      <div className="absolute bottom-8 right-12 z-40 bg-[#181d26]/95 border border-slate-700/60 shadow-2xl rounded-full px-5 py-2.5 flex items-center space-x-5 backdrop-blur-md text-slate-300 select-none pointer-events-auto">
        <div className="flex items-center space-x-2 font-semibold text-xs text-slate-200 pr-3 border-r border-slate-700/60">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>Overlay Dock</span>
        </div>

        <button 
          onClick={() => {
            const next = activeMonitor === 1 ? 2 : 1;
            setActiveMonitor(next);
            showToast(`Monitor alternado para Monitor ${next}`);
          }} 
          className="hover:text-cyan-400 transition" 
          title="Trocar Monitor"
        >
          <Monitor className="w-4 h-4" />
        </button>

        <button 
          onClick={() => showToast(`Resolução: 1920x1080 @ 60 FPS (${quality.toUpperCase()})`)} 
          className="hover:text-cyan-400 transition" 
          title="Configurações de Tela"
        >
          <Tv className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setShowFileModal(true)} 
          className="hover:text-amber-400 transition" 
          title="Transferência de Arquivos"
        >
          <Copy className="w-4 h-4" />
        </button>

        <button 
          onClick={() => {
            setClipboardSynced(!clipboardSynced);
            showToast(clipboardSynced ? 'Clipboard bidirecional desativado' : 'Clipboard sincronizado');
          }} 
          className={`hover:text-emerald-400 transition ${clipboardSynced ? 'text-emerald-400' : 'text-slate-500'}`} 
          title="Clipboard"
        >
          <Clipboard className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setShowChatNotes(!showChatNotes)} 
          className={`hover:text-cyan-400 transition ${showChatNotes ? 'text-cyan-400' : 'text-slate-400'}`} 
          title="Notas / Documentos"
        >
          <FileText className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setShowToolPanel(!showToolPanel)} 
          className={`hover:text-cyan-400 transition ${showToolPanel ? 'text-cyan-400' : 'text-slate-400'}`} 
          title="Painel de Ferramentas"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setIsFullscreen(!isFullscreen)} 
          className="hover:text-white transition" 
          title="Tela Cheia"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setShowPowerModal(true)} 
          className="hover:text-slate-100 transition" 
          title="Mais opções (Energia / Desconectar)"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 5. ÁREA DA TELA REMOTA (REMOTE CANVAS WORKSPACE) */}
      {/* ============================================================ */}
      <div 
        className="flex-1 w-full h-full relative overflow-hidden bg-gradient-to-b from-[#1b222d] via-[#161a22] to-[#0f1217] flex items-center justify-center"
        onMouseMove={(e) => {
          if (!mouseEnabled) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setRemoteMousePos({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          });
        }}
      >
        {/* Tech Perspective Grid Background (like in user reference image) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

        {/* Remote Screen Frame */}
        <div className="w-full h-full relative overflow-hidden flex flex-col justify-between select-none">
          {/* Whiteboard Overlay if active */}
          {showWhiteboard && <WhiteboardOverlay onClose={() => setShowWhiteboard(false)} />}
          
          {/* Top Remote System Bar / Banner */}
          <div className="bg-slate-900/90 border-b border-slate-700 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">{device.hostname}</span>
              <span className="text-slate-500 font-mono">[{device.currentUser || 'SYSTEM'}]</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Desktop Virtual • Monitor {activeMonitor} de {totalMonitors}
            </div>
          </div>

          {/* Interactive Remote Desktop Body */}
          <div className="flex-1 p-6 relative">
            {/* Desktop Icons */}
            <div className="grid grid-cols-1 gap-6 w-20">
              <div 
                onClick={() => setActiveWindow('cmd')}
                className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer transition text-center group"
              >
                <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-white mt-1 font-medium drop-shadow">Terminal</span>
              </div>

              <div 
                onClick={() => setActiveWindow('diag')}
                className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer transition text-center group"
              >
                <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-white mt-1 font-medium drop-shadow">Diagnóstico</span>
              </div>

              <div 
                onClick={() => setShowFileModal(true)}
                className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer transition text-center group"
              >
                <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                  <Folder className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-white mt-1 font-medium drop-shadow">Arquivos</span>
              </div>
            </div>

            {/* Active Window: Terminal */}
            {activeWindow === 'cmd' && (
              <div className="absolute top-12 left-28 w-96 sm:w-[480px] bg-slate-950/95 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in">
                <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono text-slate-200">Administrador: Prompt de Comando (Session 1)</span>
                  </div>
                  <button onClick={() => setActiveWindow(null)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4 font-mono text-xs text-emerald-400 space-y-1">
                  <div>Microsoft Windows [Versão {device.osVersion}]</div>
                  <div>(c) Microsoft Corporation. Todos os direitos reservados.</div>
                  <div className="text-slate-400 pt-2">C:\Windows\System32&gt; anecttadesk-agent.exe status</div>
                  <div className="text-cyan-300">● AnecttaDESK Windows Service: ATIVO (NT AUTHORITY\SYSTEM)</div>
                  <div className="text-cyan-300">● Desktop Duplication Engine: DXGI H.264 60FPS ATIVO</div>
                  <div className="text-cyan-300">● Identificador Registrado: {device.anecttadeskId}</div>
                  <div className="text-slate-300 flex items-center space-x-1 pt-1">
                    <span>C:\Windows\System32&gt;</span>
                    <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />
                  </div>
                </div>
              </div>
            )}

            {/* Active Window: Diagnostics */}
            {activeWindow === 'diag' && (
              <div className="absolute top-16 right-16 w-80 bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl p-4 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <span className="font-bold text-white">Telemetria do Endpoint</span>
                  <button onClick={() => setActiveWindow(null)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Processador:</span>
                    <span className="font-mono text-cyan-400">14% de uso</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Memória RAM:</span>
                    <span className="font-mono text-emerald-400">8.2 / {device.hardwareSpec.ramGb} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="font-mono text-slate-200">{device.hardwareSpec.uptimeHours} horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Temperatura CPU:</span>
                    <span className="font-mono text-emerald-400">42°C</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simulated Remote Cursor (Lime/Emerald Green matching reference) */}
            <div 
              className="absolute pointer-events-none transition-transform duration-75 text-emerald-400 drop-shadow-[0_2px_12px_rgba(16,185,129,0.7)] z-40"
              style={{ left: `${remoteMousePos.x}px`, top: `${remoteMousePos.y}px` }}
            >
              <MousePointer className="w-5 h-5 fill-emerald-400 text-slate-950 -rotate-45" />
            </div>
          </div>

          {/* Windows Taskbar at bottom of remote screen */}
          <div className="bg-slate-900/95 border-t border-slate-700/80 px-3 py-1.5 flex items-center justify-between z-20">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowStartMenu(!showStartMenu)}
                className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 transition"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400">Iniciar</span>
            </div>

            {/* System Tray */}
            <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono">
              <span className="inline-flex items-center text-emerald-400">
                <Wifi className="w-3.5 h-3.5 mr-1" />
                1 Gbps
              </span>
              <span>10:04</span>
              <span>09/09/2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MODAL/DRAWER: TRANSFERÊNCIA DE ARQUIVOS BI-PAINEL */}
      {/* ============================================================ */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-6 shadow-2xl text-slate-100 flex flex-col h-[600px] animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Transferência de Arquivos</h3>
                  <p className="text-xs text-slate-400">
                    Sincronização bidirecional entre Computador Local e Remoto
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transfer Progress Bar */}
            {isTransferring && (
              <div className="my-3 p-3 bg-cyan-950/80 border border-cyan-700 rounded-lg">
                <div className="flex justify-between text-xs font-semibold text-cyan-200 mb-1">
                  <span>Transferindo pacote...</span>
                  <span>{transferProgress}% • 14.8 MB/s</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full transition-all duration-300"
                    style={{ width: `${transferProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Two Panels: Local vs Remoto */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 overflow-hidden">
              {/* Left Panel: COMPUTADOR LOCAL */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col overflow-hidden">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>COMPUTADOR LOCAL (Seu PC)</span>
                  <span className="text-[10px] text-slate-500">C:\Users\Tecnico\Downloads</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {localFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedLocalFile(file)}
                      className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition ${
                        selectedLocalFile?.id === file.id
                          ? 'bg-cyan-900/60 border border-cyan-500 text-white'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        {file.isDirectory ? (
                          <Folder className="w-4 h-4 text-amber-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {file.sizeBytes > 0 ? formatBytes(file.sizeBytes) : 'Pasta'}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Action button */}
                <button
                  onClick={() => handleTransferFile('upload')}
                  disabled={!selectedLocalFile || isTransferring}
                  className="mt-3 w-full py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Enviar para Remoto (Upload)</span>
                </button>
              </div>

              {/* Right Panel: COMPUTADOR REMOTO */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col overflow-hidden">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>COMPUTADOR REMOTO ({device.hostname})</span>
                  <span className="text-[10px] text-slate-500">C:\ProgramData\AnecttaDESK</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {remoteFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedRemoteFile(file)}
                      className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition ${
                        selectedRemoteFile?.id === file.id
                          ? 'bg-emerald-900/60 border border-emerald-500 text-white'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        {file.isDirectory ? (
                          <Folder className="w-4 h-4 text-amber-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {file.sizeBytes > 0 ? formatBytes(file.sizeBytes) : 'Pasta'}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Action button */}
                <button
                  onClick={() => handleTransferFile('download')}
                  disabled={!selectedRemoteFile || isTransferring}
                  className="mt-3 w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar para o meu PC (Download)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL/DRAWER: CHAT DA SESSÃO */}
      {/* ============================================================ */}
      {showChatModal && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col p-4 text-slate-100 animate-in slide-in-from-right">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Chat da Sessão</h3>
            </div>
            <button
              onClick={() => setShowChatModal(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 py-4 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-lg max-w-[90%] ${
                  msg.senderType === 'operator'
                    ? 'ml-auto bg-cyan-950 border border-cyan-800 text-cyan-100'
                    : msg.senderType === 'system'
                    ? 'mx-auto bg-slate-950 border border-slate-800 text-slate-400 text-center text-[11px]'
                    : 'mr-auto bg-slate-800 border border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>{msg.senderName}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="leading-relaxed">{msg.message}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. MODAL: COMANDOS DE ENERGIA & REINICIALIZAÇÃO */}
      {/* ============================================================ */}
      {showPowerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Comandos de Energia Remota</h3>
                <p className="text-xs text-slate-400">Endpoint: {device.hostname}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <button
                onClick={() => setPowerAction('reboot')}
                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition ${
                  powerAction === 'reboot'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold">Reiniciar Computador</div>
                  <div className="text-[11px] text-slate-400">
                    O Agent Windows reconectará automaticamente após o boot.
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPowerAction('lock')}
                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition ${
                  powerAction === 'lock'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold">Bloquear Estação de Trabalho (Win+L)</div>
                  <div className="text-[11px] text-slate-400">
                    Mantém a sessão protegida na tela de login.
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPowerAction('shutdown')}
                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition ${
                  powerAction === 'shutdown'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold">Desligar Máquina</div>
                  <div className="text-[11px] text-slate-400">
                    Encerra todos os serviços e desliga a estação física.
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPowerModal(false);
                  setPowerAction(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handlePowerConfirm}
                disabled={!powerAction}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white shadow"
              >
                Executar Comando
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================ */}
      {/* 7. MODAL: GERENCIADOR DE PROCESSOS REMOTO */}
      {/* ============================================================ */}
      {showProcessManager && (
        <RemoteProcessManagerModal
          device={device}
          onClose={() => setShowProcessManager(false)}
        />
      )}

      {/* ============================================================ */}
      {/* 8. MODAL: TERMINAL POWERSHELL REMOTO */}
      {/* ============================================================ */}
      {showTerminal && (
        <RemoteTerminalModal
          device={device}
          onClose={() => setShowTerminal(false)}
        />
      )}

      {/* ============================================================ */}
      {/* 9. WIDGET: CANAL DE ÁUDIO / VOIP BIDIRECIONAL */}
      {/* ============================================================ */}
      <VoipAudioCallPanel
        device={device}
        isOpen={showVoipCall}
        onClose={() => setShowVoipCall(false)}
      />
    </div>
  );
};
