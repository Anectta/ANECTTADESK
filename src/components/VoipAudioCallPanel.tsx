import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2,
  Headphones,
  Signal
} from 'lucide-react';
import { Device, VoipCallState } from '../types';

interface VoipAudioCallPanelProps {
  device: Device;
  operatorName?: string;
  isOpen: boolean;
  onClose: () => void;
  isNocMode?: boolean;
}

export const VoipAudioCallPanel: React.FC<VoipAudioCallPanelProps> = ({
  device,
  operatorName = 'Carlos Amor (Técnico)',
  isOpen,
  onClose,
  isNocMode = false,
}) => {
  const [callState, setCallState] = useState<VoipCallState>({
    status: 'idle',
    isMuted: false,
    isSpeakerMuted: false,
    volume: 85,
    durationSeconds: 0,
    audioBitrateKbps: 32.0,
    latencyMs: 14,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [showDspSettings, setShowDspSettings] = useState(false);
  const [operatorLevel, setOperatorLevel] = useState(0);
  const [remoteLevel, setRemoteLevel] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Play subtle synthesis tone (Call chime or hangup)
  const playTone = (type: 'connect' | 'disconnect' | 'ring') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'connect') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'disconnect') {
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'ring') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // AudioContext might be restricted prior to user gesture
    }
  };

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState.status === 'connected') {
      interval = setInterval(() => {
        setCallState((prev) => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
          latencyMs: 12 + Math.floor(Math.random() * 6),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.status]);

  // Audio level visualizer loop
  useEffect(() => {
    let active = true;

    const updateLevels = () => {
      if (!active) return;

      if (callState.status === 'connected') {
        // Operator Mic Level
        if (analyserRef.current && !callState.isMuted) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Scale to 0 - 100
          setOperatorLevel(Math.min(100, Math.round(avg * 1.5)));
        } else {
          // If muted or simulated
          setOperatorLevel(0);
        }

        // Remote User Audio Level (Simulated conversation fluctuation)
        if (!callState.isSpeakerMuted) {
          const baseFluctuation = Math.sin(Date.now() / 400);
          if (baseFluctuation > 0.1) {
            const simulated = Math.floor(25 + Math.random() * 55);
            setRemoteLevel(simulated);
          } else {
            setRemoteLevel(Math.floor(Math.random() * 8));
          }
        } else {
          setRemoteLevel(0);
        }
      } else {
        setOperatorLevel(0);
        setRemoteLevel(0);
      }

      animationFrameRef.current = requestAnimationFrame(updateLevels);
    };

    animationFrameRef.current = requestAnimationFrame(updateLevels);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [callState.status, callState.isMuted, callState.isSpeakerMuted]);

  // Start Call
  const handleStartCall = async () => {
    playTone('ring');
    setCallState((prev) => ({ ...prev, status: 'calling', durationSeconds: 0 }));
    setMicError(null);

    // Try real microphone capture
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: callState.echoCancellation,
            noiseSuppression: callState.noiseSuppression,
            autoGainControl: callState.autoGainControl,
          },
        });
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;
        }
      }
    } catch (err: any) {
      console.warn('Microfone real inacessível ou negado, usando canal VoIP simulado WebRTC:', err);
      setMicError('Microfone local não detectado ou permissão restrita. Conexão simulada ativada.');
    }

    // Connect after 1.5s
    setTimeout(() => {
      playTone('connect');
      setCallState((prev) => ({ ...prev, status: 'connected' }));
    }, 1500);
  };

  // End Call
  const handleEndCall = () => {
    playTone('disconnect');

    // Stop streams
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    setCallState((prev) => ({ ...prev, status: 'ended' }));
    setTimeout(() => {
      setCallState((prev) => ({ ...prev, status: 'idle', durationSeconds: 0 }));
    }, 1000);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Render minimized pill
  if (isMinimized) {
    return (
      <div 
        className={`fixed bottom-4 right-4 z-50 p-2.5 rounded-xl border shadow-2xl flex items-center space-x-3 backdrop-blur-md transition-all ${
          isNocMode 
            ? 'bg-black/95 border-[#00f0ff]/60 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
            : 'bg-slate-900/95 border-slate-700 text-white'
        }`}
      >
        <div className={`p-2 rounded-lg ${
          callState.status === 'connected'
            ? 'bg-emerald-950 text-[#00ff88] border border-[#00ff88]/50 animate-pulse'
            : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
        }`}>
          <Headphones className="w-4 h-4" />
        </div>

        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold">VoIP: {device.hostname}</span>
            {callState.status === 'connected' && (
              <span className="font-mono text-[11px] font-bold text-emerald-400">
                {formatDuration(callState.durationSeconds)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            {callState.status === 'connected' ? 'Canal de voz ativo' : 'Aguardando chamada'}
          </p>
        </div>

        {callState.status === 'connected' && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
              className={`p-1.5 rounded-lg border text-xs ${
                callState.isMuted
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
              title={callState.isMuted ? 'Desmutar Microfone' : 'Mutar Microfone'}
            >
              {callState.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleEndCall}
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs"
              title="Encerrar Chamada"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMinimized(false)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          title="Expandir Painel VoIP"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 w-96 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl transition-all ${
        isNocMode 
          ? 'bg-black/95 border-[#00f0ff]/50 text-white shadow-[0_0_25px_rgba(0,240,255,0.25)]' 
          : 'bg-slate-900/95 border-slate-700 text-white'
      }`}
    >
      {/* Panel Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        isNocMode ? 'border-slate-800 bg-[#02050b]' : 'border-slate-800 bg-slate-950'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-lg border ${
            callState.status === 'connected'
              ? 'bg-emerald-950 text-[#00ff88] border-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.4)] animate-pulse'
              : 'bg-cyan-950 text-cyan-400 border-cyan-800'
          }`}>
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-xs tracking-wide">
                Canal de Áudio / VoIP Bidirecional
              </h3>
            </div>
            <p className="text-[10px] text-slate-400">
              WebRTC Opus 48kHz • {device.hostname}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Minimizar para widget flutuante"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Fechar painel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Call State & Controls */}
      <div className="p-4 space-y-4 text-xs">
        {/* Call Banner / Status Indicator */}
        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          callState.status === 'connected'
            ? isNocMode ? 'bg-[#030d07] border-[#00ff88]/60 text-emerald-200' : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
            : callState.status === 'calling'
            ? 'bg-cyan-950/60 border-cyan-800 text-cyan-200'
            : isNocMode ? 'bg-[#02050b] border-slate-800 text-slate-300' : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-3 h-3 rounded-full ${
              callState.status === 'connected'
                ? 'bg-[#00ff88] animate-ping'
                : callState.status === 'calling'
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-slate-600'
            }`} />
            <div>
              <span className="font-bold block text-xs">
                {callState.status === 'connected' && 'Chamada de Voz em Curso'}
                {callState.status === 'calling' && 'Discando para o Endpoint Remoto...'}
                {callState.status === 'idle' && 'Canal de Voz Desconectado'}
                {callState.status === 'ended' && 'Chamada Encerrada'}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {callState.status === 'connected'
                  ? `Duração: ${formatDuration(callState.durationSeconds)} • Latência: ${callState.latencyMs}ms`
                  : `Endpoint: ${device.anecttadeskId} (${device.ipAddress})`}
              </span>
            </div>
          </div>

          {callState.status === 'connected' ? (
            <button
              onClick={handleEndCall}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center space-x-1.5 shadow active:scale-95 transition"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Encerrar</span>
            </button>
          ) : callState.status === 'calling' ? (
            <button
              onClick={handleEndCall}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancelar
            </button>
          ) : (
            <button
              onClick={handleStartCall}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1.5 shadow active:scale-95 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Iniciar Voz</span>
            </button>
          )}
        </div>

        {micError && (
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 text-[11px] flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{micError}</span>
          </div>
        )}

        {/* Audio Spectrum & VU Meters (Operator & Remote) */}
        <div className={`p-3 rounded-xl border space-y-3 ${
          isNocMode ? 'bg-[#000000] border-slate-800' : 'bg-slate-950/80 border-slate-800'
        }`}>
          {/* 1. Local Operator VU */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                {callState.isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-cyan-400" />}
                <span>Você ({operatorName.split(' ')[0]})</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {callState.isMuted ? 'MUTADO' : `${operatorLevel}%`}
              </span>
            </div>
            {/* Meter Bar */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-75 ${
                  callState.isMuted
                    ? 'bg-transparent'
                    : isNocMode
                    ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${callState.isMuted ? 0 : operatorLevel}%` }}
              />
            </div>
          </div>

          {/* 2. Remote User VU */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                {callState.isSpeakerMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                <span>Usuário Remoto ({device.hostname})</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {callState.isSpeakerMuted ? 'MUTADO' : `${remoteLevel}%`}
              </span>
            </div>
            {/* Meter Bar */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-75 ${
                  callState.isSpeakerMuted
                    ? 'bg-transparent'
                    : isNocMode
                    ? 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${callState.isSpeakerMuted ? 0 : remoteLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Hardware Controls (Mute / Speaker / Volume) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Operator Mic Toggle */}
          <button
            onClick={() => setCallState((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
            className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 font-semibold transition active:scale-95 ${
              callState.isMuted
                ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {callState.isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
            <span>{callState.isMuted ? 'Desmutar Microfone' : 'Mutar Microfone'}</span>
          </button>

          {/* Remote Speaker Toggle */}
          <button
            onClick={() => setCallState((prev) => ({ ...prev, isSpeakerMuted: !prev.isSpeakerMuted }))}
            className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 font-semibold transition active:scale-95 ${
              callState.isSpeakerMuted
                ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {callState.isSpeakerMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{callState.isSpeakerMuted ? 'Ligar Alto-falante' : 'Silenciar Remoto'}</span>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center space-x-3 pt-1">
          <span className="text-[11px] text-slate-400 font-semibold w-14">Volume:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={callState.volume}
            onChange={(e) => setCallState({ ...callState, volume: Number(e.target.value) })}
            className="flex-1 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-[11px] text-slate-300 w-8 text-right">
            {callState.volume}%
          </span>
        </div>

        {/* DSP Audio Settings (Accordion) */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowDspSettings(!showDspSettings)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-slate-200 py-1"
          >
            <span className="flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Processamento Digital de Sinal (DSP / WebRTC)</span>
            </span>
            <span className="text-[10px] text-cyan-400">{showDspSettings ? 'Ocultar' : 'Configurar'}</span>
          </button>

          {showDspSettings && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 animate-in fade-in slide-in-from-top-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 text-[11px]">Cancelamento de Eco (AEC)</span>
                <input
                  type="checkbox"
                  checked={callState.echoCancellation}
                  onChange={(e) => setCallState({ ...callState, echoCancellation: e.target.checked })}
                  className="rounded text-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 text-[11px]">Supressão de Ruído Ativa (NS)</span>
                <input
                  type="checkbox"
                  checked={callState.noiseSuppression}
                  onChange={(e) => setCallState({ ...callState, noiseSuppression: e.target.checked })}
                  className="rounded text-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 text-[11px]">Controle Automático de Ganho (AGC)</span>
                <input
                  type="checkbox"
                  checked={callState.autoGainControl}
                  onChange={(e) => setCallState({ ...callState, autoGainControl: e.target.checked })}
                  className="rounded text-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>CODEC: Opus Full-band 48kHz</span>
                <span>SRTP AES-128</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
