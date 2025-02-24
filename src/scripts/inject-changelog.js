// scripts/inject-changelog.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readmePath = path.join(__dirname, "../../", "README.md"); // Corrected path

const changelogPath = path.join(__dirname, "../../", "CHANGELOG.md");

try {
  const readmeContent = fs.readFileSync(readmePath, "utf8");
  const changelogContent = fs.readFileSync(changelogPath, "utf8");

  const startMarker = "<!-- CHANGELOG_BEGIN -->";
  const endMarker = "<!-- CHANGELOG_END -->";

  const startIndex = readmeContent.indexOf(startMarker);
  const endIndex = readmeContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error("Changelog markers not found in README.md");
    process.exit(1); // Exit with an error code
  }

  const newReadmeContent =
    readmeContent.substring(0, startIndex + startMarker.length) +
    "\n" +
    changelogContent +
    "\n" +
    readmeContent.substring(endIndex);

  fs.writeFileSync(readmePath, newReadmeContent, "utf8");
  console.log("Changelog injected into README.md");
} catch (error) {
  console.error("Error reading or writing files:", error);
  process.exit(1); // Exit with an error code
}
