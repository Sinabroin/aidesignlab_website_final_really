// Sync operators/community allowlists from contact markdown files.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "..", "..");
const contactsPath = path.join(workspaceRoot, "OPERATOR_CONTACTS.md");
const aceContactsPath = path.join(workspaceRoot, "ACE_CONTACTS.md");
const allowlistsPath = path.join(process.cwd(), "data", "allowlists.json");

function extractEmails(markdownText) {
  const matches = [...markdownText.matchAll(/`([^`]+@hdec\.co\.kr)`/gi)];
  const unique = new Set(matches.map((m) => m[1].trim().toLowerCase()));
  return [...unique];
}

async function run() {
  const [operatorText, aceText] = await Promise.all([
    readFile(contactsPath, "utf8"),
    readFile(aceContactsPath, "utf8"),
  ]);
  const operators = extractEmails(operatorText);
  const community = extractEmails(aceText);

  if (operators.length === 0) {
    throw new Error("No operator emails found in OPERATOR_CONTACTS.md");
  }
  if (community.length === 0) {
    throw new Error("No community emails found in ACE_CONTACTS.md");
  }

  const allowlists = JSON.parse(await readFile(allowlistsPath, "utf8"));
  allowlists.operators = operators;
  allowlists.community = community;
  await writeFile(allowlistsPath, JSON.stringify(allowlists, null, 2) + "\n", "utf8");
  console.log(
    `[sync-operators] synced ${operators.length} operators, ${community.length} community members`
  );
}

run().catch((error) => {
  console.error("[sync-operators] failed:", error.message);
  process.exit(1);
});

