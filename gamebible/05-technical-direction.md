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

## Stage Eight — Relic decision, November 22, 2026

Relic explicitly chose validated craft receipts (option A): guests attach ordered craft receipts to existing block requests. The host validates each three-wood recipe cost against its own guest-yield ledger and derives wooden tool ownership before permitting stone breaks or tilling. This extends the existing request payload, alongside the op=till soil delta; it adds no message type. Tools remain local per-player state. Wild patches and growing crops are LOCAL-ONLY, not synchronized; shared farming is a later pass.

PeerJS 1.5.5 is now vendored at docs/js/vendor/peerjs.min.js with its MIT notice, replacing the historical CDN loader above. The local bundle is the only primary path, with no CDN fallback. A live instrumented host boot reached 0.peerjs.com and generated a join code. This removes the PeerJS CDN dependency, not the public signaling service or the existing Three.js CDN dependency. Real two-device WebRTC/voice remains a separate check.


## Stage Ten — The settling-in update

Designed by Relic · November 23, 2026. Implemented proposals below remain vetoable by Relic; they are not prior approved dialogue.

### Persistence and authority
Version 1 uses localStorage keys project-survival:world:v1 and project-survival:person:v1; both records carry version:1 and seed:73021. World: deltas, soil entries, crop entries {x,y,z,wild,age}, wildHarvested, clock {seconds,day}, flags {lit,named,guideName,crossed}, guests keyed by private continuity identity with {bag,craftCount}. Personal: crossed, name, guideName, inventory (including tools), hunger, health, position {x,y,z}, crafts, identity. No DOM objects enter the clock record.
Solo/host save world; every player saves personal state. Quiet active-time autosave about 30 seconds, pagehide and milestones. No mid-island save: uncrossed players Wake fresh (vetoable simplicity). Continue restores solo position only; multiplayer retains join spawn. Host restores saved world/ledger; guest continuity uses a random bearer identity, not a public display name. Local storage is convenience persistence, not cryptographic anti-cheat against browser editing. Begin anew asks confirmation before clearing both records. No save UI beyond loading choices.
Existing break request/result/delta messages are extended for placement; no new message types. Host checks material balance, selected owned tool/tier, receipts, coordinates, range and intersection. Personal cooking, vitals, selection and sound remain local; crops remain local-only in multiplayer. Renderer-stub tests do not establish two-device transport or native visual quality.
