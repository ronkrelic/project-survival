# The journey together

All of the following direction was decided by Relic and Ember in conversation, November 20, 2026. Implementation details flagged below remain open. The minimap direction below incorporates Relic's modification of the original no-minimap proposal.

## The first valley is the whole game

The first-minute rule now spans the first valley: the same rule at larger scope, as decided in [section 16](16-the-threshold.md). The handmade private valley teaches movement, looking, the bridge, first fire, and monolith lighting before opening into the infinite main world.

The player wakes in the dark, ember in hand, and the guide speaks for the first time. Gather something, make a spark, first campfire before true night falls. Everything the game is — attention, light, the guide — is taught in one evening, with no tutorial UI anywhere.

## The hearth never fully dies

While the player is away, their fires burn down but never out. They return to a single spark waiting, relight it from their ember, and the guide says welcome back. Absence is never punished; return is always warm.

## Passing flame

In multiplayer, a player can carry fire to someone's cold camp and light their hearth for them. It leaves a trace: their fire remembers it was lit by a friend. One small verb that gives co-op a soul.

## Aurora broadcast

When someone lights a monolith, the sky over that region blooms in aurora visible for a huge distance. Every player looks up and knows: somewhere, the world just got bigger.

## Players name the map

Lighting a monolith lets the player name its region; the map fills with names given by the people who woke them. In multiplayer this is a shared atlas of everyone's stories — a world whose geography is its community's vocabulary.

## The map is drawn, with a fog-of-war minimap

The game has a minimap, but it shows only places the player has already been — unexplored ground stays hidden. The map fills in as the player explores, sketched in the same storybook hand as the rest of the art. The full map may live with the guide, viewable by asking him. Cartography as journal, not spoiler.

The minimap is approved direction, replacing the original no-minimap proposal; the full map's home with the guide remains a possibility, not a settled implementation.

## Stage Five HUD and movement — decided by Relic, November 22, 2026

The quiet HUD uses soft rounded matte panels with peach/amber accents, not gamey chrome. Top left, two stacked boxes: the player box carries the entered session character name (Wanderer if unnamed), then health, hunger and stamina bars. Health and hunger are full, inert, explicitly marked not yet active: damage, food and death systems do not exist in this slice. Stamina is functional. Directly below, the guide box carries the committed 48px matte Ember portrait, his current session name (Ember by default, following the earned bridge rename), and the small label “spirit guide”. The explored-only minimap is framed at top right; island and waking exploration books stay separate and unknown ground stays hidden. Stage Seven removes the carried tally entirely; the inventory is the single place to check carried materials. No saving is introduced.

Space jumps on either realm: 6.6m/s takeoff with the existing 18m/s² gravity (ideal rise 1.21 blocks; substeps make the measured peak slightly lower). Hold either Shift while moving to sprint at 6.4m/s versus 4m/s walking (1.6×). Stamina capacity is 100, drain 16 points/s, recovery 12 points/s when not sprinting; depletion returns to walking until 25 points have recovered. Standing with Shift is not sprinting. No jump stamina cost. Existing collision, bounds and mist-catch stay in force.

On the island, after basic movement and before gathering/fire dialogue, the guide teaches jump then sprint, one at a time, waiting for actual performance before acknowledging. Early performance gracefully reduces that lesson to its acknowledgment; nothing is retaught in the waking world. The four approved lines and detailed sequence are canon in [section 16](16-the-threshold.md). This responsive teaching supersedes the earlier Stage Five no-new-dialogue restriction; no existing lines change.

## Open questions / gaps

- Exact opening script and flow.
- Fire burn-down rates, and what happens on death to the fire state in multiplayer.
- The form of the trace left by passing flame.
- Aurora visibility range and duration.
- Region naming rules and renaming.
- Whether the full map lives with the guide and is viewed by asking him.
- Flagged follow-up: [the approved HUD concept art](../concept-art/ember-03-ui-hud-concept.jpg) predates the minimap decision and needs a revision pass. The image is not changed by this design update.
- 

## Stage Six: an island with friends — November 22, 2026

The same optional character name leads to Wake (unchanged single-player) or Multiplayer, then Host / Join. The host offers a six-character code using ABCDEFGHJKLMNPQRSTUVWXYZ23456789; the code stays in a small HUD cluster immediately left of the top-right minimap, above stacked Mic on / Mic muted and Hear voices controls (hidden in solo). Up to four total players, with the host as umpire and relay. This is a session, not an account or a save. The free public PeerJS broker handles signaling; the client currently loads pinned PeerJS 1.5.5 from jsDelivr (not vendored). Network and microphone failure never mean the end of a solo journey.

