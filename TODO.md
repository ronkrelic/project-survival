# Project Survival, build status

Designed and Made by Relic & Ember Studios. We wake worlds.

## Started

- Gamebible sections 01–17 — 100%.
- Concept art, 22 pieces — 100%.
- Studio identity, credits, README — 100%.
- Core engine slice (voxel chunks, worker meshing, player controller, prone wake, delta system) — 100% of slice scope.
- Multiplayer — Stage Six implementation committed: PeerJS host/join, up to four total. Public-broker host boot verified; live two-player behavior UNVERIFIED (loopback ICE failed). See Stage Six below.
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

3. Further crafting progression and inventory interactions (Stage Eight wooden tools complete; see below).
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


## Stage Six — November 22, 2026

Implemented in order, each chunk committed through the GitHub web editor and read back exactly: inventory, journal/chat surface, host-authoritative PeerJS transport, avatars/voice, authority and failure hardening. README credits untouched. This is implementation, not human playtest sign-off.

Inventory: I toggles, Esc closes; carried counts and matte swatches, world still runs. No use/equip/drag. Stage Seven below supersedes this original list inventory and bottom-right journal layout. The journal records pickups and actually-spoken local guide lines; 100 entries, gentle fade to 55% after 30 seconds. Multiplayer text has character names, 280-character cap, Enter focus/send, Esc cancel, and all game keys suppressed while typing.

Wake stays the original solo entry. Multiplayer offers Host/Join and Wake alone fallback; six-character ABCDEFGHJKLMNPQRSTUVWXYZ23456789 code retained in HUD. PeerJS 1.5.5 currently loads from pinned jsDelivr CDN, NOT vendored: explicit deviation from the preference to vendor. Default free public broker, no accounts or keys. Four total seats; host umpire and relay; fixed seed 73021, 15 Hz position/facing/realm, local interpolation. Host-approved block ledger and shared lit hearth replay for late joins/streamed chunks. Guest yields and ritual costs are host-accounted. Failed ICE channels and unintroduced connections release seats.

First-pass soft-beveled matte voxel avatars have character-name plates and walk bob, hidden across realms. Spirits are never serialized: guide body/nameplate/dialogue, lessons, naming and personal crossing stay local. Shared-dawn ruling is explicitly VETOABLE by Relic: any valid ritual lights everyone's hearth and releases local dawn; already-warm arrivals avoid another bill and cold-circle scolding.

Voice requests the microphone on Host/Join. PeerJS host–guest calls use per-guest host mixes, non-positional. HUD Mic on / Mic muted toggles local mic; Hear voices resumes autoplay-blocked sound. Microphone denial leaves chat/gameplay. Bad-code/disconnect/host-left notices are soft; guests can continue alone with received edits, without host migration. No saving, day/night, placing, new crafting, positional audio, accounts or random seeds.

### Live verification and limits

Controlled probes on https://ronkrelic.github.io/project-survival/: host registered project-survival-six-A28TVP with the public broker, displayed A28TVP and booted all 64 island chunks. Another host obtained C4H6F7. Some probes used the explicitly permitted renderer stub after a native WebGL-context creation failure. Functioning host runs captured no page errors/unhandled rejections; this does not erase the initial WebGL/browser failures.

Passed: inventory I open/I close/Esc close, wood count 7, guide clock advancing with inventory open; pickup log; actually-spoken guide line logged once; 100-entry scrollback bound. Enter focused chat; WASD/Space/Shift/I left movement keys empty, no jump queued and inventory closed; Enter posted host message with Wanderer sender; Esc discarded draft. Host block (0,40,0) changed ID 1 to 0 and entered realm-tagged ledger. Injected remote avatar reached expected position/facing/name and both body/nameplate hid across realms. Injected ritual materials consumed 3 sparkstone/5 dryfiber and dawn reached 1 after a 90-second update. Entire Stage Five main.js prefix is byte-for-byte unchanged; player, terrain/generation, mining, meshing, worker and materials files were not edited. These are instrumented probes, not a continuous real-input playthrough.

A loopback PeerJS client obtained a broker ID and reached the host's pending connection; both ICE connections became failed/disconnected without an open data channel. Live code-based joining, two-way chat, replicated positions/block/hearth, real remote avatars, cross-network reliability and voice are therefore UNVERIFIED, not passed. The successful host probe supplied no microphone stream. Native visual/portrait/avatar quality, pointer-lock feel, actual two-human voice and three/four-player behavior need real testing. The final cleanup commit closes failed ICE channels; its wiring is statically checked, not a successful-network proof.

