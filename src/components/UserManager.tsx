import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  KeyRound, 
  Terminal, 
  FolderSync, 
  Monitor, 
  Power, 
  FileText, 
  UserCheck, 
  HelpCircle,
  Clock,
  Mail,
  Phone,
  Layers,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Operator, OperatorRole, RolePermissions, DeviceGroup } from '../types';
import { DEFAULT_ROLE_PERMISSIONS } from '../data/mockData';

interface UserManagerProps {
  operators: Operator[];
  groups: DeviceGroup[];
  onAddOperator: (operator: Operator) => void;
  onUpdateOperator: (operator: Operator) => void;
  onDeleteOperator: (id: string) => void;
  currentUserId?: string;
}

const ROLE_LABELS: Record<OperatorRole, { label: string; desc: string; color: string; bg: string; border: string }> = {
  admin: {
    label: 'Administrador Global',
    desc: 'Acesso irrestrito a todos os endpoints, configurações e gestão de operadores.',
    color: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-800/80',
  },
  tech_n3: {
    label: 'Técnico Sênior (N3)',
    desc: 'Controle remoto total, terminal elevado, tarefas e Wake-on-LAN. Sem gestão de equipe.',
    color: 'text-blue-400',
    bg: 'bg-blue-950/60',
    border: 'border-blue-800/80',
  },
  tech_n2: {
    label: 'Suporte Técnico (N2)',
    desc: 'Acesso remoto, transferência de arquivos, processos e reboot. Sem terminal elevado.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-800/80',
  },
  tech_n1: {
    label: 'Helpdesk (N1)',
    desc: 'Apenas controle e assistência remota supervisionada. Sem acesso a arquivos ou terminal.',
    color: 'text-amber-400',
    bg: 'bg-amber-950/60',
    border: 'border-amber-800/80',
  },
  auditor: {
    label: 'Auditor Forense',
    desc: 'Apenas leitura de logs de auditoria, gravações de sessões e relatórios de compliance.',
    color: 'text-slate-400',
    bg: 'bg-slate-800/60',
    border: 'border-slate-700',
  },
};

const PERMISSION_DEFINITIONS: { key: keyof RolePermissions; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'canRemoteControl', label: 'Controle Remoto de Tela', icon: Monitor },
  { key: 'canFileTransfer', label: 'Transferência de Arquivos', icon: FolderSync },
  { key: 'canExecuteTerminal', label: 'Terminal PowerShell / Bash', icon: Terminal },
  { key: 'canManageProcesses', label: 'Gerenciador de Processos (Kill)', icon: Layers },
  { key: 'canTriggerReboot', label: 'Reinicialização Remota', icon: Power },
  { key: 'canTriggerWol', label: 'Wake-on-LAN (Ligar Remoto)', icon: Power },
  { key: 'canRecordSession', label: 'Gravação Forense de Sessão', icon: FileText },
  { key: 'canViewAuditLogs', label: 'Visualização de Auditoria', icon: ShieldCheck },
  { key: 'canConfigureEndpoints', label: 'Configuração de Agentes', icon: Edit3 },
  { key: 'canManageTeam', label: 'Gestão de Usuários & RBAC', icon: Users },
];

