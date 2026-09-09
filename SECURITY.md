# ANECTTADESK SECURITY MODEL

## Core Security Pillars
1. **End-to-End Encryption (E2EE):**
   - Media and interactive input streams are encrypted with ephemeral keys negotiated via Elliptic Curve Diffie-Hellman (X25519).
   - Relays are zero-knowledge packet forwarders without access to the session decryption keys.
2. **Identity & ID Generation:**
   - The AnecttaDESK ID (9 digits formatted as `XXX XXX XXX`) is generated through CSPRNG and registered in the database.
   - It cannot be guessed or mapped to physical hardware MAC addresses.
3. **Authentication & Ephemeral Passwords:**
   - One-time access codes expire within 10 minutes or upon immediate session establishment.
   - Unattended passwords are never stored in plain text; they are hashed with Argon2id and unique cryptographic salt.
4. **Audit Immutability:**
   - Every login, connection request, acceptance, termination, file transfer, and administrative reboot command generates an append-only entry in `audit_logs` containing IP, timestamp, user, device, and result.
5. **No Service Keys in Frontend:**
   - Supabase `service_role` or database root credentials are never bundled in client code. All administrative requests run through authenticated `/api/v1` server handlers with RBAC verification.