Next test: Relic + a friend on separate devices/networks, join by the HUD code, move/turn, text both ways, mine the same block, light either hearth, cross separately, test mute/Hear voices and host leaving. Strict-network TURN/relay support remains follow-up, not a guaranteed capability. No aesthetic or two-human sign-off is claimed.


## Stage Seven — November 22, 2026

Relic playtested Stage Six tonight and reported “it works”; the earlier instrumented limitations above remain historical evidence, not a denial of that playtest. Scoped HUD polish implemented through the GitHub web editor, one thematic chunk committed to main at a time, with commit-pinned exact source readbacks. README credits untouched.

- Multiplayer session code, Mic on / Mic muted and Hear voices remain one vertical matte panel, now top-right immediately left of the minimap: top 18px, right 168px, width 154px, compact full-width buttons. At <=440px: right 136px, width 130px. Hidden in solo.
- Removed carried tally creation, styling, HUD attachment and all repaint references from main.js and mining.js. Inventory is the only carried-material display. Material proxy journal logging remains. No mining or ritual behavior changes.
- Journal moved to left 18px / bottom 18px; existing size, log, guide, chat, typing guards, 100-entry cap and fade retained. Firefox scrollbar-width thin; scrollbar-color #99857c #292938; stable gutter. WebKit width 7px; #292938 rounded track; #99857c thumb, 2px track-colored border, 8px radius; hover #c4ad99.
- Inventory is read-only matte slots, auto-fit/minmax(68px,1fr), 8px gaps, 50vh scroll limit. Four columns at the normal 340px inner width, wrapping to fewer columns on narrow screens and more rows for new materials. Swatch, count, small name and hover title in each slot. I/Esc and simulation remain unchanged. Empty-bag message retained.
- Gamebible 09 and Stage Six interface canon in 16 updated to this layout.

### Live Pages instrumented verification

On https://ronkrelic.github.io/project-survival/ at 1440×765, November 22: fetched deployed main/mining with cache-busting after Pages deployment; WebGL renderer stubbed, all other game modules real. A first cached-module attempt loaded the old mining tally, so it was discarded and a fresh cache-busted probe repeated the checks. Clean probes loaded 64 island chunks with no captured error/unhandledrejection. This is not rendered/native-pointer-lock sign-off.

Solo cluster computed display:none; tally absent (zero matching DOM elements). Injected material gains logged immediately. Inventory showed wood 7, stone 12, dryfiber 5, sparkstone 3, with four computed 79px columns; I opened and Esc closed. Guide clock advanced while open. Enter focused chat; WASD/Space/Shift/I left keys empty, no jump queued, inventory closed; Enter logged the local message, Esc discarded the draft. 105 injected entries retained exactly 100. Existing fade timing retained unchanged in source.

Injected host state and actual boot/transport handlers (no PeerJS connection) gave the multiplayer panel x1118/y18/154×109 and minimap x1284/y18/138×138: 12px gap, no overlap. Journal x18/y619/346×128, bottom 18px, clear of vitals and map; with maximum scrollback its height remains bounded. Computed scrollbar: thin; rgb(153,133,124) rgb(41,41,56); stable gutter; WebKit width 7px and thumb rgb(153,133,124). Host send broadcast, host guest-request relay and guest receive handlers produced named journal messages using an in-memory fake connection; that tests flow wiring, not network delivery.

Unverified here: rendered appearance, Firefox engine rendering (properties checked in Chromium), real two-device chat/voice/NAT, native pointer lock, and narrow-screen overall HUD overlap. No gameplay, dialogue, network protocol, terrain, sky or movement changes; transport/voice behavior not redesigned. Relic’s visual pass remains the aesthetic check.

Final follow-up: final Pages deployment succeeded. Old journal rows computed opacity 0.55. The injected fake connection lacked psName/close, so after the admission timeout the real seat-cleanup timer raised c.close is not a function; this is a probe-harness error, not evidence of a production PeerJS failure. The fake was corrected and error capture restarted. No source fix was needed. Maximum 100-row journal geometry remained bottom-left and bounded.

## Stage Eight — Relic, November 22, 2026

Implemented through the GitHub web editor, one chunk committed to main and commit-pinned exact readback before the next. README credits untouched. Later design revision supersedes the early stone-cost recipes, loose-stone experiment and island crafting beat: no loose stones remain, and crafting/lesson are waking-world only.

