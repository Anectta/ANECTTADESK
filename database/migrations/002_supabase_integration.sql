-- ============================================================
-- ANECTTADESK - INTEGRAÇÃO COM SUPABASE AUTH & REALTIME
-- Migration 002: RLS, Triggers de Auth e Realtime
-- ============================================================

-- 1. HABILITAR ROW LEVEL SECURITY (RLS) NAS TABELAS PRINCIPAIS
ALTER TABLE IF EXISTS organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS device_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS temporary_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS remote_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS file_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS RLS BÁSICAS (LEITURA E ESCRITA PARA AUTENTICADOS)
-- Permite que usuários autenticados leiam e gerenciem dados de sua organização
DO $$ 
BEGIN
    -- Organizations
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their organization') THEN
        CREATE POLICY "Users can view their organization" ON organizations
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;

    -- Devices
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view devices') THEN
        CREATE POLICY "Authenticated users can view devices" ON devices
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Device Groups
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can manage groups') THEN
        CREATE POLICY "Authenticated users can manage groups" ON device_groups
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Remote Sessions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can manage sessions') THEN
        CREATE POLICY "Authenticated users can manage sessions" ON remote_sessions
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Audit Logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view and insert audit logs') THEN
        CREATE POLICY "Authenticated users can view and insert audit logs" ON audit_logs
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Chat Messages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view chat') THEN
        CREATE POLICY "Authenticated users can view chat" ON chat_messages
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- 3. TRIGGER AUTOMÁTICO: SINCRONIZAR NOVO USUÁRIO DO SUPABASE AUTH COM PUBLIC.USERS
-- Quando um usuário cria conta no Supabase Auth, cria o perfil correspondente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Busca a organização padrão ou cria uma primeira
    SELECT id INTO default_org_id FROM public.organizations ORDER BY created_at ASC LIMIT 1;
    
    IF default_org_id IS NULL THEN
        INSERT INTO public.organizations (name, slug)
        VALUES ('Organização Principal', 'principal')
        RETURNING id INTO default_org_id;
    END IF;

    INSERT INTO public.users (
        id,
        organization_id,
        email,
        password_hash,
        full_name,
        role,
        is_active
    ) VALUES (
        NEW.id,
        default_org_id,
        NEW.email,
        'managed_by_supabase_auth',
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'operator'),
        TRUE
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativa o trigger no schema auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. HABILITAR SUPABASE REALTIME NA TABELA DE DISPOSITIVOS E SESSÕES
-- Permite que o frontend escute mudanças de status (online/offline) em tempo real
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE devices;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE remote_sessions;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

-- 5. SEED INICIAL DE EXEMPLO (OPCIONAL)
INSERT INTO public.organizations (name, slug)
VALUES ('Anectta Tecnologia', 'anectta')
ON CONFLICT (slug) DO NOTHING;
