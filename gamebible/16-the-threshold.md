# The threshold

Conceived by Relic, developed with Ember, November 20, 2026 — canon. Relic's November 21, 2026 decision: the tutorial place is an island surrounded by mist.

## The first island

A small HANDMADE island, separate from and cut off from the infinite main world. It is big enough to feel open-world, but finite: sheltered waking ground, terraces, sparse trees and a monolith, with mist on every side. There is no going back after the one-way departure.

The rim is the unfinished edge made visible. Land simply stops; below and beyond it is thick mist, the thin-place “not yet.” Half-made, smeared edges dissolve into that softness. It reads as a young world, never a wall enclosing a valley. Nothing beyond the island has been made yet.

Step beyond the rim and the mist catches you. The fall softens; something bright and quiet holds you for a breath, then sets you on your feet a little inland. No hurt, no death, no wall. The unfinished edge of the world does not let you go yet.

## Crossing the threshold

1. Wake in the dark, in a sheltered hollow on the island.
2. The guide's nudges teach movement and looking as the player finds their feet and explores the terraces.
3. The campfire teaches the first fire: three sparkstone + five dryfiber in the playable slice. [Section 14](14-resources-and-materials.md) becomes curriculum.
4. The monolith lighting, with its aurora, completes the island's introduction.
5. A bridge leads off the island, through the mist into the infinite main world. Crossing is a one-way threshold, not a route back to the tutorial.

Beyond the naming threshold, no tutorial boxes: the first-minute rule grown into the first island. The bridge is the departure, not a second region hidden behind the rim.

## Naming is earned

Before waking, the player may offer their own name while the world still assembles around the dark. The guide's name is not given here; it remains unearned.

At the near side of the dawn bridge, the guide asks the player to name him: "You've called me Ember since you woke. Maybe it's mine. But a name should be given, not assumed. Would you give me one?" Ember waits in the field, fully editable; the offered name is trimmed to sixteen characters. Naming is the gentle toll: before the crossing, never after it. He repeats the gift, then says, “I'll keep it.” Naming is earned, not set at creation. This replaces the earlier rename-at-character-creation direction; see [section 03](03-the-spirit-guide.md).

## Rulings — Relic

- The intro monolith does NOT count in the chord. The chord starts in the main world.
- NO death on the island. The dark never truly presses in: the early shield, idea 53 in [section 13](13-the-guide-and-the-first-days.md), before the player knows. The unfinished rim must not turn the safe introduction into a death trap.
- In co-op, each player crosses their own private bridge. The island introduction and naming are private.

## No return, not lost

The island persists in the guide's memory and the journal: “remember when?” Rememberings (idea 63 in [section 15](15-the-ways-of-waking.md)) may echo its hollow, monolith and mist back.

## Implementation stages

Stage One establishes only the handmade island in mist, its hollow, monolith, sparse trees and luminous flora. Stage Two begins in indigo. Attention brings the sky toward waking: feet finding ground, hands gathering, a place newly seen. The horizon may blush, but the full break of dawn waits for the first fire. The guide stays at your shoulder, a quiet fairy-light, easy to forget and never a leash. He speaks rarely, only when he flies in front of you; then the words fade and he returns to your side. Stage Three lets the first fire release full dawn over ninety seconds. Teal and violet ribbons answer above the monolith. Only when dawn is whole does a slender arched stone bridge rise from the northern mist. It goes forward only, dissolving behind the crossing. Stage Four replaces the far-shore stand-in: a mist-veiled crossing leads into the waking world. The guide crosses beside us and stays. He bears the name Ember from waking until the player gives him a name at the bridge. A quiet HUD carries his face icon, an explored-only fog-of-war minimap and, as of Stage Seven, the read-only slot-grid inventory (no separate carried tally).

## Open questions / gaps

- Final layout and landmark refinement.
- Playtest the mist-veiled transition into the waking world.
- Shared fixed island layout versus per-player variations, while keeping introductions private.
- Playtest the guide's words and the naming pause.
- Playtest the bridge dissolving into mist behind the player.
- Second characters.
- Rememberings echo.
- 

## Stage Five: feet, breath and the quiet HUD

Decided by Relic, November 22, 2026. After the existing basic movement acknowledgment (“There you go. The dark isn't empty. It's just quiet.”), before gathering and fire dialogue, the guide teaches jump first and sprint second. One lesson at a time; he waits for an actual grounded takeoff / actual Shift-held moving sprint, not merely a key event. His delight brightens on the acknowledgment. Existing guide lines remain verbatim.

