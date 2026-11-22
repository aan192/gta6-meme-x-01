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
console.log(`Copied ${srcFile} to ${destFile}`);
