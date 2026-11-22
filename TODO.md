# Project Survival, build status

Designed and Made by Relic & Ember Studios. We wake worlds.

## Started

- Gamebible sections 01–17 — 100%.
- Concept art, 22 pieces — 100%.
- Studio identity, credits, README — 100%.
- Core engine slice (voxel chunks, worker meshing, player controller, prone wake, delta system) — 100% of slice scope.
- Multiplayer — decided PeerJS host/join, up to 4 players. Decision 100%; implementation 0%.
- Stage 1, the tutorial island in mist — 100% of signed-off slice. Relic signed off November 21, 2026: “I sign off on it”.
- Rim barrier (mist-catch) — implemented: the mist slows a void fall, holds briefly, and eases the player onto solid ground inland, unharmed. No wall and no death; normal terrace falls remain. Awaiting Relic’s re-test of the feel.
- Mining and gathering system — implemented for the breaking-only slice: 5m targeting, hold-to-loosen, material yields, session tally/deltas, worker remeshing, protected monolith and two-layer foundation stone. Instrumented material and chunk-border checks pass; visual feel and real pointer-lock playtest await Relic (browser capture is black; native pointer lock is unavailable in the test browser). No save system.
- Stage 2, the wake in dark and the guide — 100% of signed-off slice. Relic signed off November 21, 2026: “I sign off on it”. Optional session name, world-ready Wake gate, attention-limited rosy cusp, quiet fairy companion and prior gathering/mist-catch remain the baseline.
- Tuning pass (walk speed, rise feel, terraces underfoot) — 0%, waiting on playtest gut check.
- HUD and minimap revision — 0%; the Ember icon is committed as the future HUD face.

- Stage 3, first fire and departure — started November 22, 2026; 95% (implementation and instrumented functional checks complete; visual/audio feel and real pointer-lock playtest not signed off). Six pale sparkstone seams near the hollow, grass giving dryfiber plus earth, a cold circle at (6,-6), three sparkstone + five dryfiber held for two seconds to kindle a session fire. First fire alone releases a ninety-second smooth dawn; teal/violet monolith ribbons answer. Full dawn reveals an arched northern bridge, earned editable guide naming, one-way dissolution and a small grassy far shore with two trees. No wider crafting, placing, saving, co-op or music.
- Stage 3 live probes (November 22): six surface nodes verified; sparkstone 1.5s and grass 0.4s yields; once-only fire lines; 2.01s ritual consumes exactly 3/5; pre-fire phase <0.72, post-fire midpoint ~0.86 and exactly 1.0 at 90 simulated seconds; animated aurora; full-dawn-only seven-second bridge; Ember prefill and trimmed custom Lumen accepted/spoken with “I’ll keep it.”; unnamed collision gate; controller walked the entire arch to the shore, rear collision/opacity dissolved; guide follows; farther void returns to (12,37,-156) through the existing mist animation. No captured runtime errors in these probes. Time accelerated through update functions, pointer lock simulated, rendering disabled during probes after black captures and a recovered WebGL/browser failure; not a rendered or real-time playthrough.
- Stage 3 playtest awaiting Relic: mineral discoverability and night readability; cold-circle/enough-material line timing; aim and hold ritual; warmth and quiet crackle; the ninety-second emotional dawn payoff; aurora sightlines and motion; bridge emergence, naming pause, gentle gating and irreversible crossing; companion presence on the far shore and the farther mist's return; regressions in loading, gathering, landings and mist-catch. Instrumentation is not a human feel sign-off.

## Not yet started, in intended order

3. Crafting, tools, real inventory.
4. Block placing and building.
5. Co-op multiplayer.
6. The open world beyond the bridge, infinite generation returns.
7. Saving and persistence.
8. Broader audio and sparse music (only the gathering hum and quiet first-fire crackle are implemented).
9. Accessibility pass.
10. Open design questions: food without hunting, what survives death, endgame, co-op permissions.
11. Naming the canyon-red material, Relic’s call.
12. GoFundMe campaign, once the tutorial slice is whole.
