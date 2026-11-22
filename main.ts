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
