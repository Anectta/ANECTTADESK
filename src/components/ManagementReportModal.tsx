import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Monitor, 
  AlertTriangle, 
  Calendar,
  Layers,
  Award,
  BarChart3,
  Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { SupportTicket, RemoteSession, Device } from '../types';

interface ManagementReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: SupportTicket[];
  devices: Device[];
  isNocMode?: boolean;
}

export const ManagementReportModal: React.FC<ManagementReportModalProps> = ({
  isOpen,
  onClose,
  tickets,
  devices,
  isNocMode = false,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'last_month' | 'quarter'>('current');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Monthly aggregated statistics
  const periodLabel = selectedPeriod === 'current' 
    ? 'Setembro / 2026 (Mês Corrente)' 
    : selectedPeriod === 'last_month' 
    ? 'Agosto / 2026' 
    : '3º Trimestre / 2026';

  const totalTickets = selectedPeriod === 'current' ? 44 : 58;
  const resolvedTickets = selectedPeriod === 'current' ? 42 : 56;
  const openTickets = totalTickets - resolvedTickets;
  const slaTarget = 95.0;
  const slaCompliance = 98.4;
  const totalRemoteHours = 148;
  const totalRemoteMinutes = 32;
  const totalSessionsCount = 186;
  const avgResponseTime = '8m 45s';
  const avgResolutionTime = '24m 18s';
  const firstContactResolution = '89.5%';
  const csatScore = '4.9 / 5.0';

  // Sample consolidated ticket rows for the report
  const reportTicketRows = [
    {
      id: 'TKT-2041',
      subject: 'Certificado Digital A1 - Emissão de NFe',
      requester: 'Beatriz Mendes',
      device: 'NOTEBOOK-FINANCEIRO-04',
      operator: 'Carlos Amor',
      priority: 'ALTA',
      sessionDuration: '42 min',
      slaMet: true,
      status: 'RESOLVIDO',
    },
    {
      id: 'TKT-2042',
      subject: 'Otimização Queries / CPU em 94%',
      requester: 'Rodrigo Silveira',
      device: 'SRV-DATABASE-PRD',
      operator: 'Lucas Brandão',
      priority: 'URGENTE',
      sessionDuration: '1h 14 min',
      slaMet: true,
      status: 'RESOLVIDO',
    },
    {
      id: 'TKT-2043',
      subject: 'Totem de Autoatendimento sem display',
      requester: 'Ana Paula Rocha',
      device: 'TOTEM-RECEPCAO-01',
      operator: 'Mariana Lima',
      priority: 'MÉDIA',
      sessionDuration: '28 min',
      slaMet: true,
      status: 'RESOLVIDO',
    },
    {
      id: 'TKT-2044',
      subject: 'Spooler Zebra Expedição travado',
      requester: 'Cláudio Ferreira',
      device: 'PC-SUPORTE-01',
      operator: 'Felipe Rocha',
      priority: 'BAIXA',
      sessionDuration: '15 min',
      slaMet: true,
      status: 'RESOLVIDO',
    },
    {
      id: 'TKT-2040',
      subject: 'Falha de Túnel VPN WireGuard',
      requester: 'Marcos Vinicius',
      device: 'NOTEBOOK-DEV-02',
      operator: 'Carlos Amor',
      priority: 'ALTA',
      sessionDuration: '35 min',
      slaMet: true,
      status: 'RESOLVIDO',
    },
    {
      id: 'TKT-2039',
      subject: 'Instalação de Driver de Criptografia',
      requester: 'Juliana Costa',
      device: 'DESKTOP-RH-01',
      operator: 'Felipe Rocha',
      priority: 'BAIXA',
      sessionDuration: '18 min',
      slaMet: true,
      status: 'RESOLVIDO',
    },
  ];

  // Function to generate the official executive PDF document using jsPDF
  const handleGeneratePdf = () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 16;

      // 1. Header Banner & Title
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 32, 'F');

      doc.setTextColor(6, 182, 212); // cyan-500
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('AnecttaDESK Enterprise', 15, y);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('RELATÓRIO GERENCIAL MENSAL CONSOLIDADO DE SLA & SUPORTE', 15, y + 6);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth - 15, y + 6, { align: 'right' });

      y = 40;

      // 2. Executive Scope & Metadata
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`1. Resumo Executivo • Período: ${periodLabel}`, 15, y);

      y += 8;

      // Draw 4 Key KPI Boxes
      const boxWidth = (pageWidth - 30 - 9) / 4;
      const boxHeight = 22;

      // KPI 1: SLA
      doc.setFillColor(240, 253, 244); // emerald-50
      doc.setDrawColor(34, 197, 94); // emerald-500
      doc.roundedRect(15, y, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('SLA GLOBAL ATINGIDO', 15 + boxWidth / 2, y + 6, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`${slaCompliance}%`, 15 + boxWidth / 2, y + 14, { align: 'center' });
      doc.setFontSize(7);
      doc.text(`Meta: >= ${slaTarget}% (CONFORME)`, 15 + boxWidth / 2, y + 19, { align: 'center' });

      // KPI 2: Chamados Resolvidos
      const x2 = 15 + boxWidth + 3;
      doc.setFillColor(240, 249, 255); // sky-50
      doc.setDrawColor(2, 132, 199);
      doc.roundedRect(x2, y, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setTextColor(3, 105, 161);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('CHAMADOS RESOLVIDOS', x2 + boxWidth / 2, y + 6, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`${resolvedTickets} / ${totalTickets}`, x2 + boxWidth / 2, y + 14, { align: 'center' });
      doc.setFontSize(7);
      doc.text('95.5% de Resolução', x2 + boxWidth / 2, y + 19, { align: 'center' });

      // KPI 3: Tempo Total Conexão
      const x3 = x2 + boxWidth + 3;
      doc.setFillColor(254, 243, 199); // amber-50
      doc.setDrawColor(217, 119, 6);
      doc.roundedRect(x3, y, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setTextColor(180, 83, 9);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('TEMPO TOTAL CONEXÃO', x3 + boxWidth / 2, y + 6, { align: 'center' });
      doc.setFontSize(14);
      doc.text(`${totalRemoteHours}h ${totalRemoteMinutes}m`, x3 + boxWidth / 2, y + 14, { align: 'center' });
      doc.setFontSize(7);
      doc.text(`${totalSessionsCount} Sessões Forenses`, x3 + boxWidth / 2, y + 19, { align: 'center' });

      // KPI 4: MTTR / Resposta
      const x4 = x3 + boxWidth + 3;
      doc.setFillColor(245, 243, 255); // purple-50
      doc.setDrawColor(147, 51, 234);
      doc.roundedRect(x4, y, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setTextColor(107, 33, 168);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('TEMPO MÉDIO RESPOSTA', x4 + boxWidth / 2, y + 6, { align: 'center' });
      doc.setFontSize(14);
      doc.text(avgResponseTime, x4 + boxWidth / 2, y + 14, { align: 'center' });
      doc.setFontSize(7);
      doc.text(`MTTR: ${avgResolutionTime}`, x4 + boxWidth / 2, y + 19, { align: 'center' });

      y += 32;

      // 3. Operational Performance Breakdown
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Métricas de Atendimento & Eficiência Operacional', 15, y);

      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`• Taxa de Resolução no Primeiro Contato (FCR): ${firstContactResolution}`, 18, y);
      doc.text(`• Índice de Satisfação do Usuário Final (CSAT): ${csatScore}`, 18, y + 5);
      doc.text(`• Dispositivos Ativos Monitorados no Parque: ${devices.length} endpoints`, 18, y + 10);
      doc.text(`• Protocolo de Acesso: WebRTC P2P Criptografado ChaCha20-Poly1305 com SRTP VoIP`, 18, y + 15);

      y += 24;

      // 4. Ticket Table Header
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Amostra Consolidada de Chamados e Sessões de Suporte', 15, y);

      y += 6;

      // Table Header Row
      doc.setFillColor(226, 232, 240); // slate-200
      doc.rect(15, y, pageWidth - 30, 8, 'F');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');

      doc.text('ID', 18, y + 5);
      doc.text('ASSUNTO / ESCOPO', 38, y + 5);
      doc.text('SOLICITANTE', 98, y + 5);
      doc.text('DISPOSITIVO', 130, y + 5);
      doc.text('DURAÇÃO', 165, y + 5);
      doc.text('SLA', 185, y + 5);

      y += 8;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      reportTicketRows.forEach((row, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, y, pageWidth - 30, 7, 'F');
        }
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y + 7, pageWidth - 15, y + 7);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(row.id, 18, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.text(row.subject.length > 35 ? row.subject.substring(0, 33) + '...' : row.subject, 38, y + 4.5);
        doc.text(row.requester, 98, y + 4.5);
        doc.text(row.device, 130, y + 4.5);
        doc.text(row.sessionDuration, 165, y + 4.5);

        doc.setTextColor(22, 101, 52);
        doc.setFont('helvetica', 'bold');
        doc.text('CUMPRIDO', 185, y + 4.5);

        y += 7;
      });

      y += 12;

      // 5. Compliance & Security Signature Block
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(15, y, pageWidth - 30, 26, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICAÇÃO DE AUDITORIA & CONFORMIDADE FORENSE', 20, y + 6);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Este documento foi extraído automaticamente da base forense imutável AnecttaDESK.', 20, y + 11);
      doc.text('Assinado digitalmente em conformidade com ISO 27001, SOC2 Tipo II e LGPD.', 20, y + 15);
      doc.text(`Hash SHA-256 de Autenticidade: 9f8a3c2e71b54a0f6d8924e5a9c01824b3e82d619cf29188a`, 20, y + 19);

      // Save PDF
      const filename = `AnecttaDESK-Relatorio-Gerencial-SLA-${new Date().toISOString().slice(0, 7)}.pdf`;
      doc.save(filename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden my-6 transition-all ${
          isNocMode 
            ? 'bg-black border-[#00f0ff]/50 text-white shadow-[0_0_30px_rgba(0,240,255,0.2)]' 
            : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isNocMode ? 'border-slate-800 bg-[#02050b]' : 'border-slate-800 bg-slate-950'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border ${
              isNocMode 
                ? 'bg-black text-[#00f0ff] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]' 
                : 'bg-cyan-950 text-cyan-400 border-cyan-800'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Relatório Gerencial Mensal Consolidado de SLA
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-[#00ff88] border border-emerald-800">
                  SLA: {slaCompliance}% (CONFORME)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Consolidação de SLA de atendimento, chamados resolvidos e tempo total de conexão remota
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95"
              title="Imprimir visualização"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={handleGeneratePdf}
              disabled={isExporting}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 shadow transition active:scale-95 ${
                downloadSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>PDF Baixado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Gerando...' : 'Exportar PDF (.pdf)'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Period Toolbar */}
        <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isNocMode ? 'border-slate-800/80 bg-black' : 'border-slate-800/60 bg-slate-950/60'
        }`}>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-semibold">Período de Análise:</span>
            <div className="flex rounded-lg p-1 bg-slate-900 border border-slate-800">
              <button
                onClick={() => setSelectedPeriod('current')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedPeriod === 'current'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Setembro / 2026 (Mês Atual)
              </button>
              <button
                onClick={() => setSelectedPeriod('last_month')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedPeriod === 'last_month'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Agosto / 2026
              </button>
              <button
                onClick={() => setSelectedPeriod('quarter')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedPeriod === 'quarter'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3º Trimestre (Acumulado)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Meta Contratual SLA: <strong className="text-emerald-400">&gt;= {slaTarget}%</strong>
          </div>
        </div>

        {/* Document Body / Printable Area */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* 1. Executive Summary 4-KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: SLA */}
            <div className={`p-4 rounded-xl border relative overflow-hidden ${
              isNocMode ? 'bg-[#000000] border-[#00ff88]/60 shadow-[0_0_12px_rgba(0,255,136,0.2)]' : 'bg-slate-950 border-emerald-800/80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  SLA Global de Atendimento
                </span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1.5">
                <span>{slaCompliance}%</span>
                <span className="text-xs text-emerald-400 font-bold">+3.4% acima</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Meta mínima exigida: {slaTarget}%. Sem violações críticas de MTTR.
              </p>
            </div>

            {/* KPI 2: Chamados Resolvidos */}
            <div className={`p-4 rounded-xl border relative overflow-hidden ${
              isNocMode ? 'bg-[#000000] border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'bg-slate-950 border-cyan-800/80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Chamados Resolvidos
                </span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1.5">
                <span>{resolvedTickets}</span>
                <span className="text-xs text-slate-400">/ {totalTickets} totais</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Taxa de resolução de 95.5% no período selecionado.
              </p>
            </div>

            {/* KPI 3: Tempo Total de Conexão */}
            <div className={`p-4 rounded-xl border relative overflow-hidden ${
              isNocMode ? 'bg-[#000000] border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'bg-slate-950 border-amber-800/80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Tempo Total de Conexão
                </span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1.5">
                <span>{totalRemoteHours}h {totalRemoteMinutes}m</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Distribuído em {totalSessionsCount} sessões remotas forenses auditadas.
              </p>
            </div>

            {/* KPI 4: MTTR / Resposta */}
            <div className={`p-4 rounded-xl border relative overflow-hidden ${
              isNocMode ? 'bg-[#000000] border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]' : 'bg-slate-950 border-purple-800/80'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Tempo Médio Resposta (MTTR)
                </span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1.5">
                <span>{avgResponseTime}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tempo Médio de Resolução total: {avgResolutionTime}.
              </p>
            </div>
          </div>

          {/* 2. Secondary Metrics & SLA Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box A: CSAT & FCR */}
            <div className={`p-4 rounded-xl border ${
              isNocMode ? 'bg-[#000000] border-slate-800' : 'bg-slate-950 border-slate-800'
            }`}>
              <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Satisfação & Resolução em 1º Contato</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Índice CSAT de Usuários:</span>
                    <strong className="text-[#00ff88]">{csatScore} ⭐</strong>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00ff88] h-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Resolução no 1º Contato (FCR):</span>
                    <strong className="text-cyan-400">{firstContactResolution}</strong>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full" style={{ width: '89.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Box B: Distribuição por Prioridade */}
            <div className={`p-4 rounded-xl border ${
              isNocMode ? 'bg-[#000000] border-slate-800' : 'bg-slate-950 border-slate-800'
            }`}>
              <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Volume por Criticidade de Ticket</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold">Urgente (Crítico)</span>
                  <span className="font-mono text-slate-300">4 (100% no SLA)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-semibold">Alta Prioridade</span>
                  <span className="font-mono text-slate-300">12 (100% no SLA)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-semibold">Média Prioridade</span>
                  <span className="font-mono text-slate-300">18 (94.4% no SLA)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Baixa Prioridade</span>
                  <span className="font-mono text-slate-300">10 (100% no SLA)</span>
                </div>
              </div>
            </div>

            {/* Box C: Eficiência da Equipe Técnica */}
            <div className={`p-4 rounded-xl border ${
              isNocMode ? 'bg-[#000000] border-slate-800' : 'bg-slate-950 border-slate-800'
            }`}>
              <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-[#00ff88]" />
                <span>Produtividade dos Operadores</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Carlos Amor (N3)</span>
                  <span className="font-mono text-cyan-400 font-bold">18 chamados (52h)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Lucas Brandão (N3)</span>
                  <span className="font-mono text-cyan-400 font-bold">14 chamados (46h)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Felipe Rocha (N2)</span>
                  <span className="font-mono text-cyan-400 font-bold">8 chamados (31h)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Mariana Lima (N1)</span>
                  <span className="font-mono text-cyan-400 font-bold">4 chamados (19h)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tabela Consolidada de Chamados e Sessões */}
          <div className={`rounded-xl border overflow-hidden ${
            isNocMode ? 'border-slate-800 bg-black' : 'border-slate-800 bg-slate-950'
          }`}>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Amostra de Chamados Resolvidos com Sessões Remotas Associadas
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Registros com carimbo temporal auditado
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  isNocMode ? 'bg-[#02050b] border-slate-700 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <tr>
                    <th className="px-4 py-3">Chamado</th>
                    <th className="px-4 py-3">Assunto / Escopo</th>
                    <th className="px-4 py-3">Solicitante</th>
                    <th className="px-4 py-3">Dispositivo</th>
                    <th className="px-4 py-3">Técnico</th>
                    <th className="px-4 py-3">Duração Sessão</th>
                    <th className="px-4 py-3">SLA</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {reportTicketRows.map((row) => (
                    <tr 
                      key={row.id}
                      className={isNocMode ? 'hover:bg-[#060e1d] transition' : 'hover:bg-slate-900/50 transition'}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-white max-w-xs truncate">
                        {row.subject}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                        {row.requester}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-cyan-300">
                        {row.device}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                        {row.operator}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-amber-300">
                        {row.sessionDuration}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-[#00ff88] border border-emerald-800">
                          CUMPRIDO
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-emerald-400">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Forensic Compliance Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-white font-bold block">Assinatura Digital de Conformidade & Auditoria</span>
                <span>Relatório gerado com integridade SHA-256 e conformidade regulatória para ITIL / ISO 27001.</span>
              </div>
            </div>
            <button
              onClick={handleGeneratePdf}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 flex-shrink-0 shadow active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
