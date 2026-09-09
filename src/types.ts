export type DeviceStatus = 'online' | 'offline' | 'busy' | 'connecting' | 'maintenance' | 'disabled';
export type OSType = 'windows' | 'linux' | 'macos' | 'android';
export type SessionStatus = 'requested' | 'accepted' | 'rejected' | 'active' | 'closed' | 'aborted';
export type ConnectionMode = 'direct_p2p' | 'relay';
export type UserRole = 'super_admin' | 'org_admin' | 'manager' | 'technician' | 'operator' | 'viewer';

export interface HardwareSpec {
  cpu: string;
  ramGb: number;
  diskGb: number;
  gpu?: string;
  serialNumber?: string;
  uptimeHours: number;
  networkAdapter: string;
  macAddress: string;
  resolution: string;
  monitorsCount: number;
}

export interface Device {
  id: string;
  organizationId: string;
  deviceGroupId?: string;
  groupName?: string;
  anecttadeskId: string; // Ex: "847 231 559"
  hostname: string;
  osType: OSType;
  osVersion: string;
  agentVersion: string;
  status: DeviceStatus;
  currentUser?: string;
  publicIp: string;
  localIp: string;
  lastHeartbeat: string;
  isFavorite: boolean;
  isUnattendedEnabled: boolean;
  hardwareSpec: HardwareSpec;
}

export interface DeviceGroup {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  deviceCount: number;
}

export interface RemoteSession {
  id: string;
  organizationId: string;
  deviceId: string;
  deviceHostname: string;
  deviceAnecttadeskId: string;
  operatorId: string;
  operatorName: string;
  sessionType: 'supervised' | 'unattended';
  connectionMode: ConnectionMode;
  relayNode?: string;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  bytesSent: number;
  bytesReceived: number;
  latencyMs: number;
  fps: number;
  qualityProfile: 'auto' | 'fluid' | 'balanced' | 'high_definition';
  activeMonitor: number;
  totalMonitors: number;
}

export interface FileItem {
  id: string;
  name: string;
  sizeBytes: number;
  isDirectory: boolean;
  updatedAt: string;
  path: string;
}

export interface FileTransferLog {
  id: string;
  sessionId: string;
  direction: 'local_to_remote' | 'remote_to_local';
  fileName: string;
  fileSizeBytes: number;
  progressPercent: number;
  speedMbps: number;
  status: 'pending' | 'transferring' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
}

