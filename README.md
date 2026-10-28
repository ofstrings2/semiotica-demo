# Semiotica · Play in your browser

**[Open the demo](https://ofstrings2.github.io/semiotica-demo/)**

A playground for thought, inspired by C. S. Peirce’s existential graphs.
Draw and transform graphs, try guided discoveries, play a game of truth,
or unfold a thought into connected three-dimensional surfaces.

This repository contains the browser demo and its bundled runtime assets.
The Godot development project is managed separately.

Best with a keyboard and mouse or trackpad. No application account is needed.
Sheets and discovery progress stay in each browser’s local storage.

## Publishing

GitHub Pages serves the root of the `main` branch. `.nojekyll` preserves the
export as static files. All asset URLs are relative, so the game works under
the `/semiotica-demo/` project path.

The Godot runtime is stored as a gzip representation to reduce its download
size. The loader handles decompression directly when the host does not send
a compression header. This single-threaded build needs no special isolation
headers, server, database or paid hosting package.

The game includes Alpha, Beta, an initial Gamma interpretation, Create,
Derive, Play, and the 3D continuum. Its current 3D proof calculus is modal T
with constant domains and rigid identity.

## Credits

The game’s [credits page](credits.html) describes its sources, fonts and engine.
Alegreya and Euler Math font licenses, and Godot’s engine license and
third-party notices, are bundled in `licenses/`.
