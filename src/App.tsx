import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ConnectCard } from './components/ConnectCard';
import { DashboardOverview } from './components/DashboardOverview';
import { DeviceList } from './components/DeviceList';
import { GroupManager } from './components/GroupManager';
import { SessionHistory } from './components/SessionHistory';
import { AuditView } from './components/AuditView';
import { DeviceInventoryModal } from './components/DeviceInventoryModal';
import { SupervisedPromptModal } from './components/SupervisedPromptModal';
import { RemoteSessionViewer } from './components/RemoteSessionViewer';
import { AgentDownloadModal } from './components/AgentDownloadModal';
import { SettingsModal } from './components/SettingsModal';
import { UserManager } from './components/UserManager';
import { AutomationManager } from './components/AutomationManager';
import { AlertsManager } from './components/AlertsManager';
import { SessionPlayerModal } from './components/SessionPlayerModal';
import { SupportChatCenter } from './components/SupportChatCenter';
import { ManagementReportModal } from './components/ManagementReportModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { DesktopClientLayout } from './components/DesktopClientLayout';
import { AnecttaRemoteSupport } from './components/AnecttaRemoteSupport';
import { 
  INITIAL_DEVICES, 
  INITIAL_GROUPS, 
  INITIAL_SESSIONS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_OPERATORS,
  INITIAL_SCRIPTS,
  INITIAL_EXECUTION_JOBS,
  INITIAL_ALERTS,
  INITIAL_RECORDINGS,
  INITIAL_TICKETS,
  INITIAL_CHAT_MESSAGES
} from './data/mockData';
import { 
  Device, 
  RemoteSession, 
  AuditLog, 
  DeviceGroup, 
  SystemSettings, 
  Operator, 
  AutomationScript, 
  ScriptExecutionJob,
  ScriptExecutionResult,
  SystemAlert,
  RecordedSession,
  SupportTicket,
  TechChatMessage,
  TicketStatus,
  AlertType
} from './types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';
import { deviceService } from './services/deviceService';
import { authService } from './services/authService';

