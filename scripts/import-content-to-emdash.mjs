import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { applySeed } from "emdash/seed";
import { createEmdashDb } from "./emdash-db.mjs";

const root = process.cwd();
const contentDir = path.join(root, "src/content");

const roleFields = [
  ["president", "President", "string"],
  ["president_image", "President Image", "image"],
  ["vice_president", "Vice President", "string"],
  ["vice_president_image", "Vice President Image", "image"],
  ["secretary", "Secretary", "string"],
  ["secretary_image", "Secretary Image", "image"],
  ["treasurer", "Treasurer", "string"],
  ["treasurer_image", "Treasurer Image", "image"],
  ["club_service_director", "Club Service Director", "string"],
  ["club_service_director_image", "Club Service Director Image", "image"],
  ["community_service_director", "Community Service Director", "string"],
  ["community_service_director_image", "Community Service Director Image", "image"],
  ["public_relation_director", "Public Relation Director", "string"],
  ["public_relation_director_image", "Public Relation Director Image", "image"],
  [
    "professional_development_and_strategic_plan_director",
    "Professional Development and Strategic Plan Director",
    "string",
  ],
  [
    "professional_development_and_strategic_plan_director_image",
    "Professional Development and Strategic Plan Director Image",
    "image",
  ],
  ["professional_development_director", "Professional Development Director", "string"],
  ["professional_development_director_image", "Professional Development Director Image", "image"],
  ["project_officer", "Project Officer", "string"],
  ["project_officer_image", "Project Officer Image", "image"],
  ["fundraising_director", "Fundraising Director", "string"],
  ["fundraising_director_image", "Fundraising Director Image", "image"],
  ["international_service_director", "International Service Director", "string"],
  ["international_service_director_image", "International Service Director Image", "image"],
  ["interact_director", "Interact Director", "string"],
  ["interact_director_image", "Interact Director Image", "image"],
  ["green_rotaract_representative", "Green Rotaract Representative", "string"],
  ["green_rotaract_representative_image", "Green Rotaract Representative Image", "image"],
  ["membership_and_retention_director", "Membership and Retention Director", "string"],
  ["membership_and_retention_director_image", "Membership and Retention Director Image", "image"],
  ["immediate_past_president", "Immediate Past President", "string"],
  ["immediate_past_president_image", "Immediate Past President Image", "image"],
];

const camelToSnake = new Map([
  ["vicePresident", "vice_president"],
  ["vicePresident_image", "vice_president_image"],
  ["clubServiceDirector", "club_service_director"],
  ["clubServiceDirector_image", "club_service_director_image"],
  ["communityServiceDirector", "community_service_director"],
  ["communityServiceDirector_image", "community_service_director_image"],
  ["publicRelationDirector", "public_relation_director"],
  ["publicRelationDirector_image", "public_relation_director_image"],
  [
    "professionalDevelopmentAndStrategicPlanDirector",
    "professional_development_and_strategic_plan_director",
  ],
  [
    "professionalDevelopmentAndStrategicPlanDirector_image",
    "professional_development_and_strategic_plan_director_image",
  ],
  ["professionalDevelopmentDirector", "professional_development_director"],
  ["professionalDevelopmentDirector_image", "professional_development_director_image"],
  ["projectOfficer", "project_officer"],
  ["projectOfficer_image", "project_officer_image"],
  ["fundraisingDirector", "fundraising_director"],
  ["fundraisingDirector_image", "fundraising_director_image"],
  ["internationalServiceDirector", "international_service_director"],
  ["internationalServiceDirector_image", "international_service_director_image"],
  ["interactDirector", "interact_director"],
  ["interactDirector_image", "interact_director_image"],
  ["greenRotaractRepresentative", "green_rotaract_representative"],
  ["greenRotaractRepresentative_image", "green_rotaract_representative_image"],
  ["membershipAndRetentionDirector", "membership_and_retention_director"],
  ["membershipAndRetentionDirector_image", "membership_and_retention_director_image"],
  ["immediatePastPresident", "immediate_past_president"],
  ["immediatePastPresident_image", "immediate_past_president_image"],
]);

