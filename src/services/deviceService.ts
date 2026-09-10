import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Device, DeviceStatus } from '../types';
import { INITIAL_DEVICES } from '../data/mockData';

// Converte registro do Supabase para o formato Device do frontend
const mapRowToDevice = (row: any): Device => {
  return {
    id: row.id,
    organizationId: row.organization_id,
    deviceGroupId: row.device_group_id,
    groupName: row.group_name || 'Geral',
    anecttadeskId: row.anecttadesk_id,
    hostname: row.hostname,
    osType: row.os_type || 'windows',
    osVersion: row.os_version || 'Windows 11 Pro',
    agentVersion: row.agent_version || '1.0.0',
    status: row.status as DeviceStatus,
    currentUser: row.current_user || 'Sistema',
    publicIp: row.public_ip || '127.0.0.1',
    localIp: row.local_ip || '192.168.1.100',
    lastHeartbeat: row.last_heartbeat ? new Date(row.last_heartbeat).toLocaleTimeString('pt-BR') : 'Agora',
    isFavorite: false,
    isUnattendedEnabled: !!row.is_unattended_enabled,
    hardwareSpec: row.hardware_spec || {
      cpu: 'Intel Core i7',
      ramGb: 16,
      diskGb: 512,
      uptimeHours: 24,
      networkAdapter: 'Ethernet Gigabit',
      macAddress: '00:1B:44:11:3A:B7',
      resolution: '1920x1080',
      monitorsCount: 1,
    },
  };
};

export const deviceService = {
  // Busca a lista de dispositivos (do Supabase ou dos Mocks)
  async fetchDevices(): Promise<{ devices: Device[]; isMock: boolean }> {
    if (!isSupabaseConfigured()) {
      return { devices: INITIAL_DEVICES, isMock: true };
    }

    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('hostname', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn('Nenhum dispositivo encontrado no Supabase ou erro na consulta. Usando fallback:', error);
        return { devices: INITIAL_DEVICES, isMock: true };
      }

      return { devices: data.map(mapRowToDevice), isMock: false };
    } catch (err) {
      console.error('Falha ao consultar dispositivos no Supabase:', err);
      return { devices: INITIAL_DEVICES, isMock: true };
    }
  },

  // Atualiza o status de um dispositivo (online, offline, busy, etc.)
  async updateStatus(id: string, status: DeviceStatus): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('devices')
        .update({
          status,
          last_heartbeat: new Date().toISOString(),
        })
        .eq('id', id);

      return !error;
    } catch (err) {
      console.error('Erro ao atualizar status do dispositivo:', err);
      return false;
    }
  },

  // Inscreve-se nas atualizações em tempo real (Supabase Realtime)
  subscribeToChanges(onDeviceChange: (updatedDevice: Device) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel('realtime_devices_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        (payload: any) => {
          if (payload.new) {
            onDeviceChange(mapRowToDevice(payload.new));
          }
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};
