# Resources and materials

Designed by Ember, November 20, 2026; approved by Relic, November 20, 2026 - canon.

## Matter has an age

Settled matter is safe, common, and in the light; fresh matter is rare, powerful, and in the dark. Where you find a thing tells you what the world is like there.

## The first evening

- Sparkstone strikes sparks.
- Dryfiber comes from grass tufts.
- In the threshold slice, three sparkstone and five dryfiber are enough. Twigs belong to the fuller evening beyond this small first ritual.

## Building materials

- Grey stone.
- Softwood and hardwood timber.
- Thatch and moss.
- Hearthclay: heat-holding clay, the material of every hearth.

## Fire-ladder fuels

- Twigs.
- Split wood.
- Embercoal: compressed ancient burn in deep-dark seams; the first reason to mine toward the hum.
- Heartwood: from the oldest lit-forest trees; beacon fuel.

## Light-carriers — idea 42

- Glowwood: lit-forest timber with light along its grain.
- Lanternvein: ore conducting firelight further than it should; one hearth lights a lined hall.
- Mothdust: shed by lantern-moths at lit camps; gathered, never taken. Used for glow-paint and filaments.
- Emberglass: crystal forming at long-burning fires; lantern cores.

## Dark-fighters

- Deepstone: stubborn and light-smothering; for frontier outposts.
- Memory-ash brick: burned-fire ash brick that remembers being lit and resists unmaking. Ancient ash at monolith bases makes walls from the previous people's fires: idea 35 made holdable.

## The first fire, in the threshold slice

Pale sparkstone glints in six seams near the waking hollow. Grass gives earth and a little dryfiber. Bring three stones and five fibers to the cold circle; hold a steady hand there for two seconds. The gathered things become warmth, once, for this waking. No crafting bench, no menu. Only then may the rosy cusp become full dawn: a slow ninety-second opening.

## Regional signatures

One signature per biome; each deepens when its monolith lights.

- Forest: glowwood.
- Frost: glimmerfrost, settled luminous insulating ice that stops melting.
- Desert: duskglass, fused sand holding warmth deep into night.
- Canyon: a canyon-red material, UNNAMED. Relic wants to name it; the name remains open.

## Deep rarities

- Starfall: sky metal falling only in unlit regions. The best tool material lives in the dark.
- Firstmatter: undecided thin-place blocks; a wildcard ingredient that becomes what a recipe needs.
- Stillwater: from unmade regions; never flows. Uses remain TBD.

## Fauna products

Mothdust, warmdown, and lit-meadow feathers are sheds or findings only: gathered, never killed for. Hunting remains undecided in [section 08](08-a-world-that-remembers.md).

## Gathering: matter loosens before it leaves

Hold, rather than strike. A quick touch takes nothing. Earth gives after 0.4 seconds; leaves after 0.45, wood after 0.9, stone after 1.5. Teal and violet flora loosen after 0.4. The held block warms gently, small motes lifting before it comes apart. Released matter drifts toward us and fades; gathering is an invitation, not an impact. Let go or look away and the loosening settles back.

For the playable slice, terrace grass yields earth; ochre and rose strata yield stone; trunks yield wood; leaves yield leaf bits; teal and violet flora each yield their own bits. A quiet carried-material line remembers these for this session. These are provisional gathering names, not new recipes or a decision on Relic's canyon-red name.

Some things answer without leaving. The monolith hums and brightens under a held hand, but cannot be gathered. Beneath the island, two layers of dark, banded foundation stone also refuse unmaking. The floor is old enough to hold us. The gathering rules belong to blocks, not this island, ready for the realm beyond it. No placing, tools, crafting, or saving yet.

## Open questions / gaps

- Wider-world yields and distribution (slice yields above are implemented).
- Wider-world block tables.
- Canyon material name — reserved for Relic.
- Stillwater uses.
- Recipes.
- Starfall mechanics.
- Embercoal regeneration.
- 

## Stage Eight resource contract — Relic, November 22, 2026

This revision replaces the earlier no-tools slice and the briefly implemented loose-stone idea. There are NO loose stones in the final stage. Hand-chop a tree slowly, then use that wood to make the first tools. All first-tier recipe cards are wooden:

| Result (one) | Consumed materials |
| --- | --- |
| wooden axe | 3 wood |
| wooden hoe | 3 wood |
| wooden pickaxe | 3 wood |
| wooden shovel | 3 wood |

Costs are a **vetoable proposal**, wood-only with no binding or stone prerequisite. Matching tools apply automatically; no tier speed differences, durability, equip or hotbar. Dirt-like IDs 1/11/14/15 and farmland 17 use a shovel; trunk 5 and leaves 6 use an axe; stone 2/3/12/13 uses a pickaxe. Future ore blocks must join that stone class when introduced; this build has no separate ore block.

| Material | Matching tool | Hands | With tool |
| --- | --- | --- | --- |
| earth, sand, snow, tilled earth | wooden shovel | 1.20 s | 0.40 s |
| trunk wood | wooden axe | 2.70 s | 0.90 s |
| leaves | wooden axe | 1.35 s | 0.45 s |
| stone family / canyon-red | wooden pickaxe | zero progress | 1.50 s |
| sparkstone (ritual exception) | none needed | 1.50 s | 1.50 s |

Times are tuning calls; discrete 0.01-second probes measured wood at 2.71 seconds because of floating-point accumulation. Protected monolith/foundation remain protected. Sparkstone comes from the six pale surface seams, NOT from mist-catch; mist-catch only returns a falling traveler. Grass still grants earth and dryfiber. The 3 sparkstone + 5 dryfiber ritual is unchanged and needs no tool.

**Proposed names, vetoable:** sunmeadow grain (crop and harvested food), sunmeadow seeds. Wild and mature cultivated crops yield 1 grain + 2 seeds; planting spends 1 seed in tilled soil. The grain occupies an ordinary inventory slot; food use/eating and cooking are deliberately absent. There is no hunger activation. Growth is session-only, four visible stages over three minutes, and crop/wild-patch state is local-only in multiplayer this stage.
