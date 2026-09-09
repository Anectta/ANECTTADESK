import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Download, 
  ChevronDown, 
  Monitor, 
  LayoutDashboard, 
  Users, 
  History, 
  FileText,
  Settings,
  Terminal,
  Headphones,
  Bell,
  ShieldAlert,
  Contrast,
  Menu,
  X,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAgentModal: () => void;
  onOpenSettings?: () => void;
  onlineCount: number;
  totalDevices: number;
  operatorCount?: number;
  scriptsCount?: number;
  alertsCount?: number;
  criticalAlertsCount?: number;
  ticketsCount?: number;
  themeMode?: 'standard_dark' | 'noc_high_contrast';
  onToggleThemeMode?: () => void;
  onOpenReportModal?: () => void;
  onOpenPwaModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAgentModal,
  onOpenSettings,
  onlineCount,
  totalDevices,
  operatorCount = 6,
  scriptsCount = 6,
  alertsCount = 0,
  criticalAlertsCount = 0,
  ticketsCount = 0,
  themeMode = 'standard_dark',
  onToggleThemeMode,
  onOpenReportModal,
  onOpenPwaModal,
}) => {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const secondaryTabs = [
    { id: 'automation', label: 'Automação & Scripts', icon: Terminal, desc: 'Execução em lote de scripts' },
    { id: 'sessions', label: 'Histórico & Vídeo', icon: History, desc: 'Gravações forenses de sessões' },
    { id: 'audit', label: 'Auditoria & Logs', icon: FileText, desc: 'Trilha imutável de eventos' },
    { id: 'operators', label: 'Equipe & RBAC', icon: Users, desc: 'Operadores e permissões' },
  ];

  const isSecondaryTabActive = secondaryTabs.some((t) => t.id === currentTab);
  const activeSecondaryItem = secondaryTabs.find((t) => t.id === currentTab);

  const isNoc = themeMode === 'noc_high_contrast';

  return (
    <header className={`sticky top-0 z-40 select-none border-b transition-colors shadow-sm ${
      isNoc 
        ? 'bg-black border-[#00f0ff]/30 text-white' 
        : 'bg-slate-900/95 backdrop-blur-md border-slate-800 text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* 1. BRAND & LOGO */}
          <div className="flex items-center space-x-3 shrink-0">
            <div 
              onClick={() => {
                setCurrentTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${
                isNoc 
                  ? 'bg-black border border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                  : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-900/30'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1 leading-none">
                  <span className="font-extrabold text-lg tracking-tight text-white">ANECTTA</span>
                  <span className="font-black text-lg tracking-wider text-cyan-400">DESK</span>
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
                    TLS 1.3 • {onlineCount}/{totalDevices} Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PRIMARY DESKTOP NAVIGATION (Standardized Tab Bar) */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
            {/* Tab: Painel */}
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Painel</span>
            </button>

            {/* Tab: Dispositivos */}
            <button
              onClick={() => setCurrentTab('devices')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'devices'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Dispositivos</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {totalDevices}
              </span>
            </button>

            {/* Tab: Chamados & Chat */}
            <button
              onClick={() => setCurrentTab('support')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'support'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Chamados</span>
              {ticketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                  {ticketsCount}
                </span>
              )}
            </button>

            {/* Tab: Alertas */}
            <button
              onClick={() => setCurrentTab('alerts')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'alerts'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Alertas</span>
              {criticalAlertsCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                  {criticalAlertsCount}
                </span>
              ) : alertsCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                  {alertsCount}
                </span>
              ) : null}
            </button>

            {/* Dropdown: Gestão & Ferramentas (Automação, Histórico, Auditoria, Equipe) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors border ${
                  isSecondaryTabActive
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-sm'
                    : showToolsDropdown
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-transparent'
                }`}
                title="Ferramentas avançadas de infraestrutura e governança"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {isSecondaryTabActive && activeSecondaryItem ? activeSecondaryItem.label.split(' ')[0] : 'Ferramentas'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showToolsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Tools Dropdown Menu */}
              {showToolsDropdown && (
                <div className={`absolute left-0 mt-2 w-64 rounded-xl border shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 ${
                  isNoc ? 'bg-black border-[#00f0ff]/40' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
                    Governança & Automação
                  </div>
                  {secondaryTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setCurrentTab(tab.id);
                          setShowToolsDropdown(false);
                        }}
                        className={`w-full px-3 py-2.5 flex items-start space-x-2.5 text-left text-xs transition ${
                          isActive 
                            ? 'bg-cyan-950/80 text-cyan-300 font-bold' 
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <div>
                          <div className="font-semibold leading-tight">{tab.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{tab.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* 3. RIGHT ACTION CONTROLS */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* NOC Mode Quick Toggle Button */}
            {onToggleThemeMode && (
              <button
                onClick={onToggleThemeMode}
                className={`px-2 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all active:scale-95 ${
                  isNoc
                    ? 'bg-black text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700/60'
                }`}
                title="Alternar Modo NOC de Alto Contraste"
              >
                <Contrast className={`w-3.5 h-3.5 ${isNoc ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">NOC</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isNoc ? 'bg-[#00ff88] shadow-[0_0_6px_#00ff88]' : 'bg-slate-500'
                  }`}
                />
              </button>
            )}

            {/* Relatório Mensal em PDF */}
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="hidden sm:flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
                title="Exportar Relatório Mensal de SLA (PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Relatório PDF</span>
              </button>
            )}

            {/* Instalar como App no Desktop (PWA) */}
            {onOpenPwaModal && (
              <button
                onClick={onOpenPwaModal}
                className="hidden md:flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-800/60 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
                title="Instalar AnecttaDESK como App no Computador (Ícone na Área de Trabalho)"
              >
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instalar App</span>
              </button>
            )}

            {/* Baixar Agent */}
            <button
              onClick={onOpenAgentModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 border border-cyan-400/30"
              title="Instalar Agente no Cliente (Windows / Linux / macOS)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Agent</span>
            </button>

            {/* Configurações Globais */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition active:scale-95"
                title="Ajustes e Parâmetros do AnecttaDESK"
              >
                <Settings className="w-3.5 h-3.5 text-slate-300" />
              </button>
            )}

            <div className="h-5 w-px bg-slate-800 hidden sm:block mx-0.5" />

            {/* Operator Avatar & Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/50 border border-slate-700/40 rounded-lg p-1 pr-2.5">
              <div className="w-6 h-6 rounded-md bg-cyan-900/80 border border-cyan-500/40 flex items-center justify-center text-[11px] font-bold text-cyan-200">
                CA
              </div>
              <div className="text-left hidden 2xl:block">
                <div className="text-[11px] font-semibold text-slate-200 leading-tight">Carlos Amor</div>
                <div className="text-[9px] text-slate-400 leading-tight">Técnico N3</div>
              </div>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
              title="Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* 4. MOBILE / TABLET DRAWER (FULL RESPONSIVE MENU) */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 ${
          isNoc ? 'bg-black border-[#00f0ff]/30' : 'bg-slate-950 border-slate-800'
        }`}>
          {/* Main Mobile Navigation */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setCurrentTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg flex items-center space-x-2 border transition ${
                currentTab === 'dashboard'
                  ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Painel</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('devices');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg flex items-center justify-between border transition ${
                currentTab === 'devices'
                  ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Dispositivos</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                {totalDevices}
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('support');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg flex items-center justify-between border transition ${
                currentTab === 'support'
                  ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>Chamados</span>
              </div>
              {ticketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-600 text-white">
                  {ticketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentTab('alerts');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg flex items-center justify-between border transition ${
                currentTab === 'alerts'
                  ? 'bg-rose-950 border-rose-800 text-rose-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Alertas</span>
              </div>
              {alertsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-600 text-white">
                  {alertsCount}
                </span>
              )}
            </button>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-1">
            Governança & Ferramentas
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg flex items-center space-x-2 border text-left transition ${
                    isActive
                      ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {onOpenReportModal && (
            <button
              onClick={() => {
                onOpenReportModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center justify-center space-x-2 font-semibold"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exportar Relatório Mensal SLA em PDF</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