export default function App() {
  const [currentTab, setCurrentTab] = useState('remote_support');
  const [localId] = useState('735 006 750');
  const [localPassword, setLocalPassword] = useState('fyxe91wa');

  const handleRegeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setLocalPassword(res);
    showAlert('Nova senha temporária gerada com sucesso!', 'success');
  };

  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [groups, setGroups] = useState<DeviceGroup[]>(INITIAL_GROUPS);
  const [sessions, setSessions] = useState<RemoteSession[]>(INITIAL_SESSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [scripts, setScripts] = useState<AutomationScript[]>(INITIAL_SCRIPTS);
  const [executionJobs, setExecutionJobs] = useState<ScriptExecutionJob[]>(INITIAL_EXECUTION_JOBS);

  // New features: Alerts, Session Recordings, Support Tickets & Tech Chat
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [recordings, setRecordings] = useState<RecordedSession[]>(INITIAL_RECORDINGS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [chatMessages, setChatMessages] = useState<TechChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [activePlayingRecording, setActivePlayingRecording] = useState<RecordedSession | null>(null);

  // Supabase Integration & Operator Session State
  const isSupabaseActive = isSupabaseConfigured();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string }>({
    name: 'Carlos Amor',
    email: 'carlosamorfbr@gmail.com',
  });

  // Carrega dispositivos e operador autenticado do Supabase caso configurado
  React.useEffect(() => {
    async function initSupabaseData() {
      if (isSupabaseActive) {
        const { devices: remoteDevices } = await deviceService.fetchDevices();
        if (remoteDevices && remoteDevices.length > 0) {
          setDevices(remoteDevices);
        }

        const operator = await authService.getCurrentOperator();
        if (operator) {
          setCurrentUser({
            name: operator.name,
            email: operator.email,
          });
        }
      }
    }

    initSupabaseData();

    // Inscreve-se nas atualizações em tempo real (Supabase Realtime)
    if (isSupabaseActive) {
      const subscription = deviceService.subscribeToChanges((updatedDevice) => {
        setDevices((prev) => {
          const index = prev.findIndex((d) => d.id === updatedDevice.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedDevice;
            return next;
          }
          return [updatedDevice, ...prev];
        });
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isSupabaseActive]);

  // System Theme State: Standard Dark vs. NOC High Contrast (OLED Void & Phosphor)
  const [themeMode, setThemeMode] = useState<'standard_dark' | 'noc_high_contrast'>(() => {
    const saved = localStorage.getItem('anecttadesk_theme');
    return saved === 'noc_high_contrast' || saved === 'standard_dark' ? saved : 'standard_dark';
  });

  // System Settings State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [deferredPwaPrompt, setDeferredPwaPrompt] = useState<any>(null);

  // Listen to PWA install availability
  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPwaPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleTriggerPwaInstall = async () => {
    if (deferredPwaPrompt) {
      deferredPwaPrompt.prompt();
      const choice = await deferredPwaPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showAlert('AnecttaDESK instalado com sucesso no seu Desktop!', 'success');
      }
      setDeferredPwaPrompt(null);
    }
  };
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    signalingUrl: 'wss://signaling.anecttadesk.local:443',
    stunServer: 'stun:stun1.anecttadesk.local:3478',
    relayCluster: 'sa-east-1-sp1',
    preferredCipher: 'ChaCha20-Poly1305',
    requireMfaForUnattended: true,
    sessionInactivityTimeoutMinutes: 15,
    autoRecordSessions: false,
    defaultVideoCodec: 'auto',
    maxFpsLimit: 60,
    themeMode: (localStorage.getItem('anecttadesk_theme') as any) || 'standard_dark',
    nocHighContrastLogs: true,
  });

  const handleToggleThemeMode = () => {
    const nextMode = themeMode === 'standard_dark' ? 'noc_high_contrast' : 'standard_dark';
    setThemeMode(nextMode);
    setSystemSettings((prev) => ({ ...prev, themeMode: nextMode }));
    localStorage.setItem('anecttadesk_theme', nextMode);
    showAlert(
      nextMode === 'noc_high_contrast'
        ? 'Modo NOC Alto Contraste ativado: Fundo OLED e contraste elevado para leitura em baixa luminosidade.'
        : 'Modo Dark Padrão ativado.',
      'success'
    );
  };

  // Active Modals & Session States
  const [activeSessionDevice, setActiveSessionDevice] = useState<Device | null>(null);
  const [sessionConnectionMode, setSessionConnectionMode] = useState<'direct_p2p' | 'relay'>('direct_p2p');
  const [supervisedPromptDevice, setSupervisedPromptDevice] = useState<Device | null>(null);
  const [inventoryDevice, setInventoryDevice] = useState<Device | null>(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [bannerAlert, setBannerAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const showAlert = (message: string, type: 'error' | 'success' = 'error') => {
    setBannerAlert({ message, type });
    setTimeout(() => setBannerAlert(null), 4000);
  };

  // Device Update Handler
  const handleUpdateDevice = (updated: Device) => {
    setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    showAlert(`Dispositivo ${updated.hostname} atualizado com sucesso!`, 'success');
  };

  // Wake-on-LAN Trigger Handler
  const handleTriggerWol = (macAddress: string, hostname: string) => {
    showAlert(`Magic Packet (WoL) transmitido para ${hostname} (${macAddress}) via sub-rede local!`, 'success');
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) => (d.hardwareSpec.macAddress === macAddress ? { ...d, status: 'online' } : d))
      );
      showAlert(`Dispositivo ${hostname} respondeu aos heartbeats e agora está ONLINE via Wake-on-LAN!`, 'success');
    }, 3500);
  };

  // Operators & RBAC Handlers
  const handleAddOperator = (newOp: Operator) => {
    setOperators((prev) => [newOp, ...prev]);
    showAlert(`Operador ${newOp.name} convidado com sucesso!`, 'success');
  };

  const handleUpdateOperator = (updated: Operator) => {
    setOperators((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    showAlert(`Operador ${updated.name} atualizado com sucesso!`, 'success');
  };

  const handleDeleteOperator = (id: string) => {
    setOperators((prev) => prev.filter((o) => o.id !== id));
    showAlert('Operador removido da organização com sucesso!', 'success');
  };

  // Automation & Scripts Handlers
  const handleExecuteScript = (script: AutomationScript, targetDeviceIds: string[]) => {
    const targetDevices = devices.filter((d) => targetDeviceIds.includes(d.id));

    const getSimulatedOutput = (scriptName: string, hostname: string) => {
      if (scriptName.includes('Spooler')) {
        return `[+] Host: ${hostname}\n[+] Serviço Spooler interrompido.\n[+] Fila em C:\\Windows\\System32\\spool\\PRINTERS limpa.\n[+] Serviço Spooler reiniciado: Status = Running.`;
      }
      if (scriptName.includes('DNS') || scriptName.includes('Winsock')) {
        return `[+] Host: ${hostname}\nSuccessfully flushed the DNS Resolver Cache.\nWinsock Catalog reset completed.\nTCP/IP stack reset. Conexão renovada.`;
      }
      if (scriptName.includes('Temporários') || scriptName.includes('TEMP')) {
        return `[+] Host: ${hostname}\n[*] Limpeza de %TEMP% executada com sucesso.\n[+] 380 MB liberados no disco C:.`;
      }
      if (scriptName.includes('Disco') || scriptName.includes('S.M.A.R.T.')) {
        return `[+] Host: ${hostname}\nDrive C: 242.6 GB Livres / 512 GB Total.\nDiscos Físicos: NVMe Samsung 980 Pro (Health: 100% Healthy).`;
      }
      if (scriptName.includes('Event Log')) {
        return `[+] Host: ${hostname}\nÚltimos eventos do sistema analisados. 0 falhas críticas ativas nos últimos 60 minutos.`;
      }
      if (scriptName.includes('Agent')) {
        return `[+] Host: ${hostname}\nAnecttaDESK Agent Service reiniciado com sucesso. Sockets WebRTC reconectados ao Signaling Server em 24ms.`;
      }
      return `[+] Host: ${hostname}\nScript "${scriptName}" concluído sem erros.\nExit Code: 0 (Operação finalizada com sucesso)`;
    };

    const newJob: ScriptExecutionJob = {
      id: `job-${Date.now()}`,
      scriptId: script.id,
      scriptName: script.name,
      triggeredBy: 'Carlos Amor (Técnico N3)',
      targetCount: targetDeviceIds.length,
      status: 'completed',
      startedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      completedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      results: targetDevices.map((d) => ({
        deviceId: d.id,
        deviceHostname: d.hostname,
        status: 'success',
        exitCode: 0,
        output: getSimulatedOutput(script.name, d.hostname),
        durationMs: Math.floor(Math.random() * 1800) + 1200,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      })),
    };

    setExecutionJobs((prev) => [newJob, ...prev]);

    setScripts((prev) =>
      prev.map((s) =>
        s.id === script.id
          ? {
              ...s,
              executionCount: s.executionCount + targetDeviceIds.length,
              lastExecuted: 'Agora mesmo',
            }
          : s
      )
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      organizationId: 'org-1',
      userId: 'usr-1',
      userName: 'Carlos Amor (Técnico N3)',
      deviceId: targetDeviceIds[0] || 'all',
      deviceHostname: targetDeviceIds.length === 1 ? targetDevices[0]?.hostname || 'Endpoint' : `${targetDeviceIds.length} Endpoints`,
      action: 'EXECUTE_AUTOMATION_SCRIPT',
      ipAddress: '177.136.241.80',
      status: 'SUCCESS',
      metadata: {
        scriptName: script.name,
        targetCount: targetDeviceIds.length,
        interpreter: script.interpreter,
        requiresElevation: script.requiresElevation,
      },
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showAlert(`Script "${script.name}" executado com sucesso em ${targetDeviceIds.length} endpoint(s)!`, 'success');
  };

  const handleCreateScript = (newScript: AutomationScript) => {
    setScripts((prev) => [newScript, ...prev]);
    showAlert(`Script "${newScript.name}" cadastrado na biblioteca de automação!`, 'success');
  };

  const handleDeleteScript = (id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id));
    showAlert('Script removido da biblioteca com sucesso.', 'success');
  };

  // ============================================================
  // HANDLERS: PROACTIVE HEALTH & MONITORING ALERTS
  // ============================================================
  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: true, isRead: true } : a))
    );
    showAlert('Incidente marcado como resolvido e registrado na telemetria.', 'success');
  };

  const handleMarkAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const handleMarkAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    showAlert('Todos os alertas foram marcados como lidos.', 'success');
  };

  const handleRunAlertDiagnostic = (deviceId: string, alertType: AlertType) => {
    const target = devices.find((d) => d.id === deviceId);
    const targetName = target ? target.hostname : deviceId;
    showAlert(`Rotina de auto-remediação / diagnóstico disparada em ${targetName} para o evento ${alertType}.`, 'success');
  };

  // ============================================================
  // HANDLERS: SUPPORT TICKETS & TECH TEAM CHAT
  // ============================================================
  const handleConnectToTicketDevice = (anecttadeskId: string, deviceHostname: string) => {
    const cleanTargetId = anecttadeskId.replace(/\s+/g, '');
    const found = devices.find(
      (d) =>
        d.anecttadeskId.replace(/\s+/g, '') === cleanTargetId ||
        d.hostname.toLowerCase() === deviceHostname.toLowerCase()
    );

    if (found) {
      handleInitiateConnection(found, 'supervised');
    } else {
      showAlert(`Dispositivo ${deviceHostname} (ID: ${anecttadeskId}) não encontrado ou indisponível.`, 'error');
    }
  };

  const handleUpdateTicketStatus = (ticketId: string, status: TicketStatus, assignedTo?: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              assignedOperatorName: assignedTo || t.assignedOperatorName,
              updatedAt: 'Agora mesmo',
            }
          : t
      )
    );
    showAlert(`Chamado ${ticketId} atualizado para status "${status.toUpperCase()}".`, 'success');
  };

  const handleCreateTicket = (newTicket: Partial<SupportTicket>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const created: SupportTicket = {
      id: `tck-${randomNum}`,
      ticketNumber: `TCK-${randomNum}`,
      subject: newTicket.subject || 'Chamado de Suporte Sem Assunto',
      description: newTicket.description || '',
      requesterName: newTicket.requesterName || 'Carlos Amor',
      requesterEmail: newTicket.requesterEmail || 'carlosamorfbr@gmail.com',
      requesterDeviceId: newTicket.requesterDeviceId || devices[0]?.id || 'dev-001',
      requesterDeviceHostname: newTicket.requesterDeviceHostname || devices[0]?.hostname || 'SRV-PROD-DB01',
      anecttadeskId: newTicket.anecttadeskId || devices[0]?.anecttadeskId || '123 456 789',
      priority: newTicket.priority || 'medium',
      status: 'open',
      assignedOperatorId: 'usr-1',
      assignedOperatorName: newTicket.assignedOperatorName || 'Carlos Amor',
      createdAt: 'Agora mesmo',
      updatedAt: 'Agora mesmo',
    };

    setTickets((prev) => [created, ...prev]);
    showAlert(`Chamado ${created.ticketNumber} criado e atribuído com sucesso!`, 'success');
  };

  const handleSendChatMessage = (
    channelId: 'general' | 'infrastructure' | 'n2_oncall',
    text: string,
    attachmentTicketId?: string
  ) => {
    const newMsg: TechChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: 'usr-1',
      senderName: 'Carlos Amor',
      senderRole: 'Técnico N3 • Org Admin',
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentTicketId,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  // Connect handler by device entity
  const handleInitiateConnection = (
    device: Device, 
    mode: 'supervised' | 'unattended' = 'supervised'
  ) => {
    // 1. Strict real status check: Cannot connect to offline or disabled machine
    if (device.status === 'offline') {
      showAlert(
        `Impossível conectar a ${device.hostname}: O computador remoto está OFFLINE e não responde aos heartbeats do Signaling Server.`,
        'error'
      );
      return;
    }

    if (device.status === 'maintenance' || device.status === 'disabled') {
      showAlert(
        `Impossível conectar a ${device.hostname}: O dispositivo está marcado como ${device.status.toUpperCase()} pela organização.`,
        'error'
      );
      return;
    }

    // 2. Supervised access: Display Remote Access Authorization Dialog
    if (mode === 'supervised') {
      setSupervisedPromptDevice(device);
      return;
    }

    // 3. Unattended access: Direct connection
    startActiveSession(device, 'direct_p2p', 'unattended');
  };

  // Connect handler by ID string (from ConnectCard)
  const handleConnectById = (
    remoteId: string, 
    mode: 'supervised' | 'unattended', 
    password?: string
  ) => {
    const cleanId = remoteId.replace(/\s+/g, '');
    const found = devices.find((d) => d.anecttadeskId.replace(/\s+/g, '') === cleanId);

    if (!found) {
      showAlert(
        `Dispositivo com ID ${remoteId} não encontrado no catálogo do Signaling Server ou não registrado nesta organização.`,
        'error'
      );
      return;
    }

    handleInitiateConnection(found, mode);
  };

  // Start the actual session
  const startActiveSession = (
    device: Device, 
    connMode: 'direct_p2p' | 'relay', 
    sessionType: 'supervised' | 'unattended'
  ) => {
    setSessionConnectionMode(connMode);
    setActiveSessionDevice(device);

    // Record in Audit Log
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').slice(0, 19);
    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      organizationId: device.organizationId,
      userId: 'usr-1',
      userName: 'Carlos Amor (Técnico N3)',
      deviceId: device.id,
      deviceHostname: device.hostname,
      action: 'SESSION_STARTED',
      ipAddress: '177.136.241.80',
      status: 'SUCCESS',
      metadata: {
        sessionType,
        connectionMode: connMode,
        encryption: 'TLS 1.3 + ChaCha20-Poly1305',
      },
      timestamp: timeStr,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    // Record session entry
    const newSession: RemoteSession = {
      id: `ses-${Date.now()}`,
      organizationId: device.organizationId,
      deviceId: device.id,
      deviceHostname: device.hostname,
      deviceAnecttadeskId: device.anecttadeskId,
      operatorId: 'usr-1',
      operatorName: 'Carlos Amor (Técnico N3)',
      sessionType,
      connectionMode: connMode,
      status: 'active',
      startedAt: timeStr,
      durationSeconds: 0,
      bytesSent: 120000,
      bytesReceived: 4500000,
      latencyMs: connMode === 'direct_p2p' ? 14 : 32,
      fps: 60,
      qualityProfile: 'auto',
      activeMonitor: 1,
      totalMonitors: device.hardwareSpec.monitorsCount || 1,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  // Handle client accepting the supervised access request
  const handleSupervisedAccept = () => {
    if (!supervisedPromptDevice) return;
    const target = supervisedPromptDevice;
    setSupervisedPromptDevice(null);
    showAlert(`Conexão autorizada pelo usuário remoto em ${target.hostname}!`, 'success');
    startActiveSession(target, 'direct_p2p', 'supervised');
  };

  // Handle client rejecting the supervised access request
  const handleSupervisedReject = () => {
    if (!supervisedPromptDevice) return;
    const target = supervisedPromptDevice;
    setSupervisedPromptDevice(null);

    // Audit log rejection
    const now = new Date();
    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      organizationId: target.organizationId,
      userId: 'usr-1',
      userName: 'Carlos Amor (Técnico N3)',
      deviceId: target.id,
      deviceHostname: target.hostname,
      action: 'CONNECTION_REJECTED',
      ipAddress: '177.136.241.80',
      status: 'DENIED',
      metadata: { reason: 'Usuário remoto clicou em RECUSAR na tela interativa' },
      timestamp: now.toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
    showAlert(`Conexão recusada pelo usuário remoto em ${target.hostname}.`, 'error');
  };

  // Toggle favorite
  const handleToggleFavorite = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  };

  // Create Group
  const handleCreateGroup = (name: string, description: string) => {
    const newGrp: DeviceGroup = {
      id: `grp-${Date.now()}`,
      organizationId: 'org-1',
      name,
      description,
      deviceCount: 0,
    };
    setGroups((prev) => [...prev, newGrp]);
    showAlert(`Grupo "${name}" criado com sucesso!`, 'success');
  };

  const onlineCount = devices.filter((d) => d.status === 'online').length;

  return (
    <DesktopClientLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onOpenAgentModal={() => setShowAgentModal(true)}
      onOpenSettings={() => setShowSettingsModal(true)}
      onOpenPwaModal={() => setShowPwaModal(true)}
      onOpenReportModal={() => setShowReportModal(true)}
      themeMode={themeMode}
      onToggleThemeMode={handleToggleThemeMode}
      onlineCount={onlineCount}
      totalDevices={devices.length}
      unreadChats={tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length}
      activeAlerts={alerts.filter((a) => !a.isResolved).length}
      devices={devices}
      onQuickConnectDevice={(dev) => handleInitiateConnection(dev, 'supervised')}
      userName={currentUser.name}
      userEmail={currentUser.email}
      isSupabaseActive={isSupabaseActive}
    >
      {/* Global Alert Notification */}
      {bannerAlert && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 ${
              bannerAlert.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {bannerAlert.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span>{bannerAlert.message}</span>
            </div>
            <button
              onClick={() => setBannerAlert(null)}
              className="text-slate-400 hover:text-white text-xs ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SUPORTE REMOTO DIRETO (IDENTIDADE ANECTTADESK) */}
      {/* ========================================================================= */}
      {currentTab === 'remote_support' && (
        <AnecttaRemoteSupport
          localId={localId}
          localPassword={localPassword}
          onRegeneratePassword={handleRegeneratePassword}
          onConnect={(targetId, mode, password) => handleConnectById(targetId, mode, password)}
          recentDevices={devices}
          onOpenDeviceDetail={(dev) => setInventoryDevice(dev)}
          onOpenAgentModal={() => setShowAgentModal(true)}
          onOpenPwaModal={() => setShowPwaModal(true)}
          onSwitchToSessions={() => setCurrentTab('sessions')}
          userEmail="carlosamorfbr@gmail.com"
          userName="Carlos Amor"
          isNocMode={themeMode === 'noc_high_contrast'}
        />
      )}

      {/* TAB 1: DASHBOARD / NOC GERAL */}
      {currentTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <ConnectCard
            onConnectById={handleConnectById}
            recentDevices={devices}
            onOpenDeviceDetail={(dev) => setInventoryDevice(dev)}
          />

          <DashboardOverview
            devices={devices}
            sessions={sessions}
            auditLogs={auditLogs}
            onConnectDevice={(dev) => handleInitiateConnection(dev, 'supervised')}
            onOpenDeviceDetail={(dev) => setInventoryDevice(dev)}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        </div>
      )}

      {/* TAB 2: MEUS DISPOSITIVOS */}
      {currentTab === 'devices' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <DeviceList
            devices={devices}
            onConnectDevice={(dev) => handleInitiateConnection(dev, 'supervised')}
            onOpenDeviceDetail={(dev) => setInventoryDevice(dev)}
            onOpenFileManager={(dev) => handleInitiateConnection(dev, 'supervised')}
            onOpenChat={(dev) => handleInitiateConnection(dev, 'supervised')}
            onToggleFavorite={handleToggleFavorite}
            onUpdateDevice={handleUpdateDevice}
            onTriggerWol={handleTriggerWol}
            onOpenAutomation={() => setCurrentTab('automation')}
          />
        </div>
      )}

      {/* TAB 3: FAVORITOS */}
      {currentTab === 'favorites' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <DeviceList
            devices={devices}
            onConnectDevice={(dev) => handleInitiateConnection(dev, 'supervised')}
            onOpenDeviceDetail={(dev) => setInventoryDevice(dev)}
            onOpenFileManager={(dev) => handleInitiateConnection(dev, 'supervised')}
            onOpenChat={(dev) => handleInitiateConnection(dev, 'supervised')}
            onToggleFavorite={handleToggleFavorite}
            onlyFavorites={true}
            onUpdateDevice={handleUpdateDevice}
            onTriggerWol={handleTriggerWol}
            onOpenAutomation={() => setCurrentTab('automation')}
          />
        </div>
      )}

      {/* TAB 4: GRUPOS */}
      {currentTab === 'groups' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <GroupManager
            groups={groups}
            devices={devices}
            onSelectGroup={(grpName) => setCurrentTab('devices')}
            onCreateGroup={handleCreateGroup}
          />
        </div>
      )}

      {/* TAB 5: HISTÓRICO DE SESSÕES & GRAVAÇÕES FORENSES */}
      {currentTab === 'sessions' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <SessionHistory 
            sessions={sessions} 
            recordings={recordings}
            onPlayRecording={(rec) => setActivePlayingRecording(rec)}
          />
        </div>
      )}

      {/* TAB: ALERTAS PROATIVOS & TELEMETRIA */}
      {currentTab === 'alerts' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <AlertsManager
            alerts={alerts}
            devices={devices}
            onResolveAlert={handleResolveAlert}
            onMarkAsRead={handleMarkAlertAsRead}
            onMarkAllAsRead={handleMarkAllAlertsAsRead}
            onConnectDevice={(dev) => handleInitiateConnection(dev, 'supervised')}
            onRunDiagnostic={handleRunAlertDiagnostic}
          />
        </div>
      )}

      {/* TAB: CHAMADOS DE SUPORTE & CHAT TÉCNICO */}
      {(currentTab === 'chat' || currentTab === 'support') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <SupportChatCenter
            tickets={tickets}
            chatMessages={chatMessages}
            devices={devices}
            operators={operators}
            currentOperatorName="Carlos Amor"
            onConnectToTicketDevice={handleConnectToTicketDevice}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onCreateTicket={handleCreateTicket}
            onSendMessage={handleSendChatMessage}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        </div>
      )}

      {/* TAB 6: AUDITORIA FORENSE */}
      {currentTab === 'audit' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <AuditView 
            logs={auditLogs} 
            isNocMode={themeMode === 'noc_high_contrast'}
            onToggleNocMode={handleToggleThemeMode}
          />
        </div>
      )}

      {/* TAB 7: EQUIPE & RBAC */}
      {currentTab === 'operators' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <UserManager
            operators={operators}
            groups={groups}
            onAddOperator={handleAddOperator}
            onUpdateOperator={handleUpdateOperator}
            onDeleteOperator={handleDeleteOperator}
            currentUserId="usr-1"
          />
        </div>
      )}

      {/* TAB 8: AUTOMAÇÃO & SCRIPTS */}
      {currentTab === 'automation' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <AutomationManager
            scripts={scripts}
            executionJobs={executionJobs}
            devices={devices}
            groups={groups}
            onExecuteScript={handleExecuteScript}
            onCreateScript={handleCreateScript}
            onDeleteScript={handleDeleteScript}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: SOLICITAÇÃO DE ACESSO SUPERVISIONADO (CLIENT-SIDE) */}
      {/* ============================================================ */}
      {supervisedPromptDevice && (
        <SupervisedPromptModal
          device={supervisedPromptDevice}
          operatorName="Carlos Amor (Técnico N3)"
          organizationName="Anectta Enterprise Corp"
          reason="Suporte Técnico, Diagnóstico e Auditoria de Endpoint"
          onAccept={handleSupervisedAccept}
          onReject={handleSupervisedReject}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL 2: DETALHES DE INVENTÁRIO DO DISPOSITIVO */}
      {/* ============================================================ */}
      {inventoryDevice && (
        <DeviceInventoryModal
          device={inventoryDevice}
          onClose={() => setInventoryDevice(null)}
          onConnect={(dev) => handleInitiateConnection(dev, 'supervised')}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL 3: INSTALAÇÃO DO AGENT WINDOWS / LINUX / MAC */}
      {/* ============================================================ */}
      {showAgentModal && (
        <AgentDownloadModal onClose={() => setShowAgentModal(false)} />
      )}

      {/* ============================================================ */}
      {/* MODAL 4: CONFIGURAÇÕES GLOBAIS DO ANECTTADESK */}
      {/* ============================================================ */}
      {showSettingsModal && (
        <SettingsModal
          settings={systemSettings}
          onClose={() => setShowSettingsModal(false)}
          onSaveSettings={(newSettings) => {
            setSystemSettings(newSettings);
            if (newSettings.themeMode && newSettings.themeMode !== themeMode) {
              setThemeMode(newSettings.themeMode);
              localStorage.setItem('anecttadesk_theme', newSettings.themeMode);
            }
            showAlert('Configurações do AnecttaDESK salvas com sucesso!', 'success');
          }}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL 5: PLAYER FORENSE DE GRAVAÇÃO DE SESSÃO REMOTA */}
      {/* ============================================================ */}
      {activePlayingRecording && (
        <SessionPlayerModal
          session={activePlayingRecording}
          onClose={() => setActivePlayingRecording(null)}
        />
      )}

      {/* ============================================================ */}
      {/* MODAL 6: RELATÓRIO GERENCIAL MENSAL DE SLA EM PDF */}
      {/* ============================================================ */}
      <ManagementReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        tickets={tickets}
        devices={devices}
        isNocMode={themeMode === 'noc_high_contrast'}
      />

      {/* ============================================================ */}
      {/* MODAL 7: INSTALAÇÃO DO APLICATIVO DESKTOP (PWA) */}
      {/* ============================================================ */}
      <PwaInstallModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
        onTriggerInstall={handleTriggerPwaInstall}
        canInstallDirectly={!!deferredPwaPrompt}
        isNocMode={themeMode === 'noc_high_contrast'}
      />

      {/* ============================================================ */}
      {/* FULLSCREEN REMOTE SESSION VIEWER */}
      {/* ============================================================ */}
      {activeSessionDevice && (
        <RemoteSessionViewer
          device={activeSessionDevice}
          onCloseSession={() => {
            setActiveSessionDevice(null);
            showAlert(`Sessão remota com ${activeSessionDevice.hostname} encerrada pelo operador.`, 'success');
          }}
          connectionMode={sessionConnectionMode}
        />
      )}
    </DesktopClientLayout>
  );
}
