# Technical direction

Agreed by Relic and Ember on November 20, 2026.

Preliminary only — a proper architecture document comes later.

Intended browser stack, consistent with the owner's other projects: Three.js, ES modules, no build step, static hosting of the client, and source on GitHub.

Multiplayer direction, decided by Relic on November 20, 2026: PeerJS (WebRTC peer-to-peer), with host/join sessions for up to 4-player co-op. This fits the browser/Three.js/ES modules/no-build-step stack, with no dedicated game server required for a session. Signaling and any NAT traversal relay needs remain separate open questions below. Node.js/WebSockets is retired as the candidate for session networking; it may be relevant only if a persistent central service is ever needed.

First playable slice, agreed direction: infinite procedural terrain generation with first-person walking, nothing else — a feel test before systems.

## Commit discipline

Work in small chunks. Commit each chunk to main immediately with a clear focused message BEFORE moving on. Verify each commit landed by reading the file back on github.com. Keep commits focused.

## Open questions / gaps

- Proper architecture document.
- Stage Six settles host authority and session lifetime: host umpire, no migration; guests retain received deltas and may continue alone.
- Stage Six uses the default free public PeerJS broker. Self-hosted signaling remains a future option.
- NAT traversal fallback: TURN/relay support for strict networks.
- Stage Six settles synchronization: fixed seed 73021, host-approved session deltas for breaks and the lit hearth; position/facing/realm at 15 Hz, locally interpolated.
- Stage Six keeps all guide state entirely client-side: no spirit messages or serialized guide fields.
- Persistence of a co-op world across sessions.
- Exact terrain generation/noise algorithm and implementation parameters.

## Stage Six implementation boundary

The browser client currently loads pinned PeerJS 1.5.5 from jsDelivr, on demand only for multiplayer. This is a deliberate CDN deviation from the preference to vendor the library; no accounts or API keys. Vendoring for offline/dependency control remains follow-up. The original Three.js dependency is unchanged. Star data topology supports four total seats; host–guest media calls use per-guest host mixes, not positional audio. Session-only, with no saving or host migration. See sections 09 and 16 for the co-op and interface contract and explicitly vetoable shared-dawn ruling. Native visual/voice and cross-network reliability require real human testing; broker connection alone is not a successful two-player test.
