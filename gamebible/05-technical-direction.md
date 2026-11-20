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
- Host authority and session lifetime: if the host leaves, does the session end, or is host migration/handoff wanted?
- Signaling broker: use the PeerJS default free public broker, or self-host the signaling server later on the owner's own web hosting?
- NAT traversal fallback: TURN/relay support for strict networks.
- World synchronization architecture: terrain seed sync plus block-change deltas; the approach remains undecided.
- How each player's private spirit guide stays client-side and private in the netcode.
- Persistence of a co-op world across sessions.
- Exact terrain generation/noise algorithm and implementation parameters.
