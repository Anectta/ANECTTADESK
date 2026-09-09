import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Code2, 
  Search, 
  Filter, 
  Plus, 
  Copy, 
  Check, 
  X, 
  ChevronRight, 
  Monitor, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  FileText, 
  History, 
  Trash2, 
  Edit3,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  AutomationScript, 
  ScriptCategory, 
  ScriptExecutionJob, 
  ScriptExecutionResult, 
  Device, 
  DeviceGroup 
} from '../types';

interface AutomationManagerProps {
  scripts: AutomationScript[];
  executionJobs: ScriptExecutionJob[];
  devices: Device[];
  groups: DeviceGroup[];
  onExecuteScript: (script: AutomationScript, targetDeviceIds: string[]) => void;
  onCreateScript: (newScript: AutomationScript) => void;
  onDeleteScript: (id: string) => void;
}

const CATEGORY_LABELS: Record<ScriptCategory, { label: string; color: string; bg: string; border: string }> = {
  maintenance: {
    label: 'Manutenção',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-800/80',
  },
  network: {
    label: 'Rede & DNS',
    color: 'text-blue-400',
    bg: 'bg-blue-950/60',
    border: 'border-blue-800/80',
  },
  diagnostic: {
    label: 'Diagnóstico & Saúde',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-800/80',
  },
  security: {
    label: 'Segurança & Agente',
    color: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-800/80',
  },
  custom: {
    label: 'Personalizado',
    color: 'text-amber-400',
    bg: 'bg-amber-950/60',
    border: 'border-amber-800/80',
  },
};

