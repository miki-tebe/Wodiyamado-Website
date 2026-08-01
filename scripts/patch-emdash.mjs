import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.join(process.cwd(), "node_modules", "emdash", "dist");
const files = await readdir(distDir);
const contentFile = files.find((file) => /^content-.*\.mjs$/.test(file));

if (!contentFile) {
  throw new Error("Could not find EmDash content bundle to patch.");
}

const filePath = path.join(distDir, contentFile);
const source = await readFile(filePath, "utf8");

const before = `for (const [key, value] of Object.entries(input.data)) if (!SYSTEM_COLUMNS.has(key)) {
\t\t\t\tvalidateIdentifier(key, "content field name");
\t\t\t\tupdates[key] = serializeValue(value);
\t\t\t}`;

const after = `for (const [key, value] of Object.entries(input.data)) if (!SYSTEM_COLUMNS.has(key)) {
\t\t\t\tif (key.startsWith("_")) continue;
\t\t\t\tvalidateIdentifier(key, "content field name");
\t\t\t\tupdates[key] = serializeValue(value);
\t\t\t}`;

if (source.includes(after)) {
  console.log("EmDash content update patch already applied.");
} else if (source.includes(before)) {
  await writeFile(filePath, source.replace(before, after));
  console.log(`Patched ${contentFile} to ignore revision metadata on content update.`);
} else {
  throw new Error("EmDash content update patch target was not found.");
}

const middlewarePath = path.join(distDir, "astro", "middleware.mjs");
const middlewareSource = await readFile(middlewarePath, "utf8");

const middlewareBefore = `const mergedData = {
\t\t\t\t\t\t...baseData,
\t\t\t\t\t\t...processedData
\t\t\t\t\t};`;

const middlewareAfter = `const mergedData = {
\t\t\t\t\t\t...Object.fromEntries(Object.entries(baseData).filter(([key]) => !key.startsWith("_"))),
\t\t\t\t\t\t...Object.fromEntries(Object.entries(processedData).filter(([key]) => !key.startsWith("_")))
\t\t\t\t\t};`;

if (middlewareSource.includes(middlewareAfter)) {
  console.log("EmDash middleware draft metadata patch already applied.");
} else if (middlewareSource.includes(middlewareBefore)) {
  await writeFile(middlewarePath, middlewareSource.replace(middlewareBefore, middlewareAfter));
  console.log("Patched EmDash middleware to strip draft metadata before save.");
} else {
  throw new Error("EmDash middleware draft metadata patch target was not found.");
}

const middlewareWithDraftPatch = await readFile(middlewarePath, "utf8");
const slugBefore = `if (bodyWithoutRev.slug !== void 0) mergedData._slug = bodyWithoutRev.slug;`;
const slugAfter = `if (bodyWithoutRev.slug !== void 0 && collection !== "site_stats" && collection !== "social_links") mergedData._slug = bodyWithoutRev.slug;`;

if (middlewareWithDraftPatch.includes(slugAfter)) {
  console.log("EmDash non-routable slug metadata patch already applied.");
} else if (middlewareWithDraftPatch.includes(slugBefore)) {
  await writeFile(middlewarePath, middlewareWithDraftPatch.replace(slugBefore, slugAfter));
  console.log("Patched EmDash middleware to skip slug revision metadata for non-routable collections.");
} else {
  throw new Error("EmDash slug metadata patch target was not found.");
}