export const UserManager: React.FC<UserManagerProps> = ({
  operators,
  groups,
  onAddOperator,
  onUpdateOperator,
  onDeleteOperator,
  currentUserId = 'usr-1',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRbacModal, setShowRbacModal] = useState(false);
  const [operatorToEdit, setOperatorToEdit] = useState<Operator | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(null);

  // Form State for Create/Edit Modal
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<OperatorRole>('tech_n2');
  const [formMfa, setFormMfa] = useState(true);
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active');
  const [formAllGroups, setFormAllGroups] = useState(true);
  const [formSelectedGroups, setFormSelectedGroups] = useState<string[]>([]);

  // Filtered operators
  const filteredOperators = operators.filter((op) => {
    const matchesSearch = 
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalActive = operators.filter((o) => o.status === 'active').length;
  const totalMfa = operators.filter((o) => o.mfaEnabled).length;
  const mfaPercentage = Math.round((totalMfa / (operators.length || 1)) * 100);

  const handleOpenCreate = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('tech_n2');
    setFormMfa(true);
    setFormStatus('active');
    setFormAllGroups(true);
    setFormSelectedGroups([]);
    setIsCreatingNew(true);
  };

  const handleOpenEdit = (op: Operator) => {
    setOperatorToEdit(op);
    setFormName(op.name);
    setFormEmail(op.email);
    setFormPhone(op.phone || '');
    setFormRole(op.role);
    setFormMfa(op.mfaEnabled);
    setFormStatus(op.status === 'invited' ? 'active' : op.status);
    const hasAll = op.allowedGroups.includes('*');
    setFormAllGroups(hasAll);
    setFormSelectedGroups(hasAll ? [] : op.allowedGroups);
    setActiveMenuId(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const allowed = formAllGroups ? ['*'] : (formSelectedGroups.length > 0 ? formSelectedGroups : ['*']);

    if (isCreatingNew) {
      const newOp: Operator = {
        id: `usr-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim() || undefined,
        role: formRole,
        status: formStatus,
        mfaEnabled: formMfa,
        allowedGroups: allowed,
        lastActive: 'Nunca acessou',
        createdDate: new Date().toISOString().split('T')[0],
      };
      onAddOperator(newOp);
      setIsCreatingNew(false);
    } else if (operatorToEdit) {
      const updated: Operator = {
        ...operatorToEdit,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim() || undefined,
        role: formRole,
        status: formStatus,
        mfaEnabled: formMfa,
        allowedGroups: allowed,
      };
      onUpdateOperator(updated);
      setOperatorToEdit(null);
    }
  };

  const handleToggleStatus = (op: Operator) => {
    const nextStatus = op.status === 'active' ? 'suspended' : 'active';
    onUpdateOperator({ ...op, status: nextStatus });
    setActiveMenuId(null);
  };

  const handleToggleMfa = (op: Operator) => {
    onUpdateOperator({ ...op, mfaEnabled: !op.mfaEnabled });
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Operadores</span>
            <div className="text-2xl font-black text-white mt-1">{operators.length}</div>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
              <UserCheck className="w-3 h-3" />
              <span>{totalActive} ativos na organização</span>
            </span>
          </div>
          <div className="p-3 bg-cyan-950/60 border border-cyan-800/60 rounded-xl text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Adesão 2FA / TOTP</span>
            <div className="text-2xl font-black text-white mt-1">{mfaPercentage}%</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              {totalMfa} de {operators.length} com segundo fator
            </span>
          </div>
          <div className={`p-3 rounded-xl border ${mfaPercentage >= 80 ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400' : 'bg-amber-950/60 border-amber-800/60 text-amber-400'}`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Perfis & Papéis</span>
            <div className="text-2xl font-black text-purple-400 mt-1">5 Níveis</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              Admin, N3, N2, N1 e Auditor
            </span>
          </div>
          <div className="p-3 bg-purple-950/60 border border-purple-800/60 rounded-xl text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grupos Vinculados</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">{groups.length} Grupos</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              Políticas de escopo por departamento
            </span>
          </div>
          <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Action Buttons */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar operador por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowRbacModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-2 transition active:scale-95 shadow-sm"
              title="Visualizar a matriz detalhada de permissões RBAC"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Matriz de Permissões RBAC</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition active:scale-95 shadow-md shadow-cyan-950/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Operador</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 flex items-center space-x-1 font-medium mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filtros:</span>
          </span>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todos os Papéis</option>
            <option value="admin">Administrador Global</option>
            <option value="tech_n3">Técnico Sênior (N3)</option>
            <option value="tech_n2">Suporte Técnico (N2)</option>
            <option value="tech_n1">Helpdesk (N1)</option>
            <option value="auditor">Auditor Forense</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Apenas Ativos</option>
            <option value="suspended">Apenas Suspensos</option>
          </select>

          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold ml-2 underline"
            >
              Limpar filtros
            </button>
          )}

          <div className="ml-auto text-slate-400 text-xs">
            Mostrando <strong className="text-white">{filteredOperators.length}</strong> de {operators.length} operadores
          </div>
        </div>
      </div>

      {/* Operators List Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Operador</th>
                <th className="py-3.5 px-4">Papel & Nível RBAC</th>
                <th className="py-3.5 px-4">Segurança 2FA</th>
                <th className="py-3.5 px-4">Escopo de Acesso</th>
                <th className="py-3.5 px-4">Última Atividade</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOperators.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="text-sm font-semibold text-slate-400">Nenhum operador encontrado com os filtros atuais.</p>
                  </td>
                </tr>
              ) : (
                filteredOperators.map((op) => {
                  const roleMeta = ROLE_LABELS[op.role];
                  const initials = op.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  const isCurrent = op.id === currentUserId;

                  return (
                    <tr key={op.id} className="hover:bg-slate-800/40 transition">
                      {/* Operator Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                            op.status === 'active' 
                              ? 'bg-gradient-to-br from-cyan-900 to-slate-900 border-cyan-700 text-cyan-200' 
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}>
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{op.name}</span>
                              {isCurrent && (
                                <span className="bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                                  Você
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] flex items-center space-x-2 mt-0.5">
                              <span className="flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{op.email}</span>
                              </span>
                              {op.phone && (
                                <span className="flex items-center space-x-1 text-slate-500">
                                  <span>•</span>
                                  <span>{op.phone}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Level */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${roleMeta.bg} ${roleMeta.color} ${roleMeta.border}`}>
                          <Shield className="w-3 h-3" />
                          <span>{roleMeta.label}</span>
                        </span>
                      </td>

                      {/* 2FA Status */}
                      <td className="py-3.5 px-4">
                        {op.mfaEnabled ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 border border-emerald-800 text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>TOTP Ativo</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/70 border border-amber-800 text-amber-400">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>Pendente</span>
                          </span>
                        )}
                      </td>

                      {/* Allowed Groups Scope */}
                      <td className="py-3.5 px-4">
                        {op.allowedGroups.includes('*') ? (
                          <span className="inline-flex items-center space-x-1 text-xs text-cyan-300 font-semibold">
                            <span>Acesso Global</span>
                            <span className="text-[10px] text-cyan-500 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                              Todos ({groups.length})
                            </span>
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {op.allowedGroups.map((grpName, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-medium"
                              >
                                {grpName}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{op.lastActive}</span>
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4">
                        {op.status === 'active' ? (
                          <span className="inline-flex items-center space-x-1.5 text-emerald-400 font-semibold text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Ativo</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1.5 text-rose-400 font-semibold text-xs">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>Suspenso</span>
                          </span>
                        )}
                      </td>

                      {/* Actions Menu */}
                      <td className="py-3.5 px-4 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === op.id ? null : op.id)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === op.id && (
                            <div className="absolute right-4 top-10 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-30 text-xs">
                              <button
                                onClick={() => handleOpenEdit(op)}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 flex items-center space-x-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Editar Operador</span>
                              </button>

                              <button
                                onClick={() => handleToggleMfa(op)}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 flex items-center space-x-2"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                                <span>{op.mfaEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}</span>
                              </button>

                              <button
                                onClick={() => handleToggleStatus(op)}
                                className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 flex items-center space-x-2"
                              >
                                {op.status === 'active' ? (
                                  <>
                                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                                    <span className="text-rose-400">Suspender Conta</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Reativar Conta</span>
                                  </>
                                )}
                              </button>

                              {!isCurrent && (
                                <>
                                  <div className="border-t border-slate-800 my-1" />
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setOperatorToDelete(op);
                                    }}
                                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-rose-400 flex items-center space-x-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Remover da Equipe</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-950/80 px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Políticas de RBAC aplicadas a nível de autorização de sinalização WebRTC.</span>
          </div>
          <span>AnecttaDESK Identity Provider v1.4.2</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: CRIAR / EDITAR OPERADOR */}
      {/* ============================================================ */}
      {(isCreatingNew || operatorToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isCreatingNew ? 'Convidar Novo Operador' : `Editar Operador: ${operatorToEdit?.name}`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina credenciais, papel no RBAC e grupos autorizados para acesso remoto.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setOperatorToEdit(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Carlos Amor"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Ex: carlos@anectta.com.br"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Phone & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefone / Ramal
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+55 11 99999-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status da Conta
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'suspended')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="active">Ativo (Pode autenticar e conectar)</option>
                    <option value="suspended">Suspenso (Acesso revogado temporariamente)</option>
                  </select>
                </div>
              </div>

              {/* RBAC Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Papel de Acesso (RBAC) *
                </label>
                <div className="space-y-2">
                  {(Object.keys(ROLE_LABELS) as OperatorRole[]).map((rKey) => {
                    const rMeta = ROLE_LABELS[rKey];
                    const isSelected = formRole === rKey;

                    return (
                      <div
                        key={rKey}
                        onClick={() => setFormRole(rKey)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                          isSelected
                            ? `${rMeta.bg} ${rMeta.border} ring-1 ring-cyan-500/50`
                            : 'bg-slate-950/60 border-slate-800 hover:bg-slate-950'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          checked={isSelected}
                          onChange={() => setFormRole(rKey)}
                          className="mt-0.5 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold text-xs ${rMeta.color}`}>{rMeta.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            {rMeta.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Allowed Groups Scope */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Escopo de Dispositivos Autorizados</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formAllGroups}
                      onChange={(e) => setFormAllGroups(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="font-semibold text-cyan-300">Todos os Grupos (Acesso Global)</span>
                  </label>
                </div>

                {!formAllGroups && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <p className="text-[11px] text-slate-400">
                      Selecione os grupos departamentais que este operador poderá visualizar e controlar:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {groups.map((grp) => {
                        const checked = formSelectedGroups.includes(grp.name);
                        return (
                          <label
                            key={grp.id}
                            className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                              checked
                                ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormSelectedGroups([...formSelectedGroups, grp.name]);
                                } else {
                                  setFormSelectedGroups(formSelectedGroups.filter((g) => g !== grp.name));
                                }
                              }}
                              className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                            />
                            <span className="truncate">{grp.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* MFA Checkbox */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white">Exigir Autenticação Multifator (2FA)</div>
                    <div className="text-[11px] text-slate-400">
                      Obriga o técnico a escanear código QR TOTP antes de iniciar conexões remotas.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formMfa}
                  onChange={(e) => setFormMfa(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setOperatorToEdit(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 transition active:scale-95"
                >
                  {isCreatingNew ? 'Salvar e Convidar' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: MATRIZ DE PERMISSÕES RBAC */}
      {/* ============================================================ */}
      {showRbacModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Matriz de Permissões de Controle de Acesso (RBAC)</h3>
                  <p className="text-xs text-slate-400">
                    Mapeamento estrito de privilégios e permissões por perfil operacional no AnecttaDESK.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRbacModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Capacidade / Privilégio</th>
                    <th className="py-3 px-3 text-center text-purple-400 bg-purple-950/20">Admin</th>
                    <th className="py-3 px-3 text-center text-blue-400 bg-blue-950/20">Técnico N3</th>
                    <th className="py-3 px-3 text-center text-emerald-400 bg-emerald-950/20">Suporte N2</th>
                    <th className="py-3 px-3 text-center text-amber-400 bg-amber-950/20">Helpdesk N1</th>
                    <th className="py-3 px-3 text-center text-slate-400 bg-slate-950/40">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                  {PERMISSION_DEFINITIONS.map((perm) => {
                    const PermIcon = perm.icon;
                    const adminHas = DEFAULT_ROLE_PERMISSIONS.admin[perm.key];
                    const n3Has = DEFAULT_ROLE_PERMISSIONS.tech_n3[perm.key];
                    const n2Has = DEFAULT_ROLE_PERMISSIONS.tech_n2[perm.key];
                    const n1Has = DEFAULT_ROLE_PERMISSIONS.tech_n1[perm.key];
                    const auditorHas = DEFAULT_ROLE_PERMISSIONS.auditor[perm.key];

                    return (
                      <tr key={perm.key} className="hover:bg-slate-800/40 transition">
                        <td className="py-2.5 px-4 flex items-center space-x-2 text-white font-medium">
                          <PermIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{perm.label}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center bg-purple-950/10">
                          {adminHas ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-blue-950/10">
                          {n3Has ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-emerald-950/10">
                          {n2Has ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-amber-950/10">
                          {n1Has ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center bg-slate-950/30">
                          {auditorHas ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                As permissões são validadas de forma criptográfica no momento da troca de chaves Diffie-Hellman na sinalização WebRTC. Operadores sem o privilégio correspondente são barrados imediatamente a nível de protocolo pelo Agent no endpoint remoto.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRbacModal(false)}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
              >
                Fechar Matriz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CONFIRMAÇÃO DE EXCLUSÃO */}
      {/* ============================================================ */}
      {operatorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remover Operador</h3>
                <p className="text-xs text-slate-400">Esta ação revogará todo o acesso imediatamente.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Você tem certeza de que deseja remover <strong className="text-white">{operatorToDelete.name}</strong> ({operatorToDelete.email}) da equipe do AnecttaDESK?
            </p>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setOperatorToDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteOperator(operatorToDelete.id);
                  setOperatorToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