- C opens matte crafting beside the existing I inventory. Four wooden cards show result and owned/required materials, disable unaffordable actions, consume materials and journal successful crafts. Wooden axe, hoe, pickaxe and shovel each cost **3 wood**; exact costs/brown swatches are vetoable. No stone prerequisite. Automatic contextual ownership, no equip, hotbar or durability (vetoable implementation calls).
- Hands loosen dirt/wood at 3x normal duration. Stone/canyon-red cannot progress without a wooden pickaxe. Dirt 1.20s hands / 0.40s shovel; wood 2.70s hands / 0.90s axe; leaves 1.35s / 0.45s axe; stone infinite hands / 1.50s pickaxe. Sparkstone remains a hand-obtainable 1.50s exception from the authored spark nodes; mist-catch is recovery, not its source.
- Guide teaches shortly after waking-world arrival, waits for a real craft, acknowledges, skips gracefully if already crafted. Approved lines unchanged: “The island gave freely. Beyond the bridge, some things ask for more than hands. Let me show you how to make what you'll need.” / “There. Made by your own hands now. The world will notice.” Stone hint once: “Stone won't yield to hands alone. It asks for an edge.” Existing deterministic tree near (-5,-22), about 22.6m from arrival, needs no terrain-generation change.
- E tills uncovered dirt-like soil with a wooden hoe, plants one seed in empty farmland, or harvests mature crops. ID17 farmland has painterly dark rows. Proposed/vetoable names: **sunmeadow grain** (food), **sunmeadow seeds**. Meadow wild patches, lighter forest patches; harvest 1 grain + 2 seeds. Four visible growth stages at 0/60/120/180 seconds, session-only. Food/seeds appear in the grid.
- Soil till deltas travel through the host. Host validates location/range/realm/material/clear top and tools. Relic expressly approved ordered craft receipts on existing block requests: reconcile 3-wood costs against the host guest-yield ledger; no new message type. Host does not validate held-mining duration.
- **KNOWN MULTIPLAYER LIMITATION: growing crops and wild patches are LOCAL-ONLY, not synced.** Tools/recipes/mining are per-player local state; crops/food/seeds are not shared. Later multiplayer farming must address this.
- PeerJS 1.5.5 browser bundle and MIT notice vendored in docs/js/vendor/peerjs.min.js. Local-only primary loader, no CDN fallback. Public broker still required; Three.js retains its pre-existing CDN dependency. This is not an offline game.
- **Eating is deliberately OUT OF SCOPE. Health/hunger bars remain inert placeholders.** No cooking, watering/water system, durability, equip/hotbar, new biomes, saving, random seeds or changes to movement/sky/terrain generation/ritual/existing dialogue.

### Live Pages instrumented verification and limits

November 22, https://ronkrelic.github.io/project-survival/: renderer stub, controlled time, real fetched modules/voxel arrays/controller; captured error and unhandledrejection arrays empty in successful probes. Native WebGL attempts timed out; these are not rendered playtest sign-off.

Passed C opening, four unaffordable cards disabled and empty craft rejected; actual hand-chop three tree blocks -> 3 wood -> wooden pickaxe consumes 3/grants 1 -> stone mines. Measured dirt 1.20/.40s, wood 2.71/.90s at .01s sampling; stone unchanged with zero accumulated progress after 3.50s bare hands, removed after 1.50s with pickaxe. Hand sparkstone 1.50s. All four recipe declarations are 3 wood; pickaxe and hoe actual consume/grant paths exercised.

Bare-handed regression gathered actual 3 sparkstone and 5 dryfiber, lit the unchanged ritual, consumed exactly 3/5, advanced dawn 90 simulated seconds and bridge manifestation 7.1s. Named guide and actual controller walked the arch and transitioned to waking without tools. Stage Eight probe invoked ritual.light directly; 2-second aimed hold was not re-run (Stage Five hold probe remains historical evidence). Not one continuous real-time human-input run.

Natural guide queue teach -> actual crafting -> acknowledgment completed; pre-crafted state skipped. Wild harvest gave 1 food/2 seeds; crafted hoe, till produced ID17, planting consumed 1 seed, premature harvest rejected; precise controlled stages [0,1,2,3] at 60-second intervals; mature harvest food/seeds and food inventory slot verified. Final leaf classification and six-row soil mesh had exact source readback, not a new rendered check.

