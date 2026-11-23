# A world that remembers

All of the following direction was decided by Relic and Ember in conversation, November 20, 2026. Implementation details flagged below remain open.

## Fire is the crafting spine

A ladder of light: spark, campfire, hearth, beacon, monolith. Each tier pushes back more darkness and unlocks what can be crafted near it. Progression and cosmology as one system.

## Unlit structures sag

Darkness does not only erase blocks in caves: player builds without light inside slowly lean, settle, and collapse. Light becomes architecture; every window left glowing is a choice.

## Thin places are rich

The hum in [section 06](06-cosmology-and-the-waking-world.md) grows louder near half-made ground, and the freshest, rarest matter sits there. The danger sense and the treasure sense are the same sense: the deepest dark has the best ore, and the hum finds both.

## The world has a chord

Each region hums a single low note; every lit monolith adds its note to the region's chord. A woken region is audibly fuller — the world gains harmony as it comes alive.

## Waking fauna, not monsters

As a region lights up, life returns in order: fireflies first, then birdsong, then shy larger things browsing lit meadows. Animals are the region's recovery made visible, not loot. In the deep dark there are no creatures at all — only hum. Whether any animals are huntable remains undecided; hunting has not been ruled out.

## Footpaths

A route walked enough times wears into a trail; the world remembers being walked, the same law of attention as everything else. In multiplayer this creates emergent roads between camps — maps of everyone's habits written into the grass.

## Sleep brings dreams

The player can only sleep by fire. Sleeping sometimes brings a short, strange dream — the player's, or the world's: a dark monolith on an unseen ridge, a bright seam under unmade ground. Skippable, never required, never a text dump. The world whispering to a sleeping player.

## Open questions / gaps

- What each fire tier unlocks, and crafting-station behavior.
- Sag/collapse rates, and whether this applies to all builds or only in deep dark.
- Resource distribution rules within the thin-places-are-rich direction.
- Audio implementation and note assignment for the world's chord.
- Creature list and behavior; whether any animals are huntable remains undecided.
- Footpath wear thresholds and visual treatment.
- Dream content system and frequency.

## Stage Eight: first tools and first rows — Relic, November 22, 2026

This playable-stage decision supersedes earlier "no tools/crafting" slice notes; the larger fire-tier vision above remains future work. Relic's revised chain is hands → wood → wooden tools → stone. The island remains a pure, bare-handed threshold; the first crafting lesson belongs shortly after arrival in the waking meadow.

Ownership applies the matching tool automatically: wooden shovel for earth, sand, snow and tilled earth; wooden axe for trunk and leaf blocks; wooden pickaxe for the stone family (including canyon-red and pale stone, and the class future ore must join). Without one, dirt and trees loosen at one-third speed; stone makes no progress. Sparkstone is the ritual exception, still gathered by hand. A wooden hoe opens dirt-like, uncovered ground into dark, painterly-row farmland with E. No equip screen, hotbar or durability in this stage.

Wild sunmeadow grain patches are plentiful in meadow and light in forest. A mature patch gives one food item and two seeds; E plants one seed in an empty tilled block. Four visible stages mature at 0, 60, 120 and 180 session seconds. Mature harvest repeats one grain and two seeds. Food is carried, not eaten: health and hunger remain inert placeholders. No water/watering, cooking, saving, random seeds or additional biomes.

**Vetoable implementation calls:** automatic contextual tools, three-wood costs, timings, E interaction, and the proposed crop/food name "sunmeadow grain" and "sunmeadow seeds". These are implementation proposals under Relic's direction, not extra owner-approved dialogue.

Soil is a host-validated block delta. Crops, wild patches and growth are LOCAL-ONLY per player, not shared or saved; a later multiplayer farming pass must synchronize them. Tool ownership and recipe execution are local, with host-side receipt/cost reconciliation on block requests to reject illegal guest mining/tilling.


## Stage Nine — nourishment as care — Relic, November 23, 2026

This section supersedes the earlier inert-health/hunger and carried-but-not-eaten Stage Five/Eight notes. Relic’s design: hunger drains slowly; empty hunger costs health; zero health means fainting, NEVER death. The guide feeds the traveler, who wakes where they fell with inventory, tools and position intact. No drops or penalties beyond lost time. All nourishment and the guide are strictly per-player LOCAL state. No multiplayer message types or protocol changes; host validation and ordered craft receipts stay as before.

**Vetoable implementation tuning:** hunger/health 0–100; hunger drains 1 per 15 play-seconds (25 minutes full to empty), starvation costs 1 health per 5 seconds. Grain restores 25 hunger. Health regenerates 1 per 5 seconds at hunger **90 or above** (a proposed nourished zone, not Relic’s literal full-only wording). Low warning at 25 or below, re-armed only by eating to at least 40. Fainting lasts four seconds with a soft dark fade; revival restores hunger 30 and health 20. To make “20 and climbing” real, guide-fed care grants 25 seconds of recovery at 1 health/5 seconds even below 90 (up to 5 extra health); it does not stack with nourished regeneration. This temporary feeding-care exception is vetoable. No offline catch-up; active session time only. Stamina is unchanged.

Health is only a nourishment story in this stage: no foes, fall damage, death, durability, cooking, drinks, new food, saving or terrain/movement/sky changes. The island threshold runs no nourishment clock at all; it cannot starve or faint a traveler.


## Stage Ten — The settling-in update

Designed by Relic · November 23, 2026. Implemented proposals below remain vetoable by Relic; they are not prior approved dialogue.

### Making a home
Waking-world right-click places the selected carried earth, sand, snow, stone, echostone or wood against the aimed face; left hold remains mining. Button choice is vetoable. Empty cells only, never intersecting a player. One material is spent only on accepted placement. Host validates guest balance through the existing yield/receipt ledger before applying deltas. No island placement.
The waking day lasts 840 seconds (14 minutes), with 600 seconds of daylight and 240 of soft night, vetoable tuning. Dawn, daylight, dusk, stars and aurora provide rhythm without danger; minimum phase light is 0.26, never full black. Hearth glow strengthens at night. Clock under the minimap reads, for example, Day 2 · 06:00 · Dawn (vetoable format). World clock and day count persist; no offline catch-up. No new first-dusk guide line was added.
World deltas, tilling and local crop ages persist with the world. Crop stages remain 0/60/120/180 seconds; harvest remains one grain and two seeds. Multiplayer crops are still local-only, explicitly unfinished shared-world work. Island keeps its authored dawn, unchanged ritual, dialogue and bare-handed completion.