function slugFromFilename(file) {
  return path.basename(file).replace(/\.(mdoc|md|yaml|yml)$/, "");
}

function scalar(value) {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseYamlObject(input) {
  const data = {};
  const lines = input.replace(/\r\n/g, "\n").split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/);
    if (!match) continue;

    const [, key, raw = ""] = match;
    if (raw.trim() === ">-" || raw.trim() === "|-" || raw.trim() === ">" || raw.trim() === "|") {
      const parts = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) {
        i++;
        parts.push(lines[i].trim());
      }
      data[key] = parts.join(raw.trim().startsWith("|") ? "\n" : " ");
    } else {
      data[key] = scalar(raw);
    }
  }

  return data;
}

function parseContentFile(source) {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: parseYamlObject(normalized), body: "" };
  }
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) {
    return { data: {}, body: normalized };
  }
  const frontmatter = normalized.slice(4, end);
  const body = normalized.slice(end + 4).replace(/^\n/, "");
  return { data: parseYamlObject(frontmatter), body };
}

function imageValue(src, alt = "") {
  if (!src || typeof src !== "string") return undefined;
  return {
    id: src,
    src,
    alt,
    provider: "external",
    filename: path.basename(src),
  };
}

function span(text) {
  return {
    _type: "span",
    _key: Math.random().toString(36).slice(2, 10),
    text,
    marks: [],
  };
}

function portableText(markdown) {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => ({
      _type: "block",
      _key: Math.random().toString(36).slice(2, 10),
      style: chunk.startsWith("# ") ? "h1" : chunk.startsWith("## ") ? "h2" : "normal",
      markDefs: [],
      children: [span(chunk.replace(/^#{1,6}\s+/, ""))],
    }));
  return blocks.length ? blocks : undefined;
}

async function readCollection(name) {
  const dir = path.join(contentDir, name);
  const files = (await readdir(dir)).filter((file) => /\.(mdoc|md|yaml|yml)$/.test(file)).sort();
  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(dir, file), "utf8");
      const parsed = parseContentFile(source);
      return { file, slug: slugFromFilename(file), ...parsed };
    }),
  );
}

function categorySlug(category) {
  return String(category || "uncategorized")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dateToIso(value) {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.valueOf()) ? String(value) : date.toISOString();
}

