# Project Survival, build status

Designed and Made by Relic & Ember Studios. We wake worlds.

## Started

- Gamebible sections 01–17 — 100%.
- Concept art, 22 pieces — 100%.
- Studio identity, credits, README — 100%.
- Core engine slice (voxel chunks, worker meshing, player controller, prone wake, delta system) — 100% of slice scope.
- Multiplayer — Stage Six implementation committed: PeerJS host/join for up to four total seats; public-broker host boot verified. Live two-player gameplay remains UNVERIFIED (loopback ICE failed in this browser). See Stage Six notes below.
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

Implementation and live renderer-free probes complete; Relic’s rendered/native-pointer-lock feel pass remains. Top-left player name and three bars, guide portrait/session name/spirit guide box below, framed top-right explored-only minimap, existing tally bottom left. Separate island/waking exploration and bridge rename remain. Health/hunger are full inert bars explicitly labeled not yet active; they await damage and food systems. No health, food or death mechanics.

Space jump: 6.6m/s impulse, existing gravity 18m/s², ideal height 1.21m, existing camera damping 12/s. Shift moving sprint: 6.4m/s vs walk 4m/s (1.6×); stamina 100 points, drain 16/s, regen 12/s when not sprinting, exhaustion lock until 25 points. No drain standing still; no jump cost.

Relic expanded scope to responsive island teaching: after basic movement, jump instruction → wait for actual jump → acknowledgment → sprint instruction → wait for actual moving Shift sprint → acknowledgment → gathering/fire dialogue. Early actions reduce their lessons to acknowledgment. Approved wording lives in sections 09/16; sprint line uses “stamina”, not “strength”. Existing lines unchanged. Only island teaching, single once-only queue, guide delight reacts. Gathering/ritual gameplay itself is not locked by the lessons.

Live Pages probes, November 22 (manual time, simulated pointer lock, only WebGL renderer stubbed): 64 island chunks, night phase 0 and world-ready Wake gate; entered Relic Test shown, three bars, loaded 48px portrait, Ember/spirit guide, separate top-left boxes, framed top-right map and bottom-left tally without overlap at 1440×765. Health/hunger remain 100; live stamina bar follows the controller. Unknown map cells absent; island/waking books stay separate (164/29 cells after crossing). Bridge rename to Willow updated both HUD and world nameplate.

Movement probes: actual island and waking jumps each rose 1.19355m at 5ms updates and returned to ground. Isolated flat-world live controller measured 4m/s walk, 6.4m/s sprint, 1.6×; stamina fell to 84 after 1s, cut sprint at zero, recovered at 12/s and resumed after about 2.10s at 10ms sampling once 25 points recovered. Standing Shift neither drained nor acknowledged. Held Space over 2s produced one takeoff. Low-ceiling testing exposed incorrect upward snapping; fixed in fresh commit 5fa9063 and re-probed deployed code: no solid overlap, ceiling-limited feet at 1.2m, returned to floor. Tutorial boundary and void-jump catches passed; actual island and waking airborne void probes returned safely. Existing 1.65s mist animation unchanged.

Observed normal dialogue acceptance order: greeting → steps → jump-teach → jump-ack → sprint-teach → sprint-ack → gather → cold-circle → enough-fire → way-open → ask-name → given-name → keep-name. Waiting after instruction produced no acknowledgment until actual action. One existing queue, no duplicate IDs or overlapping active lines. Fresh early-action run: actual jump/sprint before steps produced steps → greeting → jump-ack → sprint-ack, no jump/sprint instructions; the existing greeting threshold may trail very early movement. No re-teaching during a waking-world update.

Tutorial regression used injected gathered attention/materials and a camera aimed at the hearth, not a full mining playthrough: actual ritual hold lit at 2.05 sampled seconds and consumed exactly 3 sparkstone/5 dryfiber. Dawn was below 1 at 89.95s and exactly 1 at 90s; aurora visible, bridge fully manifested after 7s; Ember naming prefill and Willow acceptance passed. Controller walked the whole arch without a catch, entered the waking world, veil released and bridge stayed hidden. No captured runtime errors in either live harness.

Unverified: rendered visual quality, portrait/nameplate/map legibility in real WebGL, visible emotional quality of the guide reaction, native pointer lock, audio, continuous real-time playthrough and movement/landing feel. Relic’s playtest remains necessary; these probes are not aesthetic sign-off. No saving, day/night, co-op, placing, new crafting or audio; terrain, sky math, mining and mist timing unchanged. README credits untouched.


