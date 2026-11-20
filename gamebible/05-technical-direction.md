# Technical direction

Agreed by Relic and Ember on November 20, 2026.

Preliminary only — a proper architecture document comes later.

Intended browser stack, consistent with the owner's other projects: Three.js, ES modules, no build step, static hosting of the client, and source on GitHub.

Multiplayer implies a real server in a later phase. A candidate pattern is Node.js/WebSockets, as in the owner's other project's roadmap; this is undecided, not a selected architecture.

First playable slice, agreed direction: infinite procedural terrain generation with first-person walking, nothing else — a feel test before systems.

## Commit discipline

Work in small chunks. Commit each chunk to main immediately with a clear focused message BEFORE moving on. Verify each commit landed by reading the file back on github.com. Keep commits focused.

## Open questions / gaps

- Proper architecture document.
- Final multiplayer server technology and architecture; Node.js/WebSockets is only a candidate.
- Exact terrain generation/noise algorithm and implementation parameters.