export const AutomationManager: React.FC<AutomationManagerProps> = ({
  scripts,
  executionJobs,
  devices,
  groups,
  onExecuteScript,
  onCreateScript,
  onDeleteScript,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'history'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOs, setSelectedOs] = useState<string>('all');

  // Modal States
  const [scriptToViewCode, setScriptToViewCode] = useState<AutomationScript | null>(null);
  const [scriptToRun, setScriptToRun] = useState<AutomationScript | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Execution Modal Selection
  const [targetSelectionMode, setTargetSelectionMode] = useState<'single' | 'group' | 'all_online'>('group');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices.find(d => d.status === 'online')?.id || devices[0]?.id || '');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [selectedSpecificDeviceIds, setSelectedSpecificDeviceIds] = useState<string[]>([]);

  // Create Script Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<ScriptCategory>('maintenance');
  const [formInterpreter, setFormInterpreter] = useState<'powershell' | 'bash' | 'cmd'>('powershell');
  const [formTargetOs, setFormTargetOs] = useState<'windows' | 'linux' | 'macos' | 'all'>('windows');
  const [formContent, setFormContent] = useState('');
  const [formElevation, setFormElevation] = useState(true);
  const [formTimeout, setFormTimeout] = useState(30);

  // Filter scripts
  const filteredScripts = scripts.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesOs = selectedOs === 'all' || s.targetOs === selectedOs || s.targetOs === 'all';
    return matchesSearch && matchesCategory && matchesOs;
  });

  // Calculate totals
  const totalExecutions = scripts.reduce((acc, s) => acc + s.executionCount, 0);
  const onlineDevices = devices.filter((d) => d.status === 'online');

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOpenRun = (script: AutomationScript) => {
    setScriptToRun(script);
    setTargetSelectionMode('group');
    setSelectedGroupId(groups[0]?.id || '');
    setSelectedSpecificDeviceIds([]);
  };

  const handleConfirmExecution = () => {
    if (!scriptToRun) return;

    let targetIds: string[] = [];

    if (targetSelectionMode === 'single') {
      if (selectedDeviceId) targetIds = [selectedDeviceId];
    } else if (targetSelectionMode === 'group') {
      targetIds = devices
        .filter((d) => d.deviceGroupId === selectedGroupId && d.status === 'online')
        .map((d) => d.id);
    } else if (targetSelectionMode === 'all_online') {
      targetIds = onlineDevices.map((d) => d.id);
    }

    if (targetIds.length === 0) {
      alert('Nenhum dispositivo online disponível no alvo selecionado para executar o script.');
      return;
    }

    onExecuteScript(scriptToRun, targetIds);
    setScriptToRun(null);
    setActiveTab('history');
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    const newScript: AutomationScript = {
      id: `script-${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim(),
      category: formCategory,
      interpreter: formInterpreter,
      targetOs: formTargetOs,
      scriptContent: formContent.trim(),
      requiresElevation: formElevation,
      timeoutSeconds: Number(formTimeout) || 30,
      author: 'Carlos Amor (Técnico N3)',
      executionCount: 0,
      lastExecuted: 'Nunca executado',
    };

    onCreateScript(newScript);
    setShowCreateModal(false);
    // Reset Form
    setFormName('');
    setFormDesc('');
    setFormContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Biblioteca de Automação</span>
            <div className="text-2xl font-black text-white mt-1">{scripts.length} Scripts</div>
            <span className="text-[11px] text-cyan-400 font-medium flex items-center space-x-1 mt-0.5">
              <Code2 className="w-3 h-3" />
              <span>PowerShell, Bash & CMD</span>
            </span>
          </div>
          <div className="p-3 bg-cyan-950/60 border border-cyan-800/60 rounded-xl text-cyan-400">
            <Terminal className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Execuções em Lote</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{totalExecutions}</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              Tarefas autônomas sem abrir tela
            </span>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-400">
            <Play className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taxa de Sucesso</span>
            <div className="text-2xl font-black text-purple-400 mt-1">98.4%</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              Código de saída (Exit Code 0)
            </span>
          </div>
          <div className="p-3 bg-purple-950/60 border border-purple-800/60 rounded-xl text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Endpoints Prontos</span>
            <div className="text-2xl font-black text-cyan-300 mt-1">{onlineDevices.length} Online</div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              Capazes de receber jobs de sinalização
            </span>
          </div>
          <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-blue-400">
            <Monitor className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'library'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Biblioteca de Scripts ({scripts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'history'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico de Execuções ({executionJobs.length})</span>
          </button>
        </div>

        {activeTab === 'library' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition active:scale-95 shadow-md shadow-cyan-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Script</span>
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* ABA 1: BIBLIOTECA DE SCRIPTS */}
      {/* ============================================================ */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar rotina por nome, descrição ou comando..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Todas as Categorias</option>
                <option value="maintenance">Manutenção</option>
                <option value="network">Rede & DNS</option>
                <option value="diagnostic">Diagnóstico</option>
                <option value="security">Segurança</option>
                <option value="custom">Personalizado</option>
              </select>

              <select
                value={selectedOs}
                onChange={(e) => setSelectedOs(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Todos os SOs</option>
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
                <option value="macos">macOS</option>
              </select>
            </div>
          </div>

          {/* Grid of Scripts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScripts.map((s) => {
              const catMeta = CATEGORY_LABELS[s.category] || CATEGORY_LABELS.custom;

              return (
                <div
                  key={s.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Header: Category & Interpreter */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${catMeta.bg} ${catMeta.color} ${catMeta.border}`}>
                        {catMeta.label}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className="bg-slate-950 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                          {s.interpreter}
                        </span>
                        {s.requiresElevation && (
                          <span className="bg-rose-950/60 border border-rose-800/80 text-rose-400 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-0.5" title="Requer privilégios de Administrador / SYSTEM">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>Elevado</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Script Name & Description */}
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                        {s.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    {/* Code Snippet Box */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-400 overflow-hidden relative">
                      <div className="line-clamp-2 text-slate-300">
                        {s.scriptContent}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Executado {s.executionCount} vezes</span>
                      <span>Último: {s.lastExecuted || 'Nunca'}</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => setScriptToViewCode(s)}
                      className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Ver Código</span>
                    </button>

                    <button
                      onClick={() => handleOpenRun(s)}
                      className="flex-1 py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition active:scale-95 shadow-md shadow-cyan-950/40"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Executar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ABA 2: HISTÓRICO DE EXECUÇÕES EM LOTE */}
      {/* ============================================================ */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Histórico de Jobs de Automação Remota</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Registros de scripts executados em background sob o contexto de SYSTEM nos agentes remotos.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                Total de <strong>{executionJobs.length}</strong> jobs registrados
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {executionJobs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Nenhuma execução em lote registrada recentemente.
                </div>
              ) : (
                executionJobs.map((job) => {
                  const isSuccess = job.status === 'completed';
                  return (
                    <div key={job.id} className="p-4 hover:bg-slate-800/30 transition space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg border ${
                            isSuccess 
                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' 
                              : 'bg-amber-950/60 border-amber-800 text-amber-400'
                          }`}>
                            <Play className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                              <span>{job.scriptName}</span>
                              <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                                isSuccess ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Disparado por <strong className="text-slate-300">{job.triggeredBy}</strong> em {job.startedAt}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-xs text-slate-400 font-mono">
                          <div>Alvos: <strong className="text-white">{job.targetCount} endpoint(s)</strong></div>
                          <div className="text-[11px] text-slate-500">Concluído: {job.completedAt || 'Em andamento'}</div>
                        </div>
                      </div>

                      {/* Execution Output Cards for each target device */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {job.results.map((res, rIdx) => (
                          <div
                            key={rIdx}
                            className="bg-slate-950 rounded-lg p-3 border border-slate-800 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{res.deviceHostname}</span>
                              </span>
                              <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Exit Code: {res.exitCode} ({res.durationMs}ms)</span>
                              </span>
                            </div>
                            <pre className="bg-slate-900/90 p-2 rounded text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap border border-slate-800/80 max-h-24">
                              {res.output}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: VISUALIZAR CÓDIGO FONTE DO SCRIPT */}
      {/* ============================================================ */}
      {scriptToViewCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{scriptToViewCode.name}</h3>
                  <p className="text-xs text-slate-400">
                    Interpretador: {scriptToViewCode.interpreter.toUpperCase()} • Timeout: {scriptToViewCode.timeoutSeconds}s
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScriptToViewCode(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
                {scriptToViewCode.scriptContent}
              </pre>
              <button
                onClick={() => handleCopyCode(scriptToViewCode.scriptContent)}
                className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center space-x-1 transition"
                title="Copiar código"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Autor: {scriptToViewCode.author}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setScriptToViewCode(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    const s = scriptToViewCode;
                    setScriptToViewCode(null);
                    handleOpenRun(s);
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center space-x-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Executar Script</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: DISPARAR EXECUÇÃO EM LOTE / ONE-CLICK ACTION */}
      {/* ============================================================ */}
      {scriptToRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Disparar Execução de Script</h3>
                  <p className="text-xs text-slate-400">Rotina: {scriptToRun.name}</p>
                </div>
              </div>
              <button
                onClick={() => setScriptToRun(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Selection Mode */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Selecione os Alvos da Execução:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetSelectionMode('group')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    targetSelectionMode === 'group'
                      ? 'bg-cyan-950/60 border-cyan-700 text-white ring-1 ring-cyan-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 mb-2 text-cyan-400" />
                  <span className="font-bold text-xs">Por Grupo</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Todos no setor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetSelectionMode('single')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    targetSelectionMode === 'single'
                      ? 'bg-cyan-950/60 border-cyan-700 text-white ring-1 ring-cyan-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Monitor className="w-4 h-4 mb-2 text-blue-400" />
                  <span className="font-bold text-xs">Dispositivo Único</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">1 computador</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetSelectionMode('all_online')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    targetSelectionMode === 'all_online'
                      ? 'bg-cyan-950/60 border-cyan-700 text-white ring-1 ring-cyan-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Cpu className="w-4 h-4 mb-2 text-purple-400" />
                  <span className="font-bold text-xs">Todos Online</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{onlineDevices.length} máquinas</span>
                </button>
              </div>

              {/* Group Selector */}
              {targetSelectionMode === 'group' && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Escolha o Grupo Departamental:
                  </label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {groups.map((g) => {
                      const countOnline = devices.filter((d) => d.deviceGroupId === g.id && d.status === 'online').length;
                      return (
                        <option key={g.id} value={g.id}>
                          {g.name} ({countOnline} endpoints online de {g.deviceCount})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Single Device Selector */}
              {targetSelectionMode === 'single' && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Escolha a Estação Alvo:
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {devices.map((d) => (
                      <option key={d.id} value={d.id} disabled={d.status !== 'online'}>
                        {d.hostname} ({d.publicIp}) - {d.status === 'online' ? '🟢 ONLINE' : '🔴 OFFLINE'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* All Online Preview */}
              {targetSelectionMode === 'all_online' && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                  O script será transmitido simultaneamente via canal de dados WebRTC para todos os <strong>{onlineDevices.length} computadores conectados</strong> no momento.
                </div>
              )}
            </div>

            {/* Warning regarding execution context */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>O script rodará em segundo plano sem perturbar o usuário local ou abrir janelas visíveis de console.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setScriptToRun(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmExecution}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-cyan-950/50 active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Confirmar & Executar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CRIAR NOVO SCRIPT */}
      {/* ============================================================ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Adicionar Novo Script de Automação</h3>
                  <p className="text-xs text-slate-400">
                    Cadastre uma rotina de manutenção remota em lote no AnecttaDESK.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-3.5 text-xs">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Nome da Ação *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Limpeza de Cache do Chrome"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Categoria *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ScriptCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="maintenance">Manutenção</option>
                    <option value="network">Rede & DNS</option>
                    <option value="diagnostic">Diagnóstico</option>
                    <option value="security">Segurança</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Descrição</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Ex: Remove arquivos temporários de navegação para recuperar espaço."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Interpreter, OS & Timeout */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Interpretador</label>
                  <select
                    value={formInterpreter}
                    onChange={(e) => setFormInterpreter(e.target.value as 'powershell' | 'bash' | 'cmd')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="powershell">PowerShell</option>
                    <option value="bash">Bash (Linux/Mac)</option>
                    <option value="cmd">Windows CMD</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">SO Alvo</label>
                  <select
                    value={formTargetOs}
                    onChange={(e) => setFormTargetOs(e.target.value as 'windows' | 'linux' | 'macos' | 'all')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="windows">Windows</option>
                    <option value="linux">Linux</option>
                    <option value="macos">macOS</option>
                    <option value="all">Todos</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Timeout (s)</label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={formTimeout}
                    onChange={(e) => setFormTimeout(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Code Editor */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Código do Script *</label>
                <textarea
                  required
                  rows={7}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={`# Digite seu script PowerShell aqui\nWrite-Output "Olá mundo do AnecttaDESK"`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Elevation */}
              <label className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formElevation}
                  onChange={(e) => setFormElevation(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-300 font-medium">
                  Executar sob credenciais de Administrador Elevado (SYSTEM / root)
                </span>
              </label>

              {/* Submit */}
              <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-md shadow-cyan-950/50 active:scale-95"
                >
                  Salvar na Biblioteca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
