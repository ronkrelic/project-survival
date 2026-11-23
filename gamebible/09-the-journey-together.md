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

The quiet HUD uses soft rounded matte panels with peach/amber accents, not gamey chrome. Top left, two stacked boxes: the player box carries the entered session character name (Wanderer if unnamed), then health, hunger and stamina bars. Health and hunger are full, inert, explicitly marked not yet active: damage, food and death systems do not exist in this slice. Stamina is functional. Directly below, the guide box carries the committed 48px matte Ember portrait, his current session name (Ember by default, following the earned bridge rename), and the small label “spirit guide”. The explored-only minimap is framed at top right; island and waking exploration books stay separate and unknown ground stays hidden. The working material tally remains bottom left. No saving is introduced.

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
