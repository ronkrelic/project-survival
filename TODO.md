# Project Survival, build status

Designed and Made by Relic & Ember Studios. We wake worlds.

## Started

- Gamebible sections 01–17 — 100%.
- Concept art, 22 pieces — 100%.
- Studio identity, credits, README — 100%.
- Core engine slice (voxel chunks, worker meshing, player controller, prone wake, delta system) — 100% of slice scope.
- Multiplayer — decided PeerJS host/join, up to 4 players. Decision 100%; implementation 0%.
- Stage 1, the tutorial island in mist — 95%. Relic’s November 21 playtest: “looking good”; he walked off the rim into the void. Mist-catch is now implemented; awaiting his re-test.
- Rim barrier (mist-catch) — implemented: the mist slows a void fall, holds briefly, and eases the player onto solid ground inland, unharmed. No wall and no death; normal terrace falls remain. Awaiting Relic’s re-test of the feel.
- Mining and gathering system — implemented for the breaking-only slice: 5m targeting, hold-to-loosen, material yields, session tally/deltas, worker remeshing, protected monolith and two-layer foundation stone. Instrumented material and chunk-border checks pass; visual feel and real pointer-lock playtest await Relic (browser capture is black; native pointer lock is unavailable in the test browser). No save system.
- Stage 2, the wake in dark and the guide — 85%, implementation revised per Relic's direction. The leading ember route is replaced by a small shoulder-side fairy companion: quiet ambient drift, brief bright speaking visits for standing, first steps, first gather, rim and monolith, and a one-time gentle monolith nudge after 90 seconds without new regions or progress. Loading/name screen added: optional trimmed 16-character session name, world-ready Wake gate, personalized greeting. Attention sky, mining, mist-catch and landings are unchanged. Pages deployment and instrumented live checks passed: loading gate, trimmed named/unnamed greetings, each speaking beat, aimlessness nudge with monolith-directed drift and return, rosy cusp below the 0.72 ceiling, night mining and mist recovery. Beat timing was accelerated and positions/progress injected for coverage; captures are entirely black, so visual feel is not verified. No runtime errors were observed during these probes. Awaiting Relic's playtest of fairy scale, shoulder presence, speaking sightline, reading/fade timing, night readability and the aimlessness nudge. No saving or new audio; first fire remains Stage 3.
- Tuning pass (walk speed, rise feel, terraces underfoot) — 0%, waiting on playtest gut check.
- HUD and minimap revision — 0%; the Ember icon is committed as the future HUD face.

## Not yet started, in intended order

2. Stage 3, first fire from sparkstone and dryfiber, the monolith aurora, the one-way bridge.
3. Crafting, tools, real inventory.
4. Block placing and building.
5. Co-op multiplayer.
6. The open world beyond the bridge, infinite generation returns.
7. Saving and persistence.
8. Broader audio and sparse music (only the gathering hum is implemented).
9. Accessibility pass.
10. Open design questions: food without hunting, what survives death, endgame, co-op permissions.
11. Naming the canyon-red material, Relic’s call.
12. GoFundMe campaign, once the tutorial slice is whole.
