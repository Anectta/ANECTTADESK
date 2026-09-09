import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  X, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  CornerDownLeft, 
  ShieldCheck 
} from 'lucide-react';
import { Device, TerminalHistoryItem } from '../types';

interface RemoteTerminalModalProps {
  device: Device;
  onClose: () => void;
}

const PRESET_COMMANDS = [
  'ipconfig /all',
  'Get-Service | Select-Object -First 10',
  'netstat -ano',
  'systeminfo',
  'Get-Process | Sort-Object CPU -Descending | Select-Object -First 5',
  'ping 8.8.8.8 -n 4',
];

export const RemoteTerminalModal: React.FC<RemoteTerminalModalProps> = ({
  device,
  onClose,
}) => {
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    {
      id: 'term-1',
      command: 'echo "AnecttaDESK Remote Terminal Initialized"',
      output: `Microsoft Windows [Versão 10.0.22631.3296]\n(c) Microsoft Corporation. Todos os direitos reservados.\nSessão de terminal remoto autenticada sob NT AUTHORITY\\SYSTEM no host: ${device.hostname}`,
      timestamp: '10:05:01',
      status: 'success',
    },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const timeStr = new Date().toLocaleTimeString();
    let simulatedOutput = '';

    if (trimmed.toLowerCase().startsWith('ipconfig')) {
      simulatedOutput = `Configuração de IP do Windows\n\nAdaptador Ethernet Ethernet0:\n   Sufixo DNS específico de conexão. . . : anectta.corp\n   Endereço IPv4. . . . . . . .  . . . . : ${device.localIp}\n   Máscara de Sub-rede . . . . . . . . . : 255.255.255.0\n   Gateway Padrão. . . . . . . . . . . . : 192.168.1.1\n   Servidores DNS. . . . . . . . . . . . : 1.1.1.1, 8.8.8.8`;
    } else if (trimmed.toLowerCase().includes('get-service')) {
      simulatedOutput = `Status   Name               DisplayName\n------   ----               -----------\nRunning  AnecttaDESK        AnecttaDESK Host Service\nRunning  AudioSrv           Áudio do Windows\nRunning  Dhcp               Cliente DHCP\nRunning  Dnscache           Cliente DNS\nRunning  LanmanWorkstation  Estação de trabalho\nRunning  Spooler            Spooler de Impressão\nRunning  W32Time            Horário do Windows\nRunning  WinDefend          Microsoft Defender Antivírus`;
    } else if (trimmed.toLowerCase().startsWith('netstat')) {
      simulatedOutput = `Conexões Ativas\n  Proto  Endereço Local          Endereço Externo        Estado          PID\n  TCP    0.0.0.0:443             0.0.0.0:0               LISTENING       4\n  TCP    192.168.1.45:51820       177.136.241.80:51820    ESTABLISHED     1420\n  TCP    127.0.0.1:3000          0.0.0.0:0               LISTENING       824\n  UDP    0.0.0.0:3478            *:*                                     824`;
    } else if (trimmed.toLowerCase().startsWith('systeminfo')) {
      simulatedOutput = `Nome do Host:                  ${device.hostname}\nNome do Sistema Operacional:   ${device.osVersion}\nFabricante do Sistema:         Dell Inc.\nModelo do Sistema:             OptiPlex 7090\nTipo de Sistema:               x64-based PC\nProcessador(es):               ${device.hardwareSpec.cpu}\nMemória Física Total:          ${device.hardwareSpec.ramGb}.000 MB\nPlaca de Rede:                 ${device.hardwareSpec.networkAdapter}\nUptime:                        ${device.hardwareSpec.uptimeHours} horas`;
    } else if (trimmed.toLowerCase().startsWith('ping')) {
      simulatedOutput = `Disparando 8.8.8.8 com 32 bytes de dados:\nResposta de 8.8.8.8: bytes=32 tempo=12ms TTL=117\nResposta de 8.8.8.8: bytes=32 tempo=11ms TTL=117\nResposta de 8.8.8.8: bytes=32 tempo=13ms TTL=117\nResposta de 8.8.8.8: bytes=32 tempo=11ms TTL=117\n\nEstatísticas do Ping para 8.8.8.8:\n    Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de perda),\nTempo médio de ida e volta: 11ms`;
    } else if (trimmed.toLowerCase() === 'cls' || trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setCurrentInput('');
      return;
    } else {
      simulatedOutput = `Comando executado com código de retorno 0 (SUCCESS):\n[Output]: ${trimmed} concluído com êxito pelo AnecttaDESK Remote Service Host.`;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `term-${Date.now()}`,
        command: trimmed,
        output: simulatedOutput,
        timestamp: timeStr,
        status: 'success',
      },
    ]);
    setCurrentInput('');
  };

  const handleCopyAll = () => {
    const text = history.map((h) => `PS C:\\> ${h.command}\n${h.output}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-4xl w-full p-5 shadow-2xl text-slate-100 flex flex-col h-[85vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <TerminalIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Terminal Remoto Administrativo (PowerShell)</h3>
                <span className="font-mono text-xs text-emerald-400 font-semibold">[{device.hostname}]</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Canal seguro via Agent Daemon (Session 0) • Comandos executados sem interferir na tela do usuário
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAll}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs flex items-center space-x-1"
              title="Copiar Histórico"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setHistory([])}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Limpar Terminal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Quick Commands */}
        <div className="flex items-center space-x-2 my-2.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-400 font-semibold whitespace-nowrap">Comandos Rápidos:</span>
          {PRESET_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="whitespace-nowrap px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-700 text-cyan-300 font-mono transition active:scale-95"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Screen Area */}
        <div className="flex-1 bg-black/95 p-4 rounded-lg border border-slate-800/90 overflow-y-auto font-mono text-xs text-emerald-400 space-y-4">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="text-cyan-400 font-bold">PS C:\Windows\System32&gt;</span>
                <span className="text-white font-semibold">{item.command}</span>
                <span className="text-[10px] text-slate-500 ml-auto font-sans">{item.timestamp}</span>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed pl-2 border-l border-slate-800 font-mono text-[11px]">
                {item.output}
              </pre>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(currentInput);
          }}
          className="mt-3 flex items-center space-x-2"
        >
          <div className="flex-1 relative flex items-center bg-slate-900 border border-slate-700 focus-within:border-cyan-500 rounded-lg px-3 py-2">
            <span className="font-mono text-cyan-400 font-bold text-xs mr-2">PS C:\&gt;</span>
            <input
              type="text"
              placeholder="Digite um comando do Windows (ex: ipconfig, netstat, Get-Process)..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-white placeholder-slate-500 outline-none"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
          >
            <span>Executar</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
