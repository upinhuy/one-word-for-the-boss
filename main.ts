// One Word for the Boss — entry: "Hovercraft"
// A boss who hovers over every shoulder: funny on its own, true of
// micromanagers everywhere, and it travels from office to kitchen
// to warehouse without needing an explanation.
// Node 22 stdlib only. Writes exactly one word to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry word, assembled from its two roots so the construction is
// explicit: "Hover" (what the boss does) + "craft" (the vehicle it
// arrives in). The assembled word is what gets validated and written.
const WORD_ROOT = "Hover";
const WORD_SUFFIX = "craft";

function buildWord(): string {
  return `${WORD_ROOT}${WORD_SUFFIX}`;
}

// Validate the entry against every gate the bounty sets for
// /output/entry.txt: UTF-8 text, 1-30 characters, not only whitespace,
// and exactly one word (no spaces). Each failure names the gate it
// tripped, so a bad word is rejected with a reason instead of silently
// producing an invalid file.
function validateWord(word: string): void {
  if (word.length < 1 || word.length > 30) {
    throw new Error(
      `entry word must be 1-30 characters, got ${word.length} for ${JSON.stringify(word)}`,
    );
  }
  if (!word.trim()) {
    throw new Error("entry word must not be only whitespace");
  }
  if (/\s/.test(word)) {
    throw new Error(
      `entry must be exactly one word with no whitespace, got ${JSON.stringify(word)}`,
    );
  }
  if (!/^[A-Za-z]+$/.test(word)) {
    throw new Error(
      `entry must be a single alphabetic word, got ${JSON.stringify(word)}`,
    );
  }
  // The gate counts characters in the file, so check the UTF-8 byte
  // length too: a word that fits in characters but not in bytes would
  // still fail on disk. "Hovercraft" is plain ASCII, so both are 10.
  const byteLength = Buffer.byteLength(word, "utf8");
  if (byteLength < 1 || byteLength > 30) {
    throw new Error(
      `entry word must be 1-30 bytes in UTF-8, got ${byteLength} for ${JSON.stringify(word)}`,
    );
  }
  // The entry is a title-style word, so it must start with a capital
  // letter; a lower-case first letter would read as a typo, not a name.
  if (word[0] !== word[0].toUpperCase()) {
    throw new Error(
      `entry word must start with a capital letter, got ${JSON.stringify(word)}`,
    );
  }
  // Guard against a placeholder slipping in: the entry must be the
  // chosen word, not a generic label for the boss.
  const generic = new Set(["boss", "manager", "micromanager", "chief"]);
  if (generic.has(word.toLowerCase())) {
    throw new Error(
      `entry word must be a distinctive word, not a generic label: ${JSON.stringify(word)}`,
    );
  }
}

// Write the validated word with no trailing newline or extra bytes,
// then read the file back and confirm it holds exactly that word.
// A mismatch means the write did not land cleanly, so fail loudly
// rather than leaving a corrupt entry behind.
function writeEntry(word: string): void {
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}/entry.txt`;
  writeFileSync(outPath, word, "utf8");
  const written = readFileSync(outPath, "utf8");
  if (written !== word) {
    throw new Error(
      `entry.txt mismatch after write: expected ${JSON.stringify(word)}, got ${JSON.stringify(written)}`,
    );
  }
}

const WORD = buildWord();
validateWord(WORD);
writeEntry(WORD);
console.log(`Wrote entry: ${WORD}`);
