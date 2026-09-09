import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Monitor, 
  MessageSquare, 
  MoreHorizontal, 
  Settings, 
  MessageCircle, 
  HelpCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Square, 
  X, 
  ShieldCheck, 
  Download, 
  Sliders, 
  Terminal, 
  History, 
  FileText, 
  Users, 
  Bell, 
  Activity,
  Menu
} from 'lucide-react';
import { Device } from '../types';

interface DesktopClientLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAgentModal: () => void;
  onOpenSettings: () => void;
  onOpenPwaModal: () => void;
  onOpenReportModal: () => void;
  themeMode: 'standard_dark' | 'noc_high_contrast';
  onToggleThemeMode: () => void;
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  onlineCount: number;
  totalDevices: number;
  unreadChats?: number;
  activeAlerts?: number;
  onQuickConnectDevice?: (device: Device) => void;
  devices: Device[];
}

export const DesktopClientLayout: React.FC<DesktopClientLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAgentModal,
  onOpenSettings,
  onOpenPwaModal,
  onOpenReportModal,
  themeMode,
  onToggleThemeMode,
  children,
  userEmail = 'carlosamorfbr@gmail.com',
  userName = 'Carlos Amor',
  onlineCount,
  totalDevices,
  unreadChats = 2,
  activeAlerts = 0,
  onQuickConnectDevice,
  devices,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSolutionsMenu, setShowSolutionsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter devices for top search bar
  const searchResults = devices.filter((d) => 
    d.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.anecttadeskId && d.anecttadeskId.includes(searchQuery)) ||
    (d.publicIp && d.publicIp.includes(searchQuery))
  );

  const isNoc = themeMode === 'noc_high_contrast';

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden select-none font-sans ${
      isNoc ? 'bg-black text-white' : 'bg-[#f4f6fa] text-slate-900'
    }`}>
      {/* 1. TOP WINDOW TITLEBAR */}
      <div className={`h-11 flex items-center justify-between px-3 border-b shrink-0 z-30 transition-colors ${
        isNoc 
          ? 'bg-black border-cyan-500/30 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Left: History Nav Arrows + Mobile Toggle */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentTab('remote_support')}
            title="Voltar ao Suporte Remoto"
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentTab('devices')}
            title="Avançar para Dispositivos"
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Search & Connect (Ctrl + K) */}
        <div className="relative max-w-md w-full mx-4">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(e.target.value.length > 0);
              }}
              onFocus={() => {
                if (searchQuery.length > 0) setShowSearchDropdown(true);
              }}
              placeholder="Pesquisar e conectar"
              className="w-full pl-8 pr-16 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition"
            />
            <span className="absolute right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 pointer-events-none">
              Ctrl + K
            </span>
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in">
              {searchResults.slice(0, 5).map((dev) => (
                <button
                  key={dev.id}
                  onClick={() => {
                    if (onQuickConnectDevice) onQuickConnectDevice(dev);
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition"
                >
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-cyan-500" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">{dev.hostname}</div>
                      <div className="text-[10px] text-slate-400">{dev.publicIp} • {dev.osType}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                    {dev.anecttadeskId || '735 006 750'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Options + User Avatar (CA) + Window Controls */}
        <div className="flex items-center space-x-3">
          {/* User Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Conta do Operador"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                CA
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2 animate-in fade-in">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="font-bold text-slate-900 dark:text-white">{userName}</div>
                  <div className="text-slate-400 text-[11px]">{userEmail}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    ● Licença Enterprise Ativa
                  </div>
                </div>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configurações da Conta</span>
                </button>
                <button
                  onClick={() => {
                    onOpenPwaModal();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Instalar no Computador</span>
                </button>
              </div>
            )}
          </div>

          {/* Controles de Janela do Cliente Desktop (— ▢ ✕) */}
          <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-slate-200 dark:border-slate-800">
            <button 
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              title="Minimizar"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              title="Maximizar"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button 
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
              title="Fechar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-BAR: ENTERPRISE LICENSE BANNER */}
      <div className={`h-8 px-4 flex items-center justify-between text-[11px] border-b shrink-0 z-20 ${
        isNoc 
          ? 'bg-slate-950 border-slate-800 text-slate-300' 
          : 'bg-[#eef2f6] border-slate-200/90 text-slate-600'
      }`}>
        <div className="flex items-center space-x-2">
          <span>Licença Enterprise (AnecttaDESK Corp)</span>
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{userName}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenPwaModal}
            className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
          >
            Instalar como App Desktop
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={onToggleThemeMode}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
            title="Alternar Contraste NOC"
          >
            {isNoc ? 'Modo Padrão' : 'Modo NOC'}
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE WITH SIDEBAR */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ========================================================================= */}
        {/* ANECTTADESK DEEP NAVY BLUE CLIENT SIDEBAR */}
        {/* ========================================================================= */}
        <aside className={`w-56 shrink-0 flex flex-col justify-between p-3.5 transition-all duration-200 z-30 ${
          isNoc ? 'bg-[#030712] border-r border-cyan-500/30 text-white' : 'bg-[#0c2382] text-white shadow-xl'
        } ${
          sidebarOpen ? 'absolute inset-y-0 left-0 shadow-2xl' : 'hidden md:flex'
        }`}>
          {/* Top Section: Logo + Navigation Items */}
          <div className="space-y-6">
            {/* AnecttaDESK Logo Header */}
            <div className="flex items-center space-x-2.5 px-2 pt-1 pb-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0c2382] shadow-md shadow-blue-900/40">
                <ArrowLeftRight className="w-4 h-4 text-[#0c2382]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Anectta<span className="text-cyan-300">DESK</span>
                </span>
              </div>
            </div>

            {/* Main Menu Links */}
            <nav className="space-y-1">
              {/* Item 1: Suporte remoto (Active default) */}
              <button
                onClick={() => {
                  setCurrentTab('remote_support');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                  currentTab === 'remote_support'
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-700/40'
                    : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4 shrink-0" />
                <span>Suporte remoto</span>
              </button>

              {/* Item 2: Dispositivos */}
              <button
                onClick={() => {
                  setCurrentTab('devices');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                  currentTab === 'devices' || currentTab === 'groups' || currentTab === 'favorites'
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-700/40'
                    : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Monitor className="w-4 h-4 shrink-0" />
                  <span>Dispositivos</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-900/80 text-cyan-300 font-mono">
                  {onlineCount}
                </span>
              </button>

              {/* Item 3: Chat */}
              <button
                onClick={() => {
                  setCurrentTab('chat');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                  currentTab === 'chat'
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-700/40'
                    : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Chat</span>
                </div>
                {unreadChats > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                    {unreadChats}
                  </span>
                )}
              </button>

              {/* Item 4: Mais soluções (Flyout / Secondary Menu) */}
              <div className="relative">
                <button
                  onClick={() => setShowSolutionsMenu(!showSolutionsMenu)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                    showSolutionsMenu || ['dashboard', 'sessions', 'audit', 'automation', 'operators', 'alerts'].includes(currentTab)
                      ? 'bg-white/15 text-white'
                      : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MoreHorizontal className="w-4 h-4 shrink-0" />
                    <span>Mais soluções</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSolutionsMenu ? 'rotate-90' : ''}`} />
                </button>

                {/* Submenu links */}
                {showSolutionsMenu && (
                  <div className="pl-4 pr-1 py-1 space-y-1 mt-1 bg-black/20 rounded-xl border border-white/10 animate-in fade-in">
                    <button
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setShowSolutionsMenu(false);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                        currentTab === 'dashboard' ? 'bg-blue-600 text-white font-bold' : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Painel Geral (NOC)</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('sessions');
                        setShowSolutionsMenu(false);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                        currentTab === 'sessions' ? 'bg-blue-600 text-white font-bold' : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <History className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Histórico & Vídeo</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('automation');
                        setShowSolutionsMenu(false);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                        currentTab === 'automation' ? 'bg-blue-600 text-white font-bold' : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Automação & Scripts</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('audit');
                        setShowSolutionsMenu(false);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                        currentTab === 'audit' ? 'bg-blue-600 text-white font-bold' : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Auditoria & Logs</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('operators');
                        setShowSolutionsMenu(false);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center space-x-2 ${
                        currentTab === 'operators' ? 'bg-blue-600 text-white font-bold' : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Operadores & RBAC</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenReportModal();
                        setShowSolutionsMenu(false);
                      }}
                      className="w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-medium text-blue-100/80 hover:text-white hover:bg-white/10 flex items-center space-x-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Exportar Relatório PDF</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Bottom Section: Administração, Feedback, Ajuda */}
          <div className="pt-4 border-t border-white/10 space-y-1">
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-blue-100/80 hover:text-white hover:bg-white/10 text-xs font-medium transition"
            >
              <Settings className="w-4 h-4 text-blue-300" />
              <span>Configurações de administração</span>
            </button>
            <button
              onClick={() => alert('Obrigado pelo feedback! Suas sugestões foram encaminhadas à equipe de produto AnecttaDESK.')}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-blue-100/80 hover:text-white hover:bg-white/10 text-xs font-medium transition"
            >
              <MessageCircle className="w-4 h-4 text-blue-300" />
              <span>Feedback</span>
            </button>
            <button
              onClick={onOpenAgentModal}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-blue-100/80 hover:text-white hover:bg-white/10 text-xs font-medium transition"
            >
              <HelpCircle className="w-4 h-4 text-blue-300" />
              <span>Ajuda / Agente</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN BODY CANVAS */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
