import {
  compareEventRecords,
  type EventPageRecord,
  type EventRecord,
  type PublicEvent,
  toPublicEvent,
} from "./event-types";
import { createEmdashDb as createCmsDb } from "./emdash-db";
import { ensureLibsqlSchema, getLibsqlClient, getLibsqlConfig, safeJsonParse } from "./libsql";

interface LibsqlEventRow {
  id: string;
  source_key: string;
  slug: string;
  title: string;
  date: string | null;
  time: string | null;
  category: string | null;
  description: string | null;
  venue: string | null;
  location: string | null;
  map: string | null;
  poster: string | null;
  max_participants: number | null;
  tags: string;
  status: string;
  source: string;
  source_metadata: string;
  body: string | null;
  created_at: string;
  updated_at: string;
}

function mapDatabaseEvent(row: LibsqlEventRow): EventRecord {
  const tags = safeJsonParse<string[]>(row.tags, []);
  const sourceMetadata = safeJsonParse<Record<string, unknown>>(row.source_metadata, {});

  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    time: row.time,
    category: row.category,
    description: row.description,
    venue: row.venue,
    location: row.location,
    map: row.map,
    poster: row.poster,
    maxParticipants: row.max_participants,
    tags,
    status: row.status === "published" ? "published" : "draft",
    source: "typefully",
    body: row.body,
    sourceKey: row.source_key,
    sourceMetadata,
  };
}

function parseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function imageSrc(value: unknown) {
  if (typeof value === "string" && value.startsWith("/")) return value;
  return parseJson<{ src?: string }>(value)?.src ?? null;
}

function dateString(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.valueOf())) return String(value);
  return date.toISOString().slice(0, 10);
}

function plainTextFromPortableText(value: unknown) {
  const blocks = parseJson<Array<{ children?: Array<{ text?: string }> }>>(value);
  if (!blocks) return null;
  return blocks
    .map((block) => block.children?.map((child) => child.text ?? "").join("") ?? "")
    .filter(Boolean)
    .join("\n\n");
}

function mapEmdashEvent(row: Record<string, unknown>): EventRecord {
  return {
    slug: String(row.slug),
    title: String(row.title ?? ""),
    date: dateString(row.date),
    time: row.time ? String(row.time) : null,
    category: row.category ? String(row.category) : null,
    description: row.description ? String(row.description) : null,
    venue: row.venue ? String(row.venue) : null,
    location: row.location ? String(row.location) : null,
    map: row.map ? String(row.map) : null,
    poster: imageSrc(row.poster),
    maxParticipants: row.max_participants ? Number(row.max_participants) : null,
    tags: [],
    status: row.status === "published" ? "published" : "draft",
    source: "emdash",
    body: plainTextFromPortableText(row.content),
    sourceKey: `emdash:${row.id}`,
    sourceMetadata: {},
  };
}

async function loadEmdashEventRecords(): Promise<EventRecord[]> {
  const db = createCmsDb();
  try {
    const rows = await db
      .selectFrom("ec_events")
      .selectAll()
      .where("status", "=", "published")
      .where("deleted_at", "is", null)
      .execute();

    return rows.map((row) => mapEmdashEvent(row as Record<string, unknown>));
  } finally {
    await db.destroy();
  }
}

export function toPublicListEvent(event: EventRecord): PublicEvent | null {
  return toPublicEvent(event);
}

export async function loadMergedEventRecords() {
  const [emdashEvents, dbEvents] = await Promise.all([
    loadEmdashEventRecords(),
    loadDatabaseEventRecords(),
  ]);

  const records = new Map<string, EventRecord>();

  for (const event of emdashEvents) {
    if (event.status !== "published" || !event.date) {
      continue;
    }
    records.set(event.slug, event);
  }

  for (const event of dbEvents) {
    if (event.status !== "published" || !event.date) {
      continue;
    }
    records.set(event.slug, event);
  }

  return [...records.values()].sort(compareEventRecords);
}

export async function getPublicEvents() {
  const records = await loadMergedEventRecords();
  return records
    .map((record) => toPublicEvent(record))
    .filter((event): event is PublicEvent => Boolean(event));
}

export async function getEventPageRecordBySlug(slug: string): Promise<EventPageRecord | null> {
  const [emdashEvents, dbEvents] = await Promise.all([
    loadEmdashEventRecords(),
    loadDatabaseEventRecords(),
  ]);

  const dbEvent = dbEvents.find((event) => event.slug === slug && event.status === "published" && event.date);
  if (dbEvent) {
    const publicEvent = toPublicEvent(dbEvent);
    if (!publicEvent) {
      return null;
    }

    return {
      kind: "typefully",
      event: publicEvent,
      body: dbEvent.body ?? null,
      sourceMetadata: dbEvent.sourceMetadata,
    };
  }

  const emdashEvent = emdashEvents.find((event) => event.slug === slug);
  if (!emdashEvent) {
    return null;
  }

  const publicEvent = toPublicEvent(emdashEvent);
  if (!publicEvent) {
    return null;
  }

  return {
    kind: "emdash",
    event: publicEvent,
    body: emdashEvent.body ?? null,
  };
}

export async function getPublicEventBySlug(slug: string) {
  const record = await getEventPageRecordBySlug(slug);
  return record?.event ?? null;
}

async function loadDatabaseEventRecords(): Promise<EventRecord[]> {
  if (!getLibsqlConfig().url) {
    return [];
  }

  await ensureLibsqlSchema();

  const db = getLibsqlClient();
  const result = await db.execute(`
    SELECT
      id,
      source_key,
      slug,
      title,
      date,
      time,
      category,
      description,
      venue,
      location,
      map,
      poster,
      max_participants,
      tags,
      status,
      source,
      source_metadata,
      body,
      created_at,
      updated_at
    FROM events
    ORDER BY COALESCE(date, created_at) DESC, title ASC
  `);

  return result.rows.map((row) => {
    const typedRow = row as unknown as LibsqlEventRow;
    return mapDatabaseEvent(typedRow);
  });
}
