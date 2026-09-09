import React from 'react';
import { Download, Monitor, CheckCircle2, X, ExternalLink, ShieldCheck, Laptop } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall: () => void;
  canInstallDirectly: boolean;
  isNocMode?: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  canInstallDirectly,
  isNocMode = false,
}) => {
  const [downloadedBat, setDownloadedBat] = React.useState(false);

  if (!isOpen) return null;

  // Use dynamic current active URL (window.location.origin) so it never 404s
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-lmqimukulkdhwi3nxdtkg3-660100840056.us-west2.run.app';

  const handleDownloadShortcutBat = () => {
    const batContent = `@echo off
setlocal EnableExtensions
title AnecttaDESK - Criador de Atalho no Desktop
color 0B
cls

echo =========================================================================
echo                 ANECTTADESK ENTERPRISE - ATALHO DESKTOP
echo =========================================================================
echo.
echo [*] Criando atalho do AnecttaDESK na sua Area de Trabalho...
echo.

set "DESKTOP_DIR=%USERPROFILE%\\Desktop"
if not exist "%DESKTOP_DIR%" set "DESKTOP_DIR=%HOMEDRIVE%%HOMEPATH%\\Desktop"

set "SHORTCUT_PATH=%DESKTOP_DIR%\\AnecttaDESK.url"

(
  echo [InternetShortcut]
  echo URL=${currentOrigin}
  echo IconIndex=0
  echo IconFile=%SystemRoot%\\System32\\mstsc.exe
) > "%SHORTCUT_PATH%"

echo [OK] Atalho criado com sucesso em:
echo      "%SHORTCUT_PATH%"
echo.
echo =========================================================================
echo   Pronto! O icone 'AnecttaDESK' ja esta na sua Area de Trabalho!
echo   Basta dar 2 cliques nele a qualquer momento para abrir o console.
echo =========================================================================
echo.
echo Pressione qualquer tecla para concluir...
pause >nul
exit /b 0
`;

    const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Criar-Atalho-AnecttaDESK.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedBat(true);
    setTimeout(() => setDownloadedBat(false), 5000);
  };

  const handleOpenNewTab = () => {
    window.open(currentOrigin, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className={`max-w-lg w-full rounded-2xl border p-6 shadow-2xl space-y-5 animate-in zoom-in-95 ${
        isNocMode 
          ? 'bg-black border-[#00f0ff]/50 text-white' 
          : 'bg-slate-900 border-slate-700 text-slate-100'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Instalar AnecttaDESK no seu Computador
              </h3>
              <p className="text-xs text-slate-400">
                Criar ícone oficial na Área de Trabalho e Menu Iniciar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Options */}
        <div className="space-y-3 text-xs text-slate-300">
          {/* Method 1: 1-Click Desktop Shortcut Generator (Immediate on Windows) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-sm">Opção 1: Criar Ícone na Área de Trabalho com 1 Clique</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Recomendado
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Baixa um gerador automático que cria o atalho oficial <strong>AnecttaDESK</strong> na sua Área de Trabalho (Desktop) do Windows em 2 segundos.
            </p>
            <button
              onClick={handleDownloadShortcutBat}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Criador de Ícone (.bat)</span>
            </button>
            {downloadedBat && (
              <div className="p-2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] flex items-center space-x-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Arquivo <strong>Criar-Atalho-AnecttaDESK.bat</strong> baixado! Dê dois cliques para criar o ícone.</span>
              </div>
            )}
          </div>

          {/* Method 2: Open in Top-Level Tab for Native Browser PWA */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-sm">Opção 2: Instalar no Navegador (Chrome / Edge PWA)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Como esta janela atual é uma visualização embutida, o Chrome/Edge só permite a instalação nativa do PWA quando aberto em uma <strong>aba própria</strong>.
            </p>
            <button
              onClick={handleOpenNewTab}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Abrir em Nova Aba para Instalar</span>
            </button>
            <p className="text-[10px] text-slate-400">
              Na nova aba, clique no ícone de <strong>Instalar</strong> (monitorzinho com seta) na barra de endereços do Chrome.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