export interface SessionChatMessage {
  id: string;
  sessionId: string;
  senderType: 'operator' | 'remote_user' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  userName?: string;
  deviceId?: string;
  deviceHostname?: string;
  action: 
    | 'LOGIN'
    | 'LOGOUT'
    | 'DEVICE_REGISTERED'
    | 'DEVICE_REMOVED'
    | 'CONNECTION_REQUESTED'
    | 'CONNECTION_ACCEPTED'
    | 'CONNECTION_REJECTED'
    | 'SESSION_STARTED'
    | 'SESSION_ENDED'
    | 'FILE_UPLOAD'
    | 'FILE_DOWNLOAD'
    | 'REBOOT_TRIGGERED'
    | 'UNATTENDED_ACCESS_CONFIGURED'
    | 'AGENT_UPDATE'
    | 'EXECUTE_AUTOMATION_SCRIPT';
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface UnattendedPolicyConfig {
  allowDirectInput: boolean;
  allowClipboard: boolean;
  allowFileTransfer: boolean;
  allowReboot: boolean;
  requireMfa: boolean;
  allowedTimeWindow?: string;
}

export interface RemoteProcess {
  pid: number;
  name: string;
  cpuPercent: number;
  memoryMb: number;
  user: string;
  description: string;
  isCritical?: boolean;
}

export interface TerminalHistoryItem {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  status: 'success' | 'error' | 'running';
}

export interface SystemSettings {
  signalingUrl: string;
  stunServer: string;
  relayCluster: string;
  preferredCipher: 'ChaCha20-Poly1305' | 'AES-256-GCM';
  requireMfaForUnattended: boolean;
  sessionInactivityTimeoutMinutes: number;
  autoRecordSessions: boolean;
  defaultVideoCodec: 'h264' | 'vp9' | 'auto';
  maxFpsLimit: 30 | 60;
  themeMode: 'standard_dark' | 'noc_high_contrast';
  nocHighContrastLogs?: boolean;
}

export type OperatorRole = 'admin' | 'tech_n3' | 'tech_n2' | 'tech_n1' | 'auditor';

export interface RolePermissions {
  canRemoteControl: boolean;
  canFileTransfer: boolean;
  canExecuteTerminal: boolean;
  canManageProcesses: boolean;
  canTriggerReboot: boolean;
  canTriggerWol: boolean;
  canViewAuditLogs: boolean;
  canManageTeam: boolean;
  canConfigureEndpoints: boolean;
  canRecordSession: boolean;
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: OperatorRole;
  status: 'active' | 'suspended' | 'invited';
  mfaEnabled: boolean;
  allowedGroups: string[];
  lastActive: string;
  createdDate: string;
  phone?: string;
}

export type ScriptCategory = 'maintenance' | 'network' | 'diagnostic' | 'security' | 'custom';
export type ScriptInterpreter = 'powershell' | 'bash' | 'cmd';

export interface AutomationScript {
  id: string;
  name: string;
  description: string;
  category: ScriptCategory;
  interpreter: ScriptInterpreter;
  targetOs: 'windows' | 'linux' | 'macos' | 'all';
  scriptContent: string;
  requiresElevation: boolean;
  timeoutSeconds: number;
  author: string;
  lastExecuted?: string;
  executionCount: number;
}

export interface ScriptExecutionResult {
  deviceId: string;
  deviceHostname: string;
  status: 'success' | 'failed' | 'timeout';
  exitCode: number;
  output: string;
  durationMs: number;
  timestamp: string;
}

export interface ScriptExecutionJob {
  id: string;
  scriptId: string;
  scriptName: string;
  triggeredBy: string;
  targetCount: number;
  status: 'running' | 'completed' | 'failed' | 'partial';
  startedAt: string;
  completedAt?: string;
  results: ScriptExecutionResult[];
}

// 1. Proactive Health & Monitoring Alerts
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 'cpu_spike' | 'disk_low' | 'ram_high' | 'heartbeat_loss' | 'security';

export interface SystemAlert {
  id: string;
  deviceId: string;
  deviceHostname: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  message: string;
  metricValue: string;
  metricThreshold: string;
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
}

// 2. Remote Session Recording & Video Player
export interface SessionTimelineEvent {
  timeSeconds: number;
  label: string;
  type: 'terminal' | 'file_transfer' | 'process_kill' | 'reboot' | 'mouse_click' | 'uac_elevation';
  details: string;
}

export interface RecordedSession {
  id: string;
  sessionId: string;
  deviceHostname: string;
  deviceId: string;
  operatorName: string;
  operatorRole: string;
  clientIp: string;
  durationSeconds: number;
  durationFormatted: string;
  recordedAt: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  resolution: string;
  codec: string;
  fps: number;
  timelineEvents: SessionTimelineEvent[];
}

// 3. Support Tickets & Tech Team Chat
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  requesterName: string;
  requesterEmail: string;
  requesterDeviceId: string;
  requesterDeviceHostname: string;
  anecttadeskId: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedOperatorId?: string;
  assignedOperatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechChatMessage {
  id: string;
  channelId: 'general' | 'infrastructure' | 'n2_oncall';
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  timestamp: string;
  attachmentTicketId?: string;
  attachmentDeviceId?: string;
}

// 4. VoIP / Bidirectional Voice Audio Channel
export interface VoipCallState {
  status: 'idle' | 'calling' | 'connected' | 'ended';
  isMuted: boolean;
  isSpeakerMuted: boolean;
  volume: number;
  durationSeconds: number;
  audioBitrateKbps: number;
  latencyMs: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
}

// 5. SLA & Executive Management Report
export interface SlaTicketReportItem {
  ticketNumber: string;
  subject: string;
  requester: string;
  deviceHostname: string;
  operator: string;
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  remoteSessionDurationMinutes: number;
  slaMet: boolean;
  status: TicketStatus;
  closedAt: string;
}

export interface ManagementReportSummary {
  period: string;
  generatedAt: string;
  companyName: string;
  totalTickets: number;
  resolvedTickets: number;
  inProgressTickets: number;
  slaCompliancePercentage: number;
  slaTargetPercentage: number;
  firstContactResolutionPercentage: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeMinutes: number;
  totalRemoteHours: number;
  totalRemoteSessions: number;
  csatScore: number;
  ticketsByPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  items: SlaTicketReportItem[];
}