The fixed seed stays 73021. Position, facing and realm travel at 15 Hz; first-pass soft-beveled matte voxel avatars interpolate locally and carry character-name plates with a simple walk bob. Different realms hide each other. Block-break requests go through the host's canonical terrain/delta ledger; accepted removals broadcast to everyone and replay into streamed chunks and late joins. Guest yields and ritual costs are host-accounted. No placing, broader crafting, random seeds or persistence.

Voice is non-positional: entering Host or Join requests the microphone. PeerJS media calls run host–guest, with the host mixing other guests into each guest's outgoing stream. The HUD's Mic on / Mic muted button controls the local microphone; Hear voices resumes playback if the browser's autoplay policy requires a gesture. Denying the microphone leaves text and walking available. Real audio quality, NAT reliability and avatar aesthetics need human playtesting.

The guide is strictly personal: no spirit body, position, nameplate, dialogue, lesson state or naming is sent. Guide lines enter only the local journal. Each player's bridge, naming and mist crossing remain personal. Shared-dawn ruling (explicitly VETOABLE by Relic): any player's completed fire ritual lights the hearth for all and releases each local dawn. An already-lit circle does not demand another payment or repeat cold-circle scolding; the existing way-open acknowledgment follows the local dawn/bridge. This overrides the earlier suggestion that every island ritual must be independent, not the privacy of the crossing.

Bad codes, failed connection and lost threads use soft notices. A guest whose host leaves continues locally with already-received edits, not host migration. Reloading still begins a new session.


## Stage Seven interface polish — November 22, 2026

The journal/chat now occupies the bottom-left corner, with the same pickup and local guide lines, 100-entry scrollback, 30-second fade toward 55%, and unchanged multiplayer Enter/Esc and typing guards. Its scrollbar is soft matte: Firefox thin, thumb #99857c on #292938; WebKit 7px track, rounded thumb with 2px track-colored border and #c4ad99 hover.

The read-only inventory uses a responsive grid of matte slots: repeat(auto-fit, minmax(68px, 1fr)), 8px gaps, four columns at the normal 340px content width and fewer on narrow screens, adding rows as materials grow. Each cell shows a swatch, count and quiet name/title. I toggles, Esc closes; the world keeps moving. No dragging, equipping or use. Empty bags retain the quiet empty message.

Multiplayer code and voice controls form one 154px-wide vertical matte cluster, top 18px, right 168px, immediately left of the framed map with a 12px gap. At widths up to 440px it narrows to 130px with right 136px. It remains hidden in single-player. No terrain, movement, dialogue, transport or voice logic changes. The former bottom-left carried tally is removed, including mining repaint references; pickup journal logging remains through the material proxy.

## Stage Eight interface and shared honesty — Relic, November 22, 2026

C opens a separate matte cozy "Made by your hands" panel in the waking world, not on the island. It is a companion to, not a replacement for, I's wrapping inventory grid. Four wooden recipe cards show their result and required/owned counts. Unaffordable cards are visibly dimmed and disabled; a successful action rechecks affordability, consumes the materials, grants one tool and leaves a small journal line. C or Esc closes; I closes crafting and shows inventory. Opening crafting releases pointer lock and stops held movement/mining without pausing the world. Health and hunger remain labeled inert placeholders. Food and seeds are ordinary colored inventory slots.

E interacts with the aimed ground: harvest mature grain first, plant a seed in empty farmland next, otherwise till dirt-like uncovered ground if a wooden hoe is owned. The world shows dark rowed soil and four crop silhouettes. These bindings, automatic contextual tools, no durability/equip/hotbar, and the proposed sunmeadow naming are **vetoable implementation calls**.

Multiplayer: tools/recipes/mining remain per-player local state. Soil uses the existing host-mediated block envelope, with an op=till variant. The host rejects illegal coordinates/range/realm, non-dirt/covered tilling and missing tools; stone needs a validated wooden pickaxe, tilling a validated wooden hoe. Minimal ordered craft-receipt metadata accompanies existing block requests; the host reconciles each three-wood cost against its own guest-yield ledger rather than accepting a tool-ownership boolean. This is the explicit protocol extension needed for tool honesty, besides the till variant; there is no new inventory or crop message type.

**Known multiplayer limitation:** growing crops and wild patches are LOCAL-ONLY, not synced. Food/seeds stay local, growth is not saved, and another player's crop view can differ. Later shared farming must settle this honestly.

PeerJS 1.5.5 is vendored at docs/js/vendor/peerjs.min.js with its full MIT notice. The loader uses that local copy only, without a CDN fallback. The public 0.peerjs.com signaling broker and WebRTC networking are still required; Three.js still uses its existing CDN import. Vendoring PeerJS does not make the entire game offline or dependency-free.
