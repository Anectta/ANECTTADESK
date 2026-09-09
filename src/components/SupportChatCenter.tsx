import React, { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  Send, 
  Monitor, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Hash, 
  Users, 
  Paperclip, 
  ArrowRight,
  Shield,
  Tag,
  Check,
  X,
  FileText
} from 'lucide-react';
import { SupportTicket, TechChatMessage, TicketPriority, TicketStatus, Device, Operator } from '../types';

interface SupportChatCenterProps {
  tickets: SupportTicket[];
  chatMessages: TechChatMessage[];
  devices: Device[];
  operators: Operator[];
  currentOperatorName: string;
  onConnectToTicketDevice: (anecttadeskId: string, deviceHostname: string) => void;
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus, assignedTo?: string) => void;
  onCreateTicket: (ticket: Partial<SupportTicket>) => void;
  onSendMessage: (channelId: 'general' | 'infrastructure' | 'n2_oncall', text: string, attachmentTicketId?: string) => void;
  onOpenReportModal?: () => void;
}

export const SupportChatCenter: React.FC<SupportChatCenterProps> = ({
  tickets,
  chatMessages,
  devices,
  operators,
  currentOperatorName,
  onConnectToTicketDevice,
  onUpdateTicketStatus,
  onCreateTicket,
  onSendMessage,
  onOpenReportModal,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'tickets' | 'chat'>('tickets');
  const [selectedChannel, setSelectedChannel] = useState<'general' | 'infrastructure' | 'n2_oncall'>('general');
  const [messageInput, setMessageInput] = useState('');
  
  // Ticket filters
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | TicketStatus>('open');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState<'all' | TicketPriority>('all');
  const [ticketSearch, setTicketSearch] = useState('');
  
  // Modal for new ticket
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    requesterName: '',
    requesterEmail: '',
    requesterDeviceHostname: '',
    anecttadeskId: '',
    subject: '',
    description: '',
    priority: 'medium' as TicketPriority,
  });

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.requesterName.trim()) return;

    onCreateTicket({
      requesterName: newTicketForm.requesterName,
      requesterEmail: newTicketForm.requesterEmail,
      requesterDeviceHostname: newTicketForm.requesterDeviceHostname || 'HOST-GENERIC',
      requesterDeviceId: 'dev-gen',
      anecttadeskId: newTicketForm.anecttadeskId || `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
      subject: newTicketForm.subject,
      description: newTicketForm.description,
      priority: newTicketForm.priority,
      status: 'open',
    });

    setShowNewTicketModal(false);
    setNewTicketForm({
      requesterName: '',
      requesterEmail: '',
      requesterDeviceHostname: '',
      anecttadeskId: '',
      subject: '',
      description: '',
      priority: 'medium',
    });
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    onSendMessage(selectedChannel, messageInput);
    setMessageInput('');
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
            URGENTE
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
            ALTA
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            MÉDIA
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            BAIXA
          </span>
        );
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800">
            Em Espera
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
            Em Atendimento
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            Resolvido
          </span>
        );
    }
  };

  const filteredTickets = tickets.filter((tkt) => {
    const matchesStatus = ticketStatusFilter === 'all' || tkt.status === ticketStatusFilter;
    const matchesPriority = ticketPriorityFilter === 'all' || tkt.priority === ticketPriorityFilter;
    const matchesSearch = 
      tkt.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      tkt.ticketNumber.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      tkt.requesterName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      tkt.requesterDeviceHostname.toLowerCase().includes(ticketSearch.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const channelMessages = chatMessages.filter((msg) => msg.channelId === selectedChannel);
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Helpdesk & Chat Técnico
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                SERVICE DESK N1/N2/N3
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Atendimento ágil a usuários finais com conexão remota em 1 clique e comunicação interna entre técnicos.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMainTab('tickets')}
              className={`px-3.5 py-1.5 rounded-md font-semibold flex items-center space-x-2 transition-colors ${
                activeMainTab === 'tickets'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Fila de Chamados</span>
              {openTicketsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                  {openTicketsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveMainTab('chat')}
              className={`px-3.5 py-1.5 rounded-md font-semibold flex items-center space-x-2 transition-colors ${
                activeMainTab === 'chat'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat da Equipe</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm active:scale-95"
              title="Exportar Relatório Mensal Consolidado de SLA em PDF"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Relatório SLA (PDF)</span>
            </button>
          )}

          {activeMainTab === 'tickets' && (
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md shadow-cyan-950"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Chamado</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: TICKETS / HELPDESK */}
      {activeMainTab === 'tickets' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setTicketStatusFilter('open')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    ticketStatusFilter === 'open' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Em Espera ({tickets.filter((t) => t.status === 'open').length})
                </button>
                <button
                  onClick={() => setTicketStatusFilter('in_progress')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    ticketStatusFilter === 'in_progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Em Atendimento ({tickets.filter((t) => t.status === 'in_progress').length})
                </button>
                <button
                  onClick={() => setTicketStatusFilter('resolved')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    ticketStatusFilter === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resolvidos ({tickets.filter((t) => t.status === 'resolved').length})
                </button>
                <button
                  onClick={() => setTicketStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    ticketStatusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({tickets.length})
                </button>
              </div>

              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setTicketPriorityFilter('all')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    ticketPriorityFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas Prioridades
                </button>
                <button
                  onClick={() => setTicketPriorityFilter('urgent')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    ticketPriorityFilter === 'urgent' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Urgentes
                </button>
                <button
                  onClick={() => setTicketPriorityFilter('high')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    ticketPriorityFilter === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Altas
                </button>
              </div>
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Pesquisar por assunto, solicitante ou ID..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-80" />
                <h3 className="text-base font-semibold text-white">Nenhum chamado pendente nesta visualização</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  A fila de suporte está zerada. Novos incidentes abertos pelos usuários aparecerão automaticamente aqui.
                </p>
              </div>
            ) : (
              filteredTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  className={`bg-slate-900 border rounded-xl p-4 transition-all hover:border-slate-700 ${
                    tkt.priority === 'urgent' && tkt.status !== 'resolved'
                      ? 'border-rose-900/50 bg-rose-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left details */}
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {tkt.ticketNumber}
                        </span>
                        {getPriorityBadge(tkt.priority)}
                        {getStatusBadge(tkt.status)}
                        <span className="text-xs font-semibold text-white">{tkt.subject}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {tkt.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                        <span>
                          Solicitante: <strong className="text-slate-200">{tkt.requesterName}</strong> ({tkt.requesterEmail})
                        </span>
                        <span>·</span>
                        <span>
                          Endpoint: <strong className="text-cyan-400 font-mono">{tkt.requesterDeviceHostname}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          AnecttaDESK ID: <strong className="text-purple-300 font-mono bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-900">{tkt.anecttadeskId}</strong>
                        </span>
                        <span>·</span>
                        <span>Aberto: {tkt.createdAt}</span>
                        {tkt.assignedOperatorName && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-400">
                              Atribuído a: <strong>{tkt.assignedOperatorName}</strong>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right action buttons */}
                    <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center">
                      <button
                        onClick={() => onConnectToTicketDevice(tkt.anecttadeskId, tkt.requesterDeviceHostname)}
                        className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-cyan-950 transition-all"
                        title="Conectar remotamente ao host do solicitante imediatamente"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Acessar Host Remoto</span>
                      </button>

                      {tkt.status === 'open' && (
                        <button
                          onClick={() => onUpdateTicketStatus(tkt.id, 'in_progress', currentOperatorName)}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Assumir</span>
                        </button>
                      )}

                      {tkt.status !== 'resolved' ? (
                        <button
                          onClick={() => onUpdateTicketStatus(tkt.id, 'resolved')}
                          className="px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Resolver</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateTicketStatus(tkt.id, 'open')}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold transition-colors"
                        >
                          Reabrir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: TECH TEAM CHAT */}
      {activeMainTab === 'chat' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[560px]">
          {/* Channels & Operators Sidebar */}
          <div className="bg-slate-950 border-r border-slate-800 p-4 space-y-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Canais de Operação</span>
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedChannel('general')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedChannel === 'general' ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Hash className="w-3.5 h-3.5" />
                    <span>geral</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                </button>

                <button
                  onClick={() => setSelectedChannel('infrastructure')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedChannel === 'infrastructure' ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Hash className="w-3.5 h-3.5" />
                    <span>infraestrutura</span>
                  </span>
                </button>

                <button
                  onClick={() => setSelectedChannel('n2_oncall')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedChannel === 'n2_oncall' ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Hash className="w-3.5 h-3.5" />
                    <span>plantao-n2</span>
                  </span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Operadores Online ({operators.filter((o) => o.status === 'active').length})
              </div>
              <div className="space-y-2">
                {operators.map((op) => (
                  <div key={op.id} className="flex items-center space-x-2 text-xs text-slate-300">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                        {op.name.charAt(0)}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
                    </div>
                    <div className="truncate">
                      <div className="font-semibold truncate">{op.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{op.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Messages and Input */}
          <div className="md:col-span-3 flex flex-col justify-between p-4 bg-slate-900">
            {/* Channel Top Title */}
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-white">{selectedChannel}</span>
                <span className="text-xs text-slate-500">
                  {selectedChannel === 'general' ? 'Discussões gerais de chamados e fila' : selectedChannel === 'infrastructure' ? 'Comunicação sobre servidores e redes' : 'Plantão de atendimento rápido N2'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">X25519 E2E Encrypted</span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 max-h-[420px]">
              {channelMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xs font-bold text-cyan-400">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({msg.senderRole})</span>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs text-slate-200 leading-relaxed">
                    {msg.message}

                    {msg.attachmentTicketId && (
                      <div className="mt-2.5 p-2 bg-slate-900 border border-cyan-500/30 rounded-md flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 text-slate-300">
                          <Tag className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Chamado Anexado: <strong>TKT-2041</strong> (Financeiro)</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveMainTab('tickets');
                            setTicketSearch('TKT-2041');
                          }}
                          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                        >
                          <span>Ver Fila</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessageSubmit} className="pt-3 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Enviar mensagem em #${selectedChannel}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for New Ticket */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Headphones className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Abrir Novo Chamado de Suporte</h3>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nome do Solicitante *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Silva"
                  value={newTicketForm.requesterName}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, requesterName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">E-mail Corporativo</label>
                  <input
                    type="email"
                    placeholder="usuario@anectta.com.br"
                    value={newTicketForm.requesterEmail}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, requesterEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">AnecttaDESK ID do Solicitante</label>
                  <input
                    type="text"
                    placeholder="Ex: 819-204-512"
                    value={newTicketForm.anecttadeskId}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, anecttadeskId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Hostname da Máquina</label>
                  <input
                    type="text"
                    placeholder="Ex: NOTEBOOK-VENDAS-02"
                    value={newTicketForm.requesterDeviceHostname}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, requesterDeviceHostname: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prioridade</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as TicketPriority })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente (Bloqueante)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assunto do Chamado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Falha ao acessar VPN corporativa"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição do Problema</label>
                <textarea
                  rows={3}
                  placeholder="Descreva detalhes, mensagens de erro ou sintomas..."
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Cadastrar Chamado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
