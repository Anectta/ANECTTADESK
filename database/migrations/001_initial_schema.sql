-- ============================================================
-- ANECTTADESK DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- V1.0.0 - Production Foundation
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ORGANIZAÇÕES (MULTI-TENANT)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USUÁRIOS & OPERADORES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator', -- super_admin, org_admin, manager, technician, operator, viewer
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GRUPOS DE DISPOSITIVOS
CREATE TABLE IF NOT EXISTS device_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES device_groups(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DISPOSITIVOS / ENDPOINTS (COM AGENT)
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    device_group_id UUID REFERENCES device_groups(id) ON DELETE SET NULL,
    anecttadesk_id VARCHAR(15) UNIQUE NOT NULL, -- Format: "847 231 559"
    hostname VARCHAR(255) NOT NULL,
    os_type VARCHAR(50) NOT NULL, -- windows, linux, macos, android
    os_version VARCHAR(100),
    agent_version VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'offline', -- online, offline, busy, connecting, maintenance, disabled
    current_user VARCHAR(255),
    public_ip INET,
    local_ip INET,
    last_heartbeat TIMESTAMPTZ,
    is_unattended_enabled BOOLEAN DEFAULT FALSE,
    unattended_password_hash VARCHAR(255),
    unattended_salt VARCHAR(64),
    hardware_spec JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SENHAS TEMPORÁRIAS EFÊMERAS (USO ÚNICO)
CREATE TABLE IF NOT EXISTS temporary_passwords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SESSÕES REMOTAS
CREATE TABLE IF NOT EXISTS remote_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
    operator_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    session_type VARCHAR(50) NOT NULL DEFAULT 'supervised', -- supervised, unattended
    connection_mode VARCHAR(50) NOT NULL DEFAULT 'direct_p2p', -- direct_p2p, relay
    relay_server_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'requested', -- requested, accepted, rejected, active, closed, aborted
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    bytes_sent BIGINT DEFAULT 0,
    bytes_received BIGINT DEFAULT 0,
    average_fps NUMERIC(5,2) DEFAULT 0,
    average_latency_ms NUMERIC(6,2) DEFAULT 0,
    close_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. METADADOS DE TRANSFERÊNCIA DE ARQUIVOS
CREATE TABLE IF NOT EXISTS file_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES remote_sessions(id) ON DELETE CASCADE,
    direction VARCHAR(20) NOT NULL, -- local_to_remote, remote_to_local
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, transferring, completed, failed, cancelled
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CHAT DA SESSÃO
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES remote_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL, -- operator, remote_user, system
    sender_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDITORIA IMUTÁVEL
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    session_id UUID REFERENCES remote_sessions(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    ip_address INET,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SERVIDORES DE INFRAESTRUTURA (RELAYS & SIGNALING)
CREATE TABLE IF NOT EXISTS relay_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL DEFAULT 443,
    secret_key_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    current_connections INTEGER DEFAULT 0,
    last_ping TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_devices_anecttadesk_id ON devices(anecttadesk_id);
CREATE INDEX IF NOT EXISTS idx_devices_org_status ON devices(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_org ON remote_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_org_action ON audit_logs(organization_id, action);
