Drop your music audio files in this folder (docs/assets/music/).
Any of .m4a/.mp3/.ogg/.aac/.wav works; the engine tries them in that order.
Expected basenames:
island-predawn
sunlit-meadow
first-night
deep-forest
frost-peaks
canyon-dusk
first-dawn
underfoot
hearthside
monolith

Missing or undecodable themes stay silent. Underfoot and monolith are
reserved placeholders until reliable game triggers are wired.
Tune musicConfig in docs/js/music.js; console: window.grin.music.config.
After adding or replacing assets, call window.grin.music.reload().