async function buildSeed() {
  const blogs = await readCollection("blogs");
  const events = await readCollection("events");
  const gallery = await readCollection("gallery");
  const donations = await readCollection("donations");
  const structures = await readCollection("structures");

  const categories = [...new Set(blogs.map((entry) => entry.data.category).filter(Boolean))].map(
    (category) => ({
      id: `category:${categorySlug(category)}`,
      slug: categorySlug(category),
      label: String(category),
    }),
  );

  return {
    version: "1",
    meta: {
      name: "Wodiyamado content import",
      description: "Migrated from Astro content collections.",
    },
    collections: [
      {
        slug: "posts",
        label: "Posts",
        labelSingular: "Post",
        supports: ["drafts", "revisions", "search"],
        urlPattern: "/blogs/{slug}",
        fields: [
          { slug: "title", label: "Title", type: "string", required: true, searchable: true },
          { slug: "date", label: "Date", type: "datetime" },
          { slug: "featured_image", label: "Featured Image", type: "image" },
          { slug: "excerpt", label: "Excerpt", type: "text", searchable: true },
          { slug: "content", label: "Content", type: "portableText", searchable: true },
        ],
      },
      {
        slug: "events",
        label: "Events",
        labelSingular: "Event",
        supports: ["drafts", "revisions", "search"],
        urlPattern: "/events/{slug}",
        fields: [
          { slug: "title", label: "Title", type: "string", required: true, searchable: true },
          { slug: "poster", label: "Poster", type: "image" },
          { slug: "date", label: "Date", type: "datetime", required: true },
          { slug: "time", label: "Time", type: "string" },
          { slug: "category", label: "Category", type: "string", searchable: true },
          { slug: "description", label: "Description", type: "text", searchable: true },
          { slug: "venue", label: "Venue", type: "string", searchable: true },
          { slug: "location", label: "Location", type: "string" },
          { slug: "map", label: "Map", type: "url" },
          { slug: "max_participants", label: "Max Participants", type: "integer" },
          { slug: "content", label: "Content", type: "portableText", searchable: true },
        ],
      },
      {
        slug: "gallery",
        label: "Gallery",
        labelSingular: "Gallery Item",
        supports: ["drafts", "revisions", "search"],
        fields: [
          { slug: "title", label: "Title", type: "string", required: true, searchable: true },
          { slug: "alt", label: "Alt Text", type: "string", searchable: true },
          { slug: "image", label: "Image", type: "image" },
          { slug: "content", label: "Content", type: "portableText", searchable: true },
        ],
      },
      {
        slug: "donations",
        label: "Donations",
        labelSingular: "Donation",
        supports: ["drafts", "revisions", "search"],
        fields: [
          { slug: "title", label: "Title", type: "string", required: true, searchable: true },
          { slug: "name", label: "Name", type: "string", searchable: true },
          { slug: "description", label: "Description", type: "text", searchable: true },
          { slug: "content", label: "Content", type: "portableText", searchable: true },
        ],
      },
      {
        slug: "structures",
        label: "Club Structures",
        labelSingular: "Club Structure",
        supports: ["drafts", "revisions", "search"],
        fields: [
          { slug: "title", label: "Title", type: "string", required: true, searchable: true },
          { slug: "year", label: "Year", type: "string", searchable: true },
          ...roleFields.map(([slug, label, type]) => ({ slug, label, type, searchable: type === "string" })),
        ],
      },
    ],
    taxonomies: [
      {
        name: "category",
        label: "Categories",
        labelSingular: "Category",
        hierarchical: true,
        collections: ["posts"],
        terms: categories,
      },
    ],
    content: {
      posts: blogs.map((entry) => ({
        id: `blog:${entry.slug}`,
        slug: entry.slug,
        status: "published",
        data: {
          title: entry.data.title || entry.slug,
          date: dateToIso(entry.data.date),
          featured_image: imageValue(entry.data.cover, entry.data.title),
          content: portableText(entry.body),
          excerpt: entry.data.description,
        },
        taxonomies: entry.data.category
          ? { category: [categorySlug(entry.data.category)] }
          : undefined,
      })),
      events: events.map((entry) => ({
        id: `event:${entry.slug}`,
        slug: entry.slug,
        status: "published",
        data: {
          title: entry.data.title || entry.slug,
          poster: imageValue(entry.data.poster, entry.data.title),
          date: dateToIso(entry.data.date),
          time: entry.data.time,
          category: entry.data.category,
          description: entry.data.description,
          venue: entry.data.venue,
          location: entry.data.location,
          map: entry.data.map,
          max_participants: entry.data.maxParticipants,
          content: portableText(entry.body),
        },
      })),
      gallery: gallery.map((entry) => ({
        id: `gallery:${entry.slug}`,
        slug: entry.slug,
        status: "published",
        data: {
          title: entry.data.alt || entry.slug,
          alt: entry.data.alt,
          image: imageValue(entry.data.image, entry.data.alt),
          content: portableText(entry.body),
        },
      })),
      donations: donations.map((entry) => ({
        id: `donation:${entry.slug}`,
        slug: entry.slug,
        status: "published",
        data: {
          title: entry.data.name || entry.slug,
          name: entry.data.name,
          description: entry.data.description,
          content: portableText(entry.body),
        },
      })),
      structures: structures.map((entry) => {
        const data = {
          title: entry.slug,
          year: entry.slug,
        };
        for (const [sourceKey, value] of Object.entries(entry.data)) {
          const targetKey = camelToSnake.get(sourceKey) || sourceKey;
          data[targetKey] = targetKey.endsWith("_image") ? imageValue(value, data[targetKey]) : value;
        }
        return {
          id: `structure:${entry.slug}`,
          slug: entry.slug,
          status: "published",
          data,
        };
      }),
    },
  };
}

const db = createEmdashDb();

try {
  const seed = await buildSeed();
  const result = await applySeed(db, seed, {
    includeContent: true,
    onConflict: "update",
    skipMediaDownload: true,
  });
  console.log(JSON.stringify(result, null, 2));
} finally {
  await db.destroy();
}
