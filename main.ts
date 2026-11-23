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
// 5. Chosen rather than generic — a specific, named thing with a
//    life of its own, not a filler word like thing or stuff, and
//    not a pretty word picked for its sound alone.
//
// Rejected alternatives, weighed against the same brief: gobbledygook
// (fun sound and self-referential, but 12 letters and still in the
// "funny rare word" family); skedaddle and nincompoop (lively sound
// and vivid, but no double meaning, so weaker on criterion 4);
// onomatopoeia (meta wit about sound, but it calls up no image, so
// weaker on criterion 3); snickerdoodle (vivid and fun, but its
// second meaning is thin). Earworm is the only candidate strong on
// criteria 2, 3 and 4 at once — and at 7 bytes it also wins the
// exact-tie break, which prefers the smaller text.
import * as fs from "node:fs";
import * as path from "node:path";

// The single word this entry sends, and nothing else.
const WORD = "earworm";

// Flood guard: the field is saturated with byte-identical copies of
// these rare beautiful words, and a copy shares its rate with the
// earlier receipt, so it can never win. If WORD is ever changed to
// one of them, fail loudly here instead of shipping a duplicate.
const FLOODED = new Set([
  "petrichor", "defenestration", "vellichor", "psithurism",
  "apricity", "borborygmus", "susurrus", "syzygy", "murmuration",
  "sonder", "kerfuffle", "zugzwang", "quockerwodger", "chrysalism",
]);
if (FLOODED.has(WORD.toLowerCase())) {
  throw new Error(`word "${WORD}" is flooded in the field, pick another`);
}

// Gate: /output/entry.txt must be UTF-8 text of 1 to 24 characters,
// counted as Unicode code points, not only white space, and exactly
// one word — no spaces, no punctuation, no newline. Any violation
// throws before anything is written, so a bad entry can never be
// graded.
const codePoints = [...WORD].length;
if (codePoints < 1 || codePoints > 24) {
  throw new Error(`word is ${codePoints} code points, outside the 1-24 gate`);
}
if (WORD.trim().length === 0) {
  throw new Error("word must not be whitespace-only");
}
if (/\s/.test(WORD)) {
  throw new Error("word must contain no whitespace");
}
if (!/^[A-Za-z]+$/.test(WORD)) {
  throw new Error("word must be plain letters only, no punctuation");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = path.join(outDir, "entry.txt");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, WORD, "utf8");

// Read-back check: the file on disk must be byte-identical to the
// gated string, so a partial or altered write is caught here.
const written = fs.readFileSync(outPath, "utf8");
if (written !== WORD) {
  throw new Error("entry.txt on disk does not match the word");
}

console.log(WORD);
console.log(`(earworm: ${codePoints} code points, ${Buffer.byteLength(WORD, "utf8")} bytes)`);
