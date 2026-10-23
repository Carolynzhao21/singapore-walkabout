# Singapore Walkabout 狮城漫步

A Mandarin-learning walking and life sim set in real Google Street View of Singapore: Chinatown, Marina Bay, the Southern Ridges and Bugis.

Adapted from [Taipei Walkabout](https://cedricboi.github.io/taipei-walkabout/) by cedricboi, with his permission.

**Status: early work in progress.** The world is in Singapore (places, areas, coordinates, title, opening film text). The dialogue, prices, MRT rides, culture cards, pictures and voices are still the Taipei originals and are being replaced stage by stage.

## Play it

Open `index.html` (or the GitHub Pages link). The first time, the game asks for a **Google Maps API key** with the *Maps JavaScript API* turned on. The key is stored only in your own browser (`localStorage`) and is never part of this repo.

Pictures, music and voice recordings are loaded from the original Taipei Walkabout site for now (`<base>` tag added by `build.py`). Remove that patch in `build.py` once this repo has its own `art/`, `music/` and `voice/` folders.

## How it is built

The game is one large function, so changes cannot live in a separate script. Instead:

```
base/taipei-index.html   the original game (Google Maps key removed)
layer/*.js               the Singapore layer, injected inside the game by build.py
build.py                 applies exact text patches + injects the layers -> index.html
tools/smoke.js           loads the built game against a stand-in page and reports crashes and place data
```

Edit `layer/` and `build.py`, never `index.html` directly. Then:

```
python3 build.py
node tools/smoke.js index.html
```

Every text patch in `build.py` must match exactly once, so the build fails loudly if the base changes.

## Things to know

- Pinyin is looked up by the exact sentence in the game's `PYMAP` table. Any rewritten line needs a matching `PYMAP` entry or it shows no pinyin.
- Coordinates in `layer/00_world.js` and `layer/01_extra_places.js` are approximate. Tune doors and headings in the browser.
- Internal ids (`ximen`, `t101`, `xiangshan`, `jiantan`) are kept on purpose so scenes, saves and the MRT code keep working. Only what the player sees changes.