## Stage Six — inventory, journal and first co-op (November 22, 2026)

Implementation present, not human-playtest sign-off. Committed in order: read-only inventory; local status/chat surface; PeerJS host-authoritative session networking; matte avatars and host-mixed voice; authority/failure hardening; canon and this status record. Every source edit used the GitHub web editor, committed directly to main, then exact immutable-commit content readback. README credits untouched.

- Inventory: I toggles, Esc closes, material counts/swatches, world keeps running. No use/equip/drag.
- Journal: bottom-right, pickups and actually-spoken local guide lines, 100-entry bound, old entries fade gently to 55% after 30 seconds. Multiplayer text uses character names, 280-character cap, Enter focus/send and Esc cancel; movement/jump/I are suppressed while typing.
- Network: Wake remains the original solo entry. Multiplayer offers Host/Join and Wake alone fallback; six-character unambiguous ABCDEFGHJKLMNPQRSTUVWXYZ23456789 code, retained in HUD. PeerJS 1.5.5 is pinned on jsDelivr, NOT vendored (deviation from the preference to vendor). Free default public broker, no keys/accounts. Up to 4 total; host umpire/relay, session-only fixed seed 73021. State at 15 Hz; exponential local interpolation. Host-approved realm-tagged block ledger and lit hearth; streamed/late-join edits replayed. Host tracks guest yields and validates fire cost/proximity. Failed ICE channels and unintroduced guests release their seat.
- Presence: first-pass soft-beveled matte voxel people, character-name plates, facing and walk bob; hidden across realms. No spirit data enters the protocol. Each guide, naming arc and crossing stays local. Shared dawn is explicitly VETOABLE by Relic: first valid ritual lights everyone's hearth and starts their own dawn. Already-warm arrivals avoid cold-circle scolding and another payment.
- Voice: microphone requested on Host/Join; PeerJS host–guest media calls with per-guest host mixes. HUD Mic on / Mic muted toggle; Hear voices handles autoplay restrictions. No positional audio. Microphone denial leaves text/gameplay available. Soft code/disconnect/host-left notices; guests can continue alone without host migration, retaining received edits.

### Live Pages probes and limits

Observed on the deployed client at https://ronkrelic.github.io/project-survival/ (instrumented page probes; some runs renderer-stubbed after native WebGL context creation failed). Host boot completed with all 64 island chunks and public-broker Peer ID project-survival-six-A28TVP; generated code A28TVP stayed in HUD. Another host attempt obtained C4H6F7. No captured page error/unhandled rejection in the functioning host probe. This is not a claim that the browser's initial WebGL context failure was absent.

Passed controlled probes: I open/I close/Esc close; injected wood count 7 displayed; game/guide clock advanced while inventory open; material gain logged; an actually-spoken existing guide line logged once; scrollback capped at 100. Enter focused chat, WASD/Space/Shift/I left movement keys empty, no queued jump and inventory closed; Enter posted a local host message with Wanderer sender; Esc discarded the draft. Host broke island block (0,40,0), ID 1 -> 0 with a realm-tagged ledger entry. An injected remote player's avatar/name/facing reached the expected position and hid both figure and nameplate when its realm became waking. Injected ritual materials consumed 3 sparkstone + 5 dryfiber and released dawn to 1 with a 90-second update. The entire stage-five main.js prefix remains byte-for-byte unchanged; terrain, controller, mining durations, sky equations and mist-catch files were not edited. These are instrumented checks, not a continuous human mining/ritual playthrough.

A real loopback PeerJS client obtained its own public-broker ID and the host received a pending connection, but both ICE peer connections reached failed/disconnected and no data channel opened. Therefore connection by code end-to-end, actual two-way chat, replicated position/block/hearth, real remote avatars, multi-person voice and cross-network reliability are UNVERIFIED. Static wiring exists, but these are not passed multiplayer tests. The browser supplied no microphone stream in the successful host probe. Real audio, avatar appearance, native pointer-lock/visual feel and two-human gameplay need Relic + a friend on separate devices/networks. Three/four-player capacity and voice mixing also need human tests. No saving, day/night, placing, new crafting, positional audio, accounts or random seeds added.

Next real test: host in one browser, share the HUD code with a friend, join by code, move and turn, exchange text both ways, mine the same block, light either hearth, cross separately, and test mute/Hear voices plus host leaving. If direct WebRTC fails on those networks, TURN/relay support remains an explicit follow-up, not a silently assumed guarantee.
