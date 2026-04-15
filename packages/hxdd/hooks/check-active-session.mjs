import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const input = JSON.parse(readFileSync("/dev/stdin", "utf8"));
const lockFile = join(input.cwd, "hxdd.json");

if (!existsSync(lockFile)) {
  process.exit(0);
}

const lock = JSON.parse(readFileSync(lockFile, "utf8"));
const workspace = lock.workspace ?? "(unknown)";

process.stdout.write(
  JSON.stringify({
    decision: "block",
    reason: `HXDD session already active for \`${workspace}\`. Only one session at a time is supported. Delete hxdd.json at repo root when you want to start a new HXDD.`,
  })
);
