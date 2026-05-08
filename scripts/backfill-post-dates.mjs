import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { applySeed } from "emdash/seed";
import { createEmdashDb } from "./emdash-db.mjs";

const root = process.cwd();
const blogsDir = path.join(root, "src/content/blogs");

function scalar(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source) {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return {};
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return {};

  const data = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const match = line.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/);
    if (match) data[match[1]] = scalar(match[2] ?? "");
  }
  return data;
}

function slugFromFile(file) {
  return path.basename(file).replace(/\.(mdoc|md)$/, "");
}

function toIso(value) {
  const date = new Date(String(value));
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}

const db = createEmdashDb();

try {
  await applySeed(
    db,
    {
      version: "1",
      collections: [
        {
          slug: "posts",
          label: "Posts",
          labelSingular: "Post",
          supports: ["drafts", "revisions", "search"],
          urlPattern: "/blogs/{slug}",
          fields: [{ slug: "date", label: "Date", type: "datetime" }],
        },
      ],
    },
    { onConflict: "update" },
  );

  const files = (await readdir(blogsDir)).filter((file) => /\.(mdoc|md)$/.test(file));
  for (const file of files) {
    const source = await readFile(path.join(blogsDir, file), "utf8");
    const date = toIso(parseFrontmatter(source).date);
    if (!date) continue;

    await db
      .updateTable("ec_posts")
      .set({
        date,
        published_at: date,
        created_at: date,
      })
      .where("slug", "=", slugFromFile(file))
      .execute();
  }

  console.log(`Backfilled dates for ${files.length} posts.`);
} finally {
  await db.destroy();
}
