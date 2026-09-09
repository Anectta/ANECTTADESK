import React, { useState } from 'react';
import { FolderTree, Plus, MoreVertical, Monitor, Edit2, Trash2, Check, X } from 'lucide-react';
import { DeviceGroup, Device } from '../types';

interface GroupManagerProps {
  groups: DeviceGroup[];
  devices: Device[];
  onSelectGroup: (groupName: string) => void;
  onCreateGroup: (name: string, description: string) => void;
}

export const GroupManager: React.FC<GroupManagerProps> = ({
  groups,
  devices,
  onSelectGroup,
  onCreateGroup,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onCreateGroup(newGroupName.trim(), newGroupDesc.trim());
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
            <FolderTree className="w-5 h-5 text-cyan-400" />
            <span>Grupos de Dispositivos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize computadores por clientes, filiais, setores ou ambientes
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow shadow-cyan-950 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Grupo</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          const groupDevices = devices.filter((d) => d.groupName === group.name);
          const onlineInGroup = groupDevices.filter((d) => d.status === 'online').length;

          return (
            <div
              key={group.id}
              className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-white">{group.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 border border-cyan-800 text-cyan-300">
                    {groupDevices.length} PCs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {group.description || 'Sem descrição cadastrada'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{onlineInGroup} online</span>
                </div>
                <button
                  onClick={() => onSelectGroup(group.name)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Filtrar Dispositivos
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Criar Grupo */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl text-slate-100 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1">Criar Novo Grupo</h3>
            <p className="text-xs text-slate-400 mb-4">
              Defina um nome para agrupar computadores na sua organização
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Filial Rio de Janeiro"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descrição
                </label>
                <textarea
                  placeholder="Finalidade do grupo..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none h-20 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow"
                >
                  Criar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
