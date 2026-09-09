# ANECTTADESK PROTOCOL SPECIFICATION (v1.0)

## Frame Framing & Wire Format
Every packet transmitted over the Data Plane (Direct P2P or Relay) follows this binary envelope:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Magic (0xAD) |  Ver (0x01)   |   Msg Type    |   Reserved    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         Payload Length                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                     Payload (Encrypted Data)                  +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

## Control Message Types
- `0x01` (`HELLO`): Version negotiation & capabilities.
- `0x02` (`AUTH_REQUEST`): Ephemeral session token submission.
- `0x03` (`AUTH_RESPONSE`): Validation ack with symmetric cipher suite.
- `0x10` (`HEARTBEAT`): Agent presence signal every 15s.
- `0x20` (`CONNECTION_REQUEST`): Operator access prompt (Supervised or Unattended).
- `0x21` (`CONNECTION_ACCEPT`): Remote confirmation with authorized capabilities bitmask.
- `0x22` (`CONNECTION_REJECT`): Rejection notification or authentication failure.
- `0x30` (`SCREEN_CONFIG`): Display topology (Monitors, DPI, Virtual coordinates).
- `0x31` (`VIDEO_FRAME`): Compressed frame slice (H.264 NALU / VP9 chunk).
- `0x40` (`INPUT_MOUSE`): Normalized coordinates (0-65535), buttons, wheel delta.
- `0x41` (`INPUT_KEYBOARD`): Virtual keycode, scancode, modifiers (Shift, Ctrl, Alt, Win).
- `0x50` (`CLIPBOARD`): Format (text/plain, unicode), content length, payload.
- `0x60` (`FILE_CHUNK`): Offset, chunk data, SHA256 integrity block.
- `0x70` (`CHAT_MESSAGE`): UTF-8 text message between technician and client.
- `0x80` (`SYSTEM_COMMAND`): Reboot, Shutdown, Lock, CAD (Ctrl+Alt+Del).
