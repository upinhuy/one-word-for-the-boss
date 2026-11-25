// One Word for the Boss — entry: "Hovercraft"
// A boss who hovers over every shoulder: funny on its own, true of
// micromanagers everywhere, and it travels from office to kitchen
// to warehouse without needing an explanation.
// Node 22 stdlib only. Writes exactly one word to /output/entry.txt.

import { mkdirSync, writeFileSync } from "node:fs";

const WORD = "Hovercraft";

// Gate: /output/entry.txt must be UTF-8 text of 1 to 30 characters,
// not only whitespace, and exactly one word (no spaces).
if (WORD.length < 1 || WORD.length > 30) {
  throw new Error(`entry word must be 1-30 characters, got ${WORD.length}`);
}
if (!WORD.trim() || /\s/.test(WORD)) {
  throw new Error("entry must be exactly one word with no whitespace");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, WORD, "utf8");
console.log(`Wrote entry: ${WORD}`);
