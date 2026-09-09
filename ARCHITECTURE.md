# ANECTTADESK - Architecture & Distributed Systems Design

## Overview
AnecttaDESK is an autonomous, enterprise-grade Remote Desktop, Remote Access, and Support solution. It maintains strict architectural separation between the **Control Plane** (authentication, RBAC, presence discovery, signaling, audit logging) and the **Data Plane** (real-time video capture, low-latency mouse/keyboard injection, clipboard synchronization, and bi-directional file transfers).

## Segregation of Concerns
1. **Web Console / Client (`apps/web`):**
   - Operator Dashboard, Session Viewer, Hardware/Software Inventory, File Manager, Session Chat.
   - Built on React 19, Next.js / Vite architecture, TypeScript, and Tailwind CSS.
2. **Signaling Server (`services/signaling`):**
   - Agent discovery, heartbeat tracking, WebRTC SDP/ICE exchange, STUN traversal.
3. **Relay Server (`services/relay`):**
   - High-throughput encrypted packet forwarding when direct P2P connection cannot traverse symmetric NAT or corporate firewalls. Zero-knowledge forwarding (E2EE).
4. **Agent Windows (`agents/windows`):**
   - Windows Service (`anecttadesk-service.exe`) running under `NT AUTHORITY\SYSTEM` in Session 0.
   - Desktop Worker (`anecttadesk-worker.exe`) spawned in active user session (or Winlogon) via DXGI Desktop Duplication API for hardware-accelerated 60 FPS screen capture and UAC elevation handling.
5. **Database (`database/`):**
   - PostgreSQL 16+ / Supabase agnostic schema with Row-Level Security (RLS) enforcing strict multi-tenant isolation by `organization_id`.
