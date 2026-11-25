import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, a single line, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

const ENTRY =
  "My agent spent forty minutes stuck on the same error, then asked me if I'd tried turning it off and on again.";

function validateEntry(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

validateEntry(ENTRY);
mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Read back and verify byte for byte, so a shared /output cannot fool us.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
}
validateEntry(written);
console.log(`wrote ${ENTRY.length} characters to ${OUTPUT_PATH}`);
