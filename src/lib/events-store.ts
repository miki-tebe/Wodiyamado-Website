import { getCollection, type CollectionEntry } from "astro:content";
import { format } from "date-fns";

import {
  compareEventRecords,
  type EventPageRecord,
  type EventRecord,
  type PublicEvent,
  toPublicEvent,
} from "./event-types";
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

function toDateString(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function mapContentEvent(entry: CollectionEntry<"events">): EventRecord {
  return {
    slug: entry.slug,
    title: entry.data.title,
    date: toDateString(entry.data.date),
    time: entry.data.time ?? null,
    category: entry.data.category ?? null,
    description: entry.data.description ?? null,
    venue: entry.data.venue ?? null,
    location: entry.data.location ?? null,
    map: entry.data.map ?? null,
    poster: entry.data.poster ?? null,
    maxParticipants: entry.data.maxParticipants ?? null,
    tags: [],
    status: "published",
    source: "content",
    body: entry.body ?? null,
    sourceKey: `content:${entry.slug}`,
    sourceMetadata: {},
  };
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

export function toPublicListEvent(event: EventRecord): PublicEvent | null {
  return toPublicEvent(event);
}

export async function loadMergedEventRecords() {
  const [contentEvents, dbEvents] = await Promise.all([
    getCollection("events"),
    loadDatabaseEventRecords(),
  ]);

  const records = new Map<string, EventRecord>();

  for (const entry of contentEvents) {
    records.set(entry.slug, mapContentEvent(entry));
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
  const [contentEvents, dbEvents] = await Promise.all([
    getCollection("events"),
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

  const contentEvent = contentEvents.find((entry) => entry.slug === slug);
  if (!contentEvent) {
    return null;
  }

  const mapped = mapContentEvent(contentEvent);
  const publicEvent = toPublicEvent(mapped);
  if (!publicEvent) {
    return null;
  }

  return {
    kind: "content",
    event: publicEvent,
    entry: contentEvent,
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
