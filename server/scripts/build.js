/**
 * Production build check for the plain-JS API (no compile step).
 * - Syntax-checks every file under src/
 * - Verifies the Express app module loads
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "src");

function collectJsFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(fullPath, files);
    } else if (entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }
  return files;
}

function syntaxCheck(files) {
  for (const file of files) {
    execSync(`node --check "${file}"`, { stdio: "inherit" });
  }
}

function main() {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

  const files = collectJsFiles(SRC_DIR);
  if (files.length === 0) {
    throw new Error("No source files found in src/");
  }

  console.log(`Checking syntax of ${files.length} files...`);
  syntaxCheck(files);

  console.log("Loading application module...");
  require("../src/app");

  console.log("Build completed successfully.");
}

main();
