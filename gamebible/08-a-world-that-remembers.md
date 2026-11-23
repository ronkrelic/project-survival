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
