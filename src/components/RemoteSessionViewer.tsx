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
  Headphones
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
      {/* 1. TOP TOOLBAR PROFISSIONAL */}
      {/* ============================================================ */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between shadow-lg z-30 flex-wrap gap-2">
        {/* Machine Identity & Status */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-white tracking-wide">
                {device.hostname}
              </span>
              <span className="font-mono text-xs text-cyan-400 font-bold">
                [{device.anecttadeskId}]
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                ● Conectado
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {device.osVersion} • Sessão Ativa: {formatDuration(elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* Action Controls in Toolbar */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          {/* Monitor Switcher */}
          <div className="flex items-center px-1.5 py-1 text-xs text-slate-300 space-x-1 border-r border-slate-800">
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Monitor:</span>
            {[1, 2].map((num) => (
              <button
                key={num}
                onClick={() => setActiveMonitor(num)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  activeMonitor === num
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Mouse Control */}
          <button
            onClick={() => setMouseEnabled(!mouseEnabled)}
            className={`p-1.5 rounded transition ${
              mouseEnabled ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={mouseEnabled ? 'Mouse Ativado' : 'Mouse Desativado'}
          >
            <MousePointer className="w-4 h-4" />
          </button>

          {/* Keyboard Control */}
          <button
            onClick={() => setKeyboardEnabled(!keyboardEnabled)}
            className={`p-1.5 rounded transition ${
              keyboardEnabled ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={keyboardEnabled ? 'Teclado Ativado' : 'Teclado Desativado'}
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Send Ctrl+Alt+Del */}
          <button
            onClick={handleSendCad}
            className="px-2 py-1 rounded text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
            title="Enviar Ctrl+Alt+Del para o Windows"
          >
            Ctrl+Alt+Del
          </button>

          {/* Clipboard Sync */}
          <button
            onClick={() => {
              setClipboardSynced(!clipboardSynced);
              showToast(clipboardSynced ? 'Clipboard bidirecional desativado' : 'Clipboard sincronizado com endpoint remoto');
            }}
            className={`p-1.5 rounded transition ${
              clipboardSynced ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Sincronização de Clipboard (Local <-> Remoto)"
          >
            <Clipboard className="w-4 h-4" />
          </button>

          {/* Transferência de Arquivos */}
          <button
            onClick={() => setShowFileModal(true)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold transition ${
              showFileModal ? 'bg-cyan-900 text-cyan-200' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Abrir Gerenciador de Arquivos"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Arquivos</span>
          </button>

          {/* Chat */}
          <button
            onClick={() => setShowChatModal(true)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold transition relative ${
              showChatModal ? 'bg-cyan-900 text-cyan-200' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Abrir Chat com Usuário Remoto"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-1" />
          </button>

          {/* Canal de Voz / VoIP Bidirecional */}
          <button
            onClick={() => setShowVoipCall(!showVoipCall)}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded text-xs font-semibold transition ${
              showVoipCall ? 'bg-cyan-900 text-cyan-200 shadow' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Abrir Canal de Áudio / VoIP Bidirecional"
          >
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Voz (VoIP)</span>
          </button>

          {/* Terminal Remoto */}
          <button
            onClick={() => setShowTerminal(true)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold transition ${
              showTerminal ? 'bg-emerald-900 text-emerald-200' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Abrir Terminal PowerShell Remoto"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Terminal</span>
          </button>

          {/* Gerenciador de Processos */}
          <button
            onClick={() => setShowProcessManager(true)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold transition ${
              showProcessManager ? 'bg-cyan-900 text-cyan-200' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Abrir Gerenciador de Tarefas Remoto"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Processos</span>
          </button>

          {/* Anotações / Quadro Branco */}
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-semibold transition ${
              showWhiteboard ? 'bg-purple-900 text-purple-200' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Anotar sobre a tela remota (Quadro Branco)"
          >
            <PenTool className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Anotar</span>
          </button>

          {/* Gravação da Sessão */}
          <button
            onClick={handleToggleRecording}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded text-xs font-bold transition active:scale-95 ${
              isRecording
                ? 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={isRecording ? 'Parar Gravação' : 'Gravar Sessão de Vídeo'}
          >
            {isRecording ? (
              <>
                <StopCircle className="w-3.5 h-3.5 text-rose-400 fill-current" />
                <span className="font-mono font-bold text-[11px] text-rose-300">
                  REC {formatRecordingTime(recordingSeconds)}
                </span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden lg:inline">Gravar</span>
              </>
            )}
          </button>

          {/* Quality Mode */}
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 rounded px-1.5 py-1 outline-none"
          >
            <option value="auto">Qualidade: Auto (60 FPS)</option>
            <option value="hd">Alta Resolução (Sharp)</option>
            <option value="fluid">Máxima Fluidez (Baixa Latência)</option>
          </select>

          {/* Power Options (Reiniciar / Desligar / Bloquear) */}
          <button
            onClick={() => setShowPowerModal(true)}
            className="p-1.5 rounded text-rose-400 hover:bg-rose-950/50 transition"
            title="Reiniciar ou Desligar Máquina"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>

        {/* Exit / Fullscreen */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onCloseSession}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-700 shadow transition active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            <span>Desconectar</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. HUD DE INDICADORES DE REDE & TRANSMISSÃO */}
      {/* ============================================================ */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 font-mono">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">Conexão:</span>
            <span className="font-bold text-emerald-400">
              {connectionMode === 'direct_p2p' ? 'Direta (P2P / WebRTC)' : 'Relay TLS (SP1-LATAM)'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Latência:</span>
            <span className={`font-bold ${latency < 25 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {latency} ms
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">FPS:</span>
            <span className="font-bold text-cyan-400">{fps}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Resolução:</span>
            <span className="text-slate-300">1920x1080 @ 60Hz</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-slate-500">Codec:</span>
            <span className="text-slate-300">H.264 (DXGI Desktop Duplication)</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-500">Enviados:</span>{' '}
            <span className="text-slate-300">{formatBytes(bytesSent)}</span>
          </div>
          <div>
            <span className="text-slate-500">Recebidos:</span>{' '}
            <span className="text-slate-300">{formatBytes(bytesReceived)}</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400 font-sans">
            <Lock className="w-3 h-3" />
            <span>E2EE Ativo</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ÁREA DA TELA REMOTA (REMOTE CANVAS WORKSPACE) */}
      {/* ============================================================ */}
      <div 
        className="flex-1 bg-slate-950 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden"
        onMouseMove={(e) => {
          if (!mouseEnabled) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setRemoteMousePos({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          });
        }}
      >
        {/* Remote Screen Frame */}
        <div className="w-full max-w-6xl aspect-[16/9] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-lg shadow-2xl border-2 border-slate-800 relative overflow-hidden flex flex-col justify-between select-none">
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

            {/* Simulated Remote Cursor */}
            <div 
              className="absolute pointer-events-none transition-transform duration-75 text-cyan-400 drop-shadow-md z-40"
              style={{ left: `${remoteMousePos.x}px`, top: `${remoteMousePos.y}px` }}
            >
              <MousePointer className="w-4 h-4 fill-cyan-400 text-slate-900 -rotate-45" />
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