Host receive handlers with a fake open guest connection rejected no-hoe till and no-pickaxe stone; legal 3-wood receipts consumed host-accounted wood, accepted till/stone and broadcast. Guest receive handler applied relayed ID17. This tests host validation/relay wiring, not two-device delivery. Actual local PeerJS bundle fetched 200; actual host boot reached 0.peerjs.com and generated W4BQ9U. Microphone was stubbed. Real two-device WebRTC/voice, native pointer lock, visual quality/soil rows/crop silhouettes, narrow-screen crafting feel and continuous end-to-end human play remain unverified. No external broker account/config change.


## Stage Nine — nourishment as care — Relic, November 23, 2026

This section supersedes the earlier inert-health/hunger and carried-but-not-eaten Stage Five/Eight notes. Relic’s design: hunger drains slowly; empty hunger costs health; zero health means fainting, NEVER death. The guide feeds the traveler, who wakes where they fell with inventory, tools and position intact. No drops or penalties beyond lost time. All nourishment and the guide are strictly per-player LOCAL state. No multiplayer message types or protocol changes; host validation and ordered craft receipts stay as before.

**Vetoable implementation tuning:** hunger/health 0–100; hunger drains 1 per 15 play-seconds (25 minutes full to empty), starvation costs 1 health per 5 seconds. Grain restores 25 hunger. Health regenerates 1 per 5 seconds at hunger **90 or above** (a proposed nourished zone, not Relic’s literal full-only wording). Low warning at 25 or below, re-armed only by eating to at least 40. Fainting lasts four seconds with a soft dark fade; revival restores hunger 30 and health 20. To make “20 and climbing” real, guide-fed care grants 25 seconds of recovery at 1 health/5 seconds even below 90 (up to 5 extra health); it does not stack with nourished regeneration. This temporary feeding-care exception is vetoable. No offline catch-up; active session time only. Stamina is unchanged.

Implemented in docs/js/main.js only; player/stamina, mining, world generation, materials, meshing, ritual and protocol code are unchanged. Health is purely a nourishment story: no fall damage, foes or other damage source. Guide revival is local; a special fainted remote-avatar pose is a possible later nicety, NOT implemented. README credits untouched.

Controlled-time verification is recorded below; native rendered feel and real two-device multiplayer remain unverified.


### Stage Nine live verification — November 23, 2026

On https://ronkrelic.github.io/project-survival/, controlled-time probes ran live fetched modules with a renderer stub and captured error/unhandledrejection arrays empty. Native WebGL was not a reliable probe route; these are not visual-feel sign-off. Final live JS (including the pointer-release/eat-label follow-up) was re-fetched and exercised in an isolated same-origin harness.

Passed: island full remains 100/100 after 1500 simulated seconds; island hunger 0 / health 1 stays unfainted after 1000 seconds. Waking hunger loses exactly 1 in 15 seconds and reaches floating-point-near-zero after 1500 seconds; starvation loses 1 health in 5 seconds. Warning fires once during repeated low updates, eating above 40 re-arms it, next low crossing fires again. Both approved lines actually appeared in the speaking guide DOM, verbatim.

Faint produced dark veil opacity 1, then after four controlled seconds revived at hunger 30 / health 20 with serialized inventory (including tools) and x/y/z unchanged. Feeding-care produced health 21 after another five seconds. Nourished regeneration gave 50 → 51 in five seconds at hunger 95; below 90 it stopped. Real grain button clicks consumed one and restored 25, logged the proposed journal line; two full-hunger attempts consumed nothing and logged exactly one gentle decline. Final I-key probe released pointer lock via a spy, cleared held keys/mining, opened the inventory and exposed the visible/accessibility eat hint. Actual native pointer-lock behavior/feel remains unverified. HUD values track live health/hunger; stamina source unchanged.

Bare-handed island regression used real voxel mining: three exposed sparkstone and five grass blocks (grass yields earth plus dryfiber); actual aimed 2-second ritual hold lit fire and consumed 3 sparkstone / 5 dryfiber. Controlled dawn 90 seconds and bridge 7.1 seconds reached full dawn/manifestation; naming offered and accepted Ember; real player-controller movement walked the arch and crossed into waking at (0.5, 0.5), carrying the remaining earth and no tools. Positioning/time were instrumented, not one continuous human-input run.

Static exact readback confirms player.js (including stamina), world.js, mining.js, materials.js and meshing.js unchanged; ritual/threshold and host craft-receipt validation source unchanged; all existing outgoing message-type occurrences match the pre-stage source, with no additions. This is no new two-device transport test. Native rendered quality, fade aesthetics, actual pointer-lock feel and real two-device multiplayer remain unverified. README credits untouched; no new food/cooking/drinks/damage/terrain/sky/movement/protocol systems.


