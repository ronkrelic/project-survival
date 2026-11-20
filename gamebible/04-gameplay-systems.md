# Gameplay systems

Agreed by Relic and Ember on November 20, 2026.

First-person 3D browser game. Procedural infinite voxel terrain uses chunked generation; the exact noise/algorithm approach is open.

Block breaking and harvesting yield resources. A crafting system lets the guide help the player learn recipes.

The earlier HUD concept shows health and hunger dials; [section 07](07-the-guide-in-depth.md) now decides the ember glow as the diegetic core condition display, dimming with hurt, cold, or hunger rather than an abstract dial. Mapping details and any secondary display remain open.

Multiplayer eventually: a shared world with per-player private guides.

Darkness unmakes: deep dark slowly dissolves blocks into nothing, while light holds the world together. Campfires are claim stakes and the carried ember provides a ring of safety. This survival direction is decided in [section 06](06-cosmology-and-the-waking-world.md); rates, radii, qualifying light sources, and build-sag rates/scope remain open; [section 08](08-a-world-that-remembers.md) decides that unlit player structures slowly lean, settle, and collapse.

Monoliths and the seasons of waking are decided progression direction in [section 06](06-cosmology-and-the-waking-world.md): lighting ancient dark monoliths creates waystones and checkpoints and changes their regions, softening weather and blooming flora, with possible new blocks. In multiplayer this is a shared project no one is forced into; the story is told through changes to the land.

## Open questions / gaps

- Combat and enemy design remain deliberately deferred, including whether any combat exists; [section 06](06-cosmology-and-the-waking-world.md) establishes darkness and unmaking, not monsters, as the primary threat.
- Death and respawn implementation details: [section 06](06-cosmology-and-the-waking-world.md) decides relighting at the last fire the player lit (campfire, hearth, or monolith), with carried items dropped where they fell and slowly unmaking in the dark. Item decay rates and whether anything else is lost remain open.
- Crafting recipe lists and resource tiers.
- Hunger/health mechanics and exact condition-to-glow mapping, including any secondary display; ember glow as the core condition display is decided in [section 07](07-the-guide-in-depth.md).
- Save/persistence technical implementation remains open; [section 09](09-the-journey-together.md) decides that away fires burn down but never out, leaving a spark to relight from the ember on return. Burn-down rates and death-related fire state in multiplayer remain open.
- Multiplayer architecture and player scale.
- Controls specification.
- Audio implementation and specifics remain open within the thin-place hum and guide response in [section 06](06-cosmology-and-the-waking-world.md) and the richer thin-place hum, world chord, and sleep/dream direction in [section 08](08-a-world-that-remembers.md). Note assignment, dream content system, and frequency remain open.
- Progression details beyond the monolith/seasons-of-waking direction in [section 06](06-cosmology-and-the-waking-world.md): monolith count, region-change specifics, and content unlocks remain open. The fire ladder — spark, campfire, hearth, beacon, monolith — is decided in [section 08](08-a-world-that-remembers.md); each tier pushes back more darkness and unlocks nearby crafting, with tier unlocks and crafting-station behavior still open.
- Exact terrain noise/generation algorithm.
- 
