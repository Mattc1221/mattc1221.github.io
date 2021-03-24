# CS559-Three -  a version of the THREE.js library for CS559 Workbooks

These files are taken from the THREE distribution. 

They are the pieces that are required for the CS559 workbooks. This is the minimum.
If you want other things (like the sources or the documentations or examples), download the entire three package.

This archive was created by downloading three.js-master on January 14, 2021.
It is THREE version 124.

The choices of files are based on last year (which might not be an informed choice).

What's here (all copied from the THREE distribution except for ```build/three.module.d.ts```):
1. The Three README.md and LICENSE files (renamed)
1. `build/three.module.js`
1. `build/three.module.d.ts`. This needs to be added manually. See the section below about TypeScript type checking in VSCode for more info.
1. the src folder (mainly to get the typing information)
1. some of the examples (not all of them) - all from the jsm folder
    - controls (in the past, it was a subset - this year I included more)
    - curves
    - libs
    - loaders
1. the fonts (just the json for helvetiker) - this was added later in the semester

## How to get THREE.js TypeScript type checking to work in VSCode (*just for THREE.js stuff, not the entire TypeScript language*)
Older versions of THREE.js had the `build/three.module.d.ts` file by default. This file allowed for helpful TypeScript type checking and hover-over capabilities in VSCode just for THREE.js things. For example, hovering over `T.BoxGeometry` (assuming THREE was imported as T) will give info about the `BoxGeometry` object. And, with this helpful type checking, setting a THREE.js object to the wrong type would give an error. There is a way to include *all* of TypeScript checking to VSCode, but that's unnecessary and would make things complicated. That's what the `build/three.module.d.ts` enables in VSCode. Newer versions of THREE, however, removed this file for unknown reasons, but it's easy enough to add it back, through a hacky fix (but it works!). The steps to do this are below.
1. Copy (do NOT remove) the `src/Three.d.ts` file into the `build` folder.
1. Rename that copied file to `three.module.d.ts`.
1. Find and replace all instances of `./` with `../src/` in the file you just copied and renamed (`build/three.module.d.ts`).
1. Voila! Now THREE.js type checking should work in VSCode.

### These steps should be followed each time the THREE version is updated. 
You could just go about using an old version of `build/three.module.d.ts` (I tested this and type checking/type info worked for the example file I was looking at), but it's best to follow the steps above, in-case any new paths are added for new types in the `src/Three.d.ts` file.