## Stage Ten — The settling-in update

Designed by Relic · November 23, 2026. Implemented proposals below remain vetoable by Relic; they are not prior approved dialogue.

### Implemented
- [x] Explicit selected-tool hotbar; quiet selection supersedes Stage Eight auto-apply. Selected hoe required to till; planting/harvesting contextual.
- [x] Inline painted SVG icons in hotbar/inventory/recipes.
- [x] Right-click carried-block placement, collision guard and host material ledger validation using existing message extensions.
- [x] Versioned world/personal saves, ~30-second autosave, Continue and confirm-guarded Begin anew; uncrossed runs Wake fresh.
- [x] Four stone tools (2 wood + 3 stone; 1.5x speed), echostone canon, deterministic hearthglow ore in canyon/frost; stone pickaxe only.
- [x] Lit waking-hearth cooking: bread 3 grain -> 60 hunger/2 health; cakes 2 grain + 2 seeds -> 40 hunger/4 health.
- [x] Saved 840-second rhythm (600 daylight/240 night), clock/day readout, stars/aurora, night floor .26, stronger waking flora/hearth glow.
- [x] Synthesized wind, footsteps, mining, placement, eating, hearth, guide and faint/revival sounds; gesture unlock and mute. No music.

All numeric/name/UI proposals remain vetoable: hotbar/order/keys, no selection journal or drag/drop, hoe selection, right-click, no mid-island save, stone costs/speed, hearthglow ore, both food names/costs/restores, hearth radius 5, cycle split, clock format, mute placement. No new guide line was added. See bible 05/08/09/14/16 for canon and exact save schema.

### Stage Ten instrumented live verification — November 23, 2026
Source: https://ronkrelic.github.io/project-survival/ . Same-origin harness fetched live modules, stubbed renderer and disabled RAF; time and positioning controlled, saves isolated in memory. This is not native rendered-feel sign-off.
Passed: actual Mining.update held-input loop on stone: hands blocked, wooden 1.50s, stone 1.00s; ore wooden blocked, stone 1.60s. Stone axe craft spends 2 wood/3 stone. Selected hoe till succeeds; hands fail. SVGs found in all three panels. Placement spends one earth, creates delta, rejects player intersection; direct host validation accepts funded guest, rejects empty balance and wrong material ID. Invalid mixed craft receipt leaves ledger intact; valid wooden receipt spends 3 wood/grants tool. Deterministic ore found in Frost Peaks (-500,51,-110) and Canyon and River Lands (-500,33,296).
Passed: dark-hearth cooking rejected; lit nearby bread consumes 3 grain, eating moves hunger 20->80 and health 40->42; cake 20->60 and 40->44. Controlled cycle 539+62 -> 601, Night, light .26; rollover -> day2/06:00; night floor .26. Save tick31 writes; Continue restores 2 deltas, 6 crops, clock432/day3, inventory earth4 after mutation; clear removes isolated records. Hardening re-probe confirms clock contains only seconds/day and personal continuity identity exists. Sound AudioContext running, tone succeeds; mute suppresses play and sets master gain0, unmute restores .45.
Passed bare-handed island regression: actual Mining.update against authored voxelAt data gathers 3 sparkstone+5 dryfiber; aimed held 2.05s lights ritual, spends both; controlled authored 90s dawn and 7.1s bridge manifest, naming and crossing reach waking. This used instrumented camera/position and an in-memory voxel removal adapter, not a continuous human walk. Island vitals stay100/100 after1500s; waking starvation faints and 4s revival restores30/20. Harness error/rejection arrays empty.
Integration repairs: web-editor duplicated hotbar content was repaired in a new commit, not amended; data-only saved clock/private ledger continuity hardened; unchanged deltas no longer trigger perpetual remesh. Final flora shader change is exact-readback verified, not shader-render verified.

### Still unverified / future
- [ ] Native WebGL visual quality, 48px icon aesthetics, input/scroll/pointer-lock feel and audio listening/each contextual trigger.
- [ ] Real two-device transport, reconnect continuity and restored host ledger session behavior (direct validator tests only).
- [ ] Full current-build crop growth/harvest regression, confirmation-dialog click path and reload/chunk-remesh save restoration beyond in-memory roundtrip.
- [ ] Shared multiplayer crops remain local-only; do not imply synced farms.
- [ ] Hearthglow ore uses are future; no ore crafting/use yet.
- [ ] Music future; no water/weather/monsters/death/durability/drag-drop/new biomes/mobile added. README credits untouched.