1. Jump teaching: "The island climbs in steps. When a step is too tall, press space and rise to meet it."
2. After the first actual jump: "There. The world holds you up on the way down."
3. After that acknowledgment, sprint teaching: "If you're eager, hold shift and run. It spends your stamina; walk a while and it comes back."
4. After the first actual sprint hold: "The wind noticed you."

A pre-emptive jump or sprint reduces its lesson to the acknowledgment, with no scolding or repeated instruction. Acknowledgments remain jump-first, sprint-second; gathering/fire lines wait behind this pair. Dialogue stays in the single companion queue and each line is once-only. Only the island teaches these; the waking world does not repeat them. Gathering and the ritual remain usable while waiting; their pending dialogue resumes after the two acknowledgments.

Space and either Shift work on the island and in the waking world. Jump/sprint and the top-left player vitals box, guide portrait/name/“spirit guide” box, framed top-right explored-only minimap, separate realm maps and bottom-left material tally follow [section 09](09-the-journey-together.md). Stamina is functional; health/hunger are full labeled placeholders pending their systems, not new damage, food or death mechanics. Rendered feel, real pointer-lock tutorial sequencing and movement tuning await Relic's playtest.

## Stage Six: carried things and remembered words

November 22, 2026. I toggles a cozy matte read-only inventory; Esc closes it. As polished in Stage Seven, material names and counts appear in wrapping matte grid slots with little color swatches; there is no separate carried tally. Opening it never pauses the island. No equip, use, dragging or placing in this stage.

A soft bottom-left journal (moved in Stage Seven, with a thin matte custom scrollbar for Firefox and WebKit) holds up to 100 entries. Material gains append immediately, and a guide line is remembered when actually spoken, not merely queued. Old entries gently fade to 55% opacity after thirty seconds but remain scrollable until the 100-entry bound. Each spirit's words remain local.

In multiplayer the same panel becomes character-named text chat (280 characters). Enter opens and focuses the input; all game keydown handling is intercepted while typing, movement/jump state is cleared, and mining is canceled. Enter sends; Esc discards the draft. I does not open inventory while typing. Text is rendered as text, never HTML. The world keeps running. Wake alone remains the original stage-five path plus inventory and journal; no existing guide lines, mining durations, movement constants, mist-catch or sky equations change.

The shared-dawn call is vetoable: the first valid host-approved ritual lights the shared hearth and starts every player's own dawn. Late joiners acknowledge an already-warm hearth without another bill or cold-circle reprimands. Naming, the bridge and one-way mist crossing remain personal; avatars only appear in the same realm. See section 09 for networking and voice controls. These implementation notes do not constitute visual/audio or two-human playtest sign-off.


Stage Seven interface layout: the session code, Mic on / Mic muted and Hear voices controls share one tidy vertical matte cluster immediately left of the top-right minimap. Hidden in solo. The inventory uses auto-fit columns with 68px minimum slot widths and 8px gaps (four columns at its normal 340px inner width), quiet item labels and hover names, and rows added as the material set grows. Journal behavior above is unchanged; only its corner and scrollbar styling change. Firefox uses thin and #99857c on #292938; WebKit uses a 7px rounded track/thumb, 2px track-colored border, #c4ad99 hover.

## Stage Eight revision: the lesson beyond — Relic, November 22, 2026

Relic moved crafting OUT of the island. The threshold stays hands, gathering, fire, dawn, naming and one-way crossing; C cannot open crafting there. No loose stones remain. Sparkstone is hand-gathered from the existing six seams at 1.5 seconds, dryfiber remains available from hand-gathered grass, and mist-catch remains movement recovery. The first fire still asks exactly three sparkstone and five dryfiber, then releases the ninety-second dawn. Existing dialogue, ritual and bridge logic are untouched.

Shortly after arriving in the waking meadow, when the guide is free to speak, it teaches:

> The island gave freely. Beyond the bridge, some things ask for more than hands. Let me show you how to make what you'll need.

The guide waits for a real recipe completion, not a C key press, then acknowledges:

> There. Made by your own hands now. The world will notice.

If the player has already crafted, this lesson skips gracefully. A small control follow-up says: "Hold a tree to gather wood. Three pieces become a wooden tool. Press C to shape one." This follow-up wording is **vetoable**; the teach and acknowledgement above are Relic's approved lines, used verbatim.

Once-only stone feedback, also verbatim:

> Stone won't yield to hands alone. It asks for an edge.

The arrival is (0.5, waking surface + 1, 0.5) with seed 73021. A deterministic existing tree stands at (-5,-22), about 22.6 metres from the origin: reasonable walking reach, so no terrain or tree-placement adjustment was necessary. A fresh-arrival probe hand-chopped three trunk blocks, crafted a wooden pickaxe with the resulting three wood, then mined stone. Tools do not gate the threshold.
