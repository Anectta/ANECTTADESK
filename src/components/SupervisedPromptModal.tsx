import React from 'react';
import { ShieldCheck, User, Building, HelpCircle, Check, X, AlertTriangle } from 'lucide-react';
import { Device } from '../types';

interface SupervisedPromptModalProps {
  device: Device;
  operatorName: string;
  organizationName: string;
  reason: string;
  onAccept: () => void;
  onReject: () => void;
}

export const SupervisedPromptModal: React.FC<SupervisedPromptModalProps> = ({
  device,
  operatorName,
  organizationName,
  reason,
  onAccept,
  onReject,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-100 relative overflow-hidden">
        {/* Top glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600" />

        {/* Header with AnecttaDESK Shield */}
        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-700/80 flex items-center justify-center text-cyan-400 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              AnecttaDESK Remote Engine
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              SOLICITAÇÃO DE ACESSO
            </h2>
          </div>
        </div>

        {/* Warning notification */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            Um operador autorizado está solicitando permissão para visualizar e controlar este computador em tempo real.
          </p>
        </div>

        {/* Structured Credentials details */}
        <div className="space-y-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs">
          <div className="flex items-start space-x-3">
            <User className="w-4 h-4 text-cyan-400 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Operador:</div>
              <div className="text-sm font-bold text-white">{operatorName}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Building className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Organização:</div>
              <div className="text-sm font-semibold text-slate-200">{organizationName}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <HelpCircle className="w-4 h-4 text-amber-400 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Motivo:</div>
              <div className="text-xs font-medium text-slate-300">{reason}</div>
            </div>
          </div>
        </div>

        {/* Information badge */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 my-5 px-1">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Você poderá encerrar a sessão a qualquer momento através do ícone do AnecttaDESK na barra de tarefas.</span>
        </div>

        {/* Actions: [ ACEITAR ] [ RECUSAR ] */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={onReject}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition active:scale-95 shadow"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>RECUSAR</span>
          </button>

          <button
            onClick={onAccept}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-950/60 transition active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>ACEITAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
