import fs from "node:fs";
import path from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR || process.cwd();
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const srcFile = path.join(botDir, "POST.json");
const destFile = path.join(outputDir, "POST.json");

if (!fs.existsSync(srcFile)) {
  console.error(`Error: POST.json not found at ${srcFile}`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.copyFileSync(srcFile, destFile);

try {
  const copiedContent = fs.readFileSync(destFile, "utf8");
  const parsed = JSON.parse(copiedContent);
  if (!parsed.url || typeof parsed.url !== "string" || !parsed.url.startsWith("https://x.com/")) {
    console.error(`Error: Invalid or missing URL in POST.json: ${parsed.url}`);
    process.exit(1);
  }
  console.log(`Verified valid X post URL: ${parsed.url}`);
} catch (err: any) {
  console.error(`Error: Failed to read or parse copied POST.json: ${err.message}`);
  process.exit(1);
}

// Carry the meme image itself into the output alongside POST.json, so the
// entry ships the exact picture the post names. The current meme is a JPEG;
// fall back to the older PNG name if that is all the bot dir holds. A missing
// image is worth a warning, not a failure: POST.json is the entry's core.
const memeCandidates = ["meme.jpg", "meme.png"];
const memeName = memeCandidates.find((name) => fs.existsSync(path.join(botDir, name)));

if (memeName) {
  fs.copyFileSync(path.join(botDir, memeName), path.join(outputDir, memeName));
  console.log(`Copied meme image: ${memeName}`);
} else {
  console.log("Warning: no meme image (meme.jpg or meme.png) found in the bot dir; continuing without one.");
}
