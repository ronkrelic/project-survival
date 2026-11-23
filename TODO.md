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
- HUD and minimap revision — implemented in Stage 4; visual feel and legibility await Relic.

- Stage 3, first fire and departure — started November 22, 2026; 95% (implementation and instrumented functional checks complete; visual/audio feel and real pointer-lock playtest not signed off). Six pale sparkstone seams near the hollow, grass giving dryfiber plus earth, a cold circle at (6,-6), three sparkstone + five dryfiber held for two seconds to kindle a session fire. First fire alone releases a ninety-second smooth dawn; teal/violet monolith ribbons answer. Full dawn reveals an arched northern bridge, earned editable guide naming, one-way dissolution and a small grassy far shore with two trees. No wider crafting, placing, saving, co-op or music.
- Stage 3 live probes (November 22): six surface nodes verified; sparkstone 1.5s and grass 0.4s yields; once-only fire lines; 2.01s ritual consumes exactly 3/5; pre-fire phase <0.72, post-fire midpoint ~0.86 and exactly 1.0 at 90 simulated seconds; animated aurora; full-dawn-only seven-second bridge; Ember prefill and trimmed custom Lumen accepted/spoken with “I’ll keep it.”; unnamed collision gate; controller walked the entire arch to the shore, rear collision/opacity dissolved; guide follows; farther void returns to (12,37,-156) through the existing mist animation. No captured runtime errors in these probes. Time accelerated through update functions, pointer lock simulated, rendering disabled during probes after black captures and a recovered WebGL/browser failure; not a rendered or real-time playthrough.
- Stage 3 playtest awaiting Relic: mineral discoverability and night readability; cold-circle/enough-material line timing; aim and hold ritual; warmth and quiet crackle; the ninety-second emotional dawn payoff; aurora sightlines and motion; bridge emergence, naming pause, gentle gating and irreversible crossing; companion presence on the far shore and the farther mist's return; regressions in loading, gathering, landings and mist-catch. Instrumentation is not a human feel sign-off.

## Stage 4 — started November 22, 2026

Stage Four completed through fa7f4b9; Relic playtested and accepted it tonight (“Everything looks good”). The historical instrumented checks and their renderer limitations below remain evidence, not a substitute for that owner sign-off. The one-way mist threshold enters fixed-seed (73021) streamed voxel terrain. Relic's five biomes replace the initial grassland fallback: Meadow, Forest, Canyon and River Lands, Frost Peaks, Desert. Low-frequency biome weights blend heights and surface distributions. River channels are pale stone beds, not water: there was no water block. Worker meshing, gatherable surfaces and session removals remain the block method.

The quiet HUD carries the committed face portrait, explored-only minimap and existing material tally. Ember's peach nameplate starts at waking and follows the bridge rename. Only the approved naming question changed; the way-open and chosen-name/“I'll keep it” beats remain.

Live probes, November 22: all five dominant biomes occur within 368m of arrival (Meadow 0,0; Forest -176,0; Canyon 176,0; Frost -176,-192; Desert -16,368). Each region streamed 25 worker-meshed chunks, evicted the previous distant set, gathered via the existing mining update/tally, and caught an instrumented fall into ungenerated space. A removed arrival block stayed removed after unloading/reloading. No captured errors in these probes. Surface samples distinguish grass/turf/red stone/snow/sand; Forest includes wood/leaves and teal/violet flora, Meadow includes dryfiber/sparkstone. A pale channel sample at 760,-16 is block 13. Across an 800m sampled grid, maximum adjacent biome-weight change was 0.007813 and height step one voxel; visual seam quality still needs playtest. Fresh independent module loads reproduced terrain hash -209129021 over the same 48x48x45 sample.

A live-main harness with only the WebGL renderer stubbed and time advanced manually verified 64 island chunks, night start, optional-name Wake entry, pre-fire phase below 0.72, full dawn at 90 simulated seconds (not before), aurora/bridge activation, bridge naming offer, Ember-to-Willow nameplate update, mist transfer, 25 waking chunks, veil release, hidden bridge/no tutorial realm return, guide following at about 1.68m, portrait loaded, and separate explored maps (29 initial cells; unknown cells are not populated). The source comparison leaves every other guide line unchanged; the way-open and “I'll keep it” lines remain coherent. Main-harness errors: none captured. Real renderer initialization repeatedly reset the automated browser; this is not a full rendered or real-time tutorial playthrough. Native pointer lock, rendered nameplate/portrait legibility, continuous companion beats and aesthetic blending remain unverified.

Awaiting Relic: real pointer-lock tutorial-to-world playthrough; mist-veil continuity and one-way departure; guide presence/nameplate legibility; face and map readability; terrain/biome proportions, blended edges and dry riverbed appearance; mining and streaming feel during long walks; unchanged 90-second dawn, aurora, ritual, loading and mist-catch timing. Instrumentation is not a human feel sign-off. No saving, placing, new crafting, co-op, day/night cycle or new audio.

## Not yet started, in intended order

3. Crafting, tools, real inventory.
4. Block placing and building.
5. Co-op multiplayer.
6. Broader waking-world systems beyond Stage 4 terrain and streaming.
7. Saving and persistence.
8. Broader audio and sparse music (only the gathering hum and quiet first-fire crackle are implemented).
9. Accessibility pass.
10. Open design questions: food without hunting, what survives death, endgame, co-op permissions.
11. Naming the canyon-red material, Relic’s call.
12. GoFundMe campaign, once the tutorial slice is whole.

## Stage 5 — November 22, 2026

Implemented, awaiting live probes and Relic’s feel pass. Top-left player name and three bars, guide portrait/session name/spirit guide box below, framed top-right explored-only minimap, existing tally bottom left. Separate island/waking exploration and bridge rename remain. Health/hunger are full inert bars explicitly labeled not yet active; they await damage and food systems. No health, food or death mechanics.

Space jump: 6.6m/s impulse, existing gravity 18m/s², ideal height 1.21m, existing camera damping 12/s. Shift moving sprint: 6.4m/s vs walk 4m/s (1.6×); stamina 100 points, drain 16/s, regen 12/s when not sprinting, exhaustion lock until 25 points. No drain standing still; no jump cost.

Relic expanded scope to responsive island teaching: after basic movement, jump instruction → wait for actual jump → acknowledgment → sprint instruction → wait for actual moving Shift sprint → acknowledgment → gathering/fire dialogue. Early actions reduce their lessons to acknowledgment. Approved wording lives in sections 09/16; sprint line uses “stamina”, not “strength”. Existing lines unchanged. Only island teaching, single once-only queue, guide delight reacts. Gathering/ritual gameplay itself is not locked by the lessons.

Pending: instrumented deployed-build regression of movement, stamina cutoff, ceiling/body collision, void mist-catch, HUD/rename/map separation and the full tutorial arc; rendered visual quality and real pointer-lock/feel sign-off remain for Relic. No saving, day/night, co-op, placing, new crafting or audio; terrain, sky math, mining and mist timing unchanged. README credits untouched.
