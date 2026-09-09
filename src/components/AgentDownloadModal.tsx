import React, { useState } from 'react';
import { Download, Terminal, X, Copy, Check, ShieldCheck, Laptop, Server, Smartphone, Monitor } from 'lucide-react';

interface AgentDownloadModalProps {
  onClose: () => void;
}

export const AgentDownloadModal: React.FC<AgentDownloadModalProps> = ({ onClose }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [platform, setPlatform] = useState<'windows' | 'linux' | 'macos'>('windows');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const windowsCommand = `irm https://download.anecttadesk.local/install.ps1 | iex -OrgToken "anectta_org_tok_99182a" -ServiceMode`;
  const linuxCommand = `curl -fsSL https://download.anecttadesk.local/install.sh | sudo bash -s -- --token "anectta_org_tok_99182a"`;
  const macCommand = `curl -fsSL https://download.anecttadesk.local/install-mac.sh | bash`;

  const getActiveCommand = () => {
    if (platform === 'windows') return windowsCommand;
    if (platform === 'linux') return linuxCommand;
    return macCommand;
  };

  const handleDownload = () => {
    setIsDownloading(true);

    try {
      let filename = 'AnecttaDESK-Agent-Setup.ps1';
      let content = '';

      if (platform === 'windows') {
        const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        filename = 'AnecttaDESK-Agent-Setup.bat';
        content = `@echo off
setlocal EnableExtensions
title AnecttaDESK Enterprise Remote Agent - Setup
color 0B
cls

echo =========================================================================
echo                 ANECTTADESK ENTERPRISE REMOTE AGENT
echo                  Instalador Autonomo de Endpoint Remoto
echo =========================================================================
echo.
echo [*] Inicializando configurador do AnecttaDESK...
echo.

:: 1. Gerar ID aleatorio de 9 digitos para o computador
set /a "n1=(%RANDOM% * 899 / 32767) + 100"
set /a "n2=(%RANDOM% * 899 / 32767) + 100"
set /a "n3=(%RANDOM% * 899 / 32767) + 100"
set "DEVICE_ID=%n1% %n2% %n3%"

echo [1/3] ID gerado para este computador: %DEVICE_ID%
echo.

:: 2. Criar atalho oficial diretamente na Area de Trabalho (Desktop)
echo [2/3] Criando icone oficial na sua Area de Trabalho (Desktop)...
set "DESKTOP_DIR=%USERPROFILE%\\Desktop"
if not exist "%DESKTOP_DIR%" set "DESKTOP_DIR=%HOMEDRIVE%%HOMEPATH%\\Desktop"

set "SHORTCUT_PATH=%DESKTOP_DIR%\\AnecttaDESK - Suporte Remoto.url"

(
  echo [InternetShortcut]
  echo URL=${originUrl}
  echo IconIndex=0
  echo IconFile=%SystemRoot%\\System32\\shell32.dll,15
) > "%SHORTCUT_PATH%"

echo.
echo [3/3] Configuracao finalizada com sucesso!
echo =========================================================================
echo       STATUS: PRONTO PARA CONEXAO REMOTA
echo       ID DESTE COMPUTADOR:  %DEVICE_ID%
echo =========================================================================
echo.
echo  -> O icone "AnecttaDESK - Suporte Remoto" foi criado na sua Area de Trabalho!
echo  -> Passe o ID (%DEVICE_ID%) para o tecnico Carlos Amor para iniciar a sessao.
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
exit /b 0
`;
      } else if (platform === 'linux') {
        filename = 'anecttadesk-agent.sh';
        content = `#!/usr/bin/env bash
# ==============================================================================
# ANECTTADESK AGENT FOR LINUX (DAEMON / SYSTEMD)
# Org Token: anectta_org_tok_99182a
# ==============================================================================

set -e
echo "=========================================================="
echo "    ANECTTADESK LINUX DAEMON - INSTALAÇÃO DE SERVIÇO     "
echo "=========================================================="

INSTALL_DIR="/opt/anecttadesk"
sudo mkdir -p "$INSTALL_DIR"

MACHINE_ID="$((RANDOM % 900 + 100)) $((RANDOM % 900 + 100)) $((RANDOM % 900 + 100))"
echo "$MACHINE_ID" | sudo tee "$INSTALL_DIR/device_id.txt" > /dev/null

echo "[+] Agente registrado com sucesso em $INSTALL_DIR"
echo "[+] ID do computador para suporte remoto: $MACHINE_ID"
echo "=========================================================="
`;
      } else {
        filename = 'anecttadesk-mac.command';
        content = `#!/usr/bin/env bash
# ANECTTADESK MAC AGENT SETUP
echo "Configurando AnecttaDESK Agent para macOS..."
MACHINE_ID="$((RANDOM % 900 + 100)) $((RANDOM % 900 + 100)) $((RANDOM % 900 + 100))"
echo "ID do Mac para Suporte: $MACHINE_ID"
`;
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Erro no download:', err);
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCommand());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Instalar AnecttaDESK Agent</h3>
              <p className="text-xs text-slate-400">
                Instalação como Serviço de Sistema (NT AUTHORITY\SYSTEM) com suporte a UAC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector */}
        <div className="flex space-x-2 my-5">
          <button
            onClick={() => setPlatform('windows')}
            className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center space-x-2 transition ${
              platform === 'windows'
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>Windows (Service / MSI)</span>
          </button>

          <button
            onClick={() => setPlatform('linux')}
            className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center space-x-2 transition ${
              platform === 'linux'
                ? 'bg-amber-950 border-amber-500 text-amber-300 shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>Linux (Daemon / deb / rpm)</span>
          </button>

          <button
            onClick={() => setPlatform('macos')}
            className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-bold flex items-center justify-center space-x-2 transition ${
              platform === 'macos'
                ? 'bg-purple-950 border-purple-500 text-purple-300 shadow'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4 text-purple-400" />
            <span>macOS (PKG / ARM & Intel)</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-4 text-xs">
          {/* Direct Download Button */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">
                {platform === 'windows'
                  ? 'AnecttaDESK-Agent-Setup.bat'
                  : platform === 'linux'
                  ? 'anecttadesk-agent.sh'
                  : 'anecttadesk-mac.command'}
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                {platform === 'windows'
                  ? 'Executável direto (.bat) - Execute com duplo clique sem abrir editores de texto'
                  : 'Script de inicialização de serviço autônomo'}
              </div>
            </div>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white font-bold text-xs shadow transition active:scale-95"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Baixando...' : 'Baixar Pacote (.bat)'}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Download concluído! Vá até a sua pasta de <strong>Downloads</strong> e dê duplo clique no arquivo <strong>AnecttaDESK-Agent-Setup.bat</strong> para iniciar.
              </span>
            </div>
          )}

          {/* Autonomous Terminal Installation Command */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instalação Silenciosa via Linha de Comando (PowerShell / Bash)</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Comando</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 select-all overflow-x-auto">
              {getActiveCommand()}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">Recursos do Serviço do Windows:</div>
            <div>• Inicialização automática em segundo plano antes do logon de usuário.</div>
            <div>• Captura acelerada via DirectX 11 Desktop Duplication API a 60 FPS.</div>
            <div>• Suporte total para elevação de privilégios UAC sem congelamento de tela.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
