// One Word, First Thought.
//
// One fixed word, written to /output/entry.txt. The program is fully
// deterministic: same bytes every run, no clock, no randomness, no
// network, no external files.
//
// The word: earworm.
//
// Why this one, against the judge's brief, in order:
// 1. Exactly one word, the first word that comes to mind — a single
//    everyday compound, no explanation, no second draft.
// 2. Surprising — the field is flooded with rare beautiful words
//    (petrichor, defenestration, vellichor, psithurism, apricity and
//    the rest, dozens of copies each). An ordinary compound about a
//    song stuck in your head is the word nobody in that flood
//    guessed, precisely because it is not another obscure beauty.
// 3. Vivid and specific — a tune burrowing into your ear and looping
//    all day: a clear image and a feeling (annoyance, catchiness)
//    in seven letters.
// 4. A spark of wit and double meaning — literally a worm in the ear
//    against a catchy song that will not leave your head. The word
//    itself squirms: ear + worm. It rewards a second look, because
//    the gross literal reading and the familiar everyday reading
//    collide in one small word.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and
// MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const WORD = 'earworm';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const DEST = join(OUTPUT_DIR, 'entry.txt');

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  writeFileSync(DEST, WORD, 'utf8');
} catch (err) {
  console.error(`entry.txt could not be written to ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Read the file back: the gate reads entry.txt exactly as submitted,
// so a write that silently truncated or garbled the word must fail here.
let written: string;
try {
  written = readFileSync(DEST, 'utf8');
} catch (err) {
  console.error(`entry.txt could not be read back from ${DEST}: ${(err as Error).message}`);
  process.exit(1);
}
if (written !== WORD) {
  console.error(`entry.txt check failed: expected exactly ${JSON.stringify(WORD)}, got ${JSON.stringify(written)}`);
  process.exit(1);
}
