import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Monitor, 
  LayoutDashboard, 
  Users, 
  History, 
  FileText, 
  Settings, 
  Terminal, 
  Headphones, 
  ShieldAlert, 
  Contrast, 
  Menu, 
  X, 
  Layers,
  Download
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
        : 'backdrop-blur-xl bg-white/95 border-slate-200/90 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* 1. BRAND & LOGO OFICIAL ANECTTA */}
          <div className="flex items-center space-x-3 shrink-0">
            <div 
              onClick={() => {
                setCurrentTab('remote_support');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 cursor-pointer group py-1"
              title="ANECTTA - Soluções em Tecnologia & Acesso Remoto"
            >
              <img 
                src="/assets/images/anectta-logo-transparent.png" 
                alt="ANECTTA" 
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(2,132,199,0.2)] group-hover:opacity-95 transition"
              />
              <div className="hidden sm:block border-l border-slate-200 dark:border-slate-800 pl-3">
                <div className="flex items-center space-x-1.5 leading-none">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">DESK</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-300/40">
                    Remoto
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold font-mono">
                    {onlineCount}/{totalDevices} Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PRIMARY NAVIGATION COM ÍCONES SQUIRCLE AZUIS DEGRADÊ (EXATAMENTE COMO O SITE ANECTTA) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
            {/* Suporte Remoto / Início */}
            <button
              onClick={() => setCurrentTab('remote_support')}
              className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 group ${
                currentTab === 'remote_support'
                  ? 'text-sky-600 bg-sky-50/80 dark:bg-slate-800/80 font-bold'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 group-hover:shadow-sky-500/40 transition-all duration-200 ${
                currentTab === 'remote_support' ? 'ring-2 ring-sky-500 ring-offset-2' : ''
              }`}>
                <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L2 11h3v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-5h2v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9h3L12 3z"/>
                </svg>
              </div>
              <span className="text-[10.5px] xl:text-[11px] font-semibold tracking-wide">Suporte</span>
            </button>

            {/* Painel Geral (NOC) */}
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 group ${
                currentTab === 'dashboard'
                  ? 'text-sky-600 bg-sky-50/80 dark:bg-slate-800/80 font-bold'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 group-hover:shadow-sky-500/40 transition-all duration-200 ${
                currentTab === 'dashboard' ? 'ring-2 ring-sky-500 ring-offset-2' : ''
              }`}>
                <LayoutDashboard className="w-[17px] h-[17px] text-white" />
              </div>
              <span className="text-[10.5px] xl:text-[11px] font-semibold tracking-wide">Painel</span>
            </button>

            {/* Dispositivos */}
            <button
              onClick={() => setCurrentTab('devices')}
              className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 group relative ${
                currentTab === 'devices'
                  ? 'text-sky-600 bg-sky-50/80 dark:bg-slate-800/80 font-bold'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 group-hover:shadow-sky-500/40 transition-all duration-200 ${
                currentTab === 'devices' ? 'ring-2 ring-sky-500 ring-offset-2' : ''
              }`}>
                <Monitor className="w-[17px] h-[17px] text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10.5px] xl:text-[11px] font-semibold tracking-wide">Dispositivos</span>
                <span className="text-[9px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {totalDevices}
                </span>
              </div>
            </button>

            {/* Chamados & Chat */}
            <button
              onClick={() => setCurrentTab('support')}
              className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 group relative ${
                currentTab === 'support' || currentTab === 'chat'
                  ? 'text-sky-600 bg-sky-50/80 dark:bg-slate-800/80 font-bold'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 group-hover:shadow-sky-500/40 transition-all duration-200 relative ${
                currentTab === 'support' || currentTab === 'chat' ? 'ring-2 ring-sky-500 ring-offset-2' : ''
              }`}>
                <Headphones className="w-[17px] h-[17px] text-white" />
                {ticketsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {ticketsCount}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] xl:text-[11px] font-semibold tracking-wide">Chamados</span>
            </button>

            {/* Alertas */}
            <button
              onClick={() => setCurrentTab('alerts')}
              className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 group relative ${
                currentTab === 'alerts'
                  ? 'text-rose-600 bg-rose-50/80 dark:bg-slate-800/80 font-bold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 group-hover:shadow-sky-500/40 transition-all duration-200 relative ${
                currentTab === 'alerts' ? 'ring-2 ring-rose-500 ring-offset-2' : ''
              }`}>
                <ShieldAlert className="w-[17px] h-[17px] text-white" />
                {criticalAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                    {criticalAlertsCount}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] xl:text-[11px] font-semibold tracking-wide">Alertas</span>
            </button>

            {/* Dropdown: Governança & Ferramentas */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className={`flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-all duration-200 group ${
                  isSecondaryTabActive || showToolsDropdown
                    ? 'text-sky-600 bg-sky-50/80 dark:bg-slate-800/80 font-bold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
                title="Ferramentas avançadas de infraestrutura e governança"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 group-hover:shadow-sky-500/40 transition-all duration-200">
                  <Layers className="w-[17px] h-[17px] text-white" />
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10.5px] xl:text-[11px] font-semibold tracking-wide">
                    {isSecondaryTabActive && activeSecondaryItem ? activeSecondaryItem.label.split(' ')[0] : 'Mais'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Tools Dropdown Menu */}
              {showToolsDropdown && (
                <div className={`absolute left-0 mt-2 w-64 rounded-2xl border shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 ${
                  isNoc ? 'bg-black border-[#00f0ff]/40' : 'bg-white border-slate-200'
                }`}>
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Governança & Automação Anectta
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
                        className={`w-full px-3.5 py-2.5 flex items-start space-x-3 text-left text-xs transition ${
                          isActive 
                            ? 'bg-sky-50 text-sky-700 font-bold dark:bg-slate-800 dark:text-cyan-300' 
                            : 'text-slate-700 hover:bg-slate-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
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

          {/* 3. CTAs DO CABEÇALHO (PRECISO DE SUPORTE + CONTROLES) */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Botão de Conexão Rápida / Nova Conexão */}
            <button
              onClick={() => setCurrentTab('remote_support')}
              type="button"
              className="px-3.5 sm:px-4 py-2.5 rounded-xl btn-emergency text-xs font-bold text-white flex items-center gap-2 shadow-md whitespace-nowrap active:scale-95 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald" />
              <span>NOVA CONEXÃO</span>
            </button>

            {/* NOC Mode Quick Toggle */}
            {onToggleThemeMode && (
              <button
                onClick={onToggleThemeMode}
                className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all active:scale-95 ${
                  isNoc
                    ? 'bg-black text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Alternar Modo NOC de Alto Contraste"
              >
                <Contrast className={`w-4 h-4 ${isNoc ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span className="hidden xl:inline text-[11px]">NOC</span>
              </button>
            )}

            {/* Baixar Agent */}
            <button
              onClick={onOpenAgentModal}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
              title="Instalar Agente no Cliente (Windows / Linux / macOS)"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Agent</span>
            </button>

            {/* Configurações Globais */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition active:scale-95"
                title="Ajustes e Parâmetros do AnecttaDESK"
              >
                <Settings className="w-4 h-4 text-slate-600" />
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              title="Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 4. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 ${
          isNoc ? 'bg-black border-[#00f0ff]/30' : 'bg-white border-slate-200'
        }`}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setCurrentTab('remote_support');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl flex items-center space-x-2 border bg-sky-50 text-sky-700 font-bold border-sky-200"
            >
              <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L2 11h3v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-5h2v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9h3L12 3z"/>
                </svg>
              </div>
              <span>Suporte Remoto</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl flex items-center space-x-2 border bg-slate-50 border-slate-200 text-slate-700"
            >
              <LayoutDashboard className="w-4 h-4 text-sky-600" />
              <span>Painel</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('devices');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl flex items-center justify-between border bg-slate-50 border-slate-200 text-slate-700"
            >
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-sky-600" />
                <span>Dispositivos</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200 text-slate-600">
                {totalDevices}
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('support');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl flex items-center justify-between border bg-slate-50 border-slate-200 text-slate-700"
            >
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-sky-600" />
                <span>Chamados</span>
              </div>
              {ticketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-600 text-white">
                  {ticketsCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={onOpenAgentModal}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-700 font-bold flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Agente AnecttaDESK</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
