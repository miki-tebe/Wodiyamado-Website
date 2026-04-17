import type { CollectionEntry } from "astro:content";

export type EventSource = "content" | "typefully";
export type EventStatus = "draft" | "published";

export interface EventRecord {
  slug: string;
  title: string;
  date: string | null;
  time?: string | null;
  category?: string | null;
  description?: string | null;
  venue?: string | null;
  location?: string | null;
  map?: string | null;
  poster?: string | null;
  maxParticipants?: number | null;
  tags: string[];
  status: EventStatus;
  source: EventSource;
  body?: string | null;
  sourceKey?: string | null;
  sourceMetadata?: Record<string, unknown>;
}

export interface PublicEvent {
  slug: string;
  title: string;
  date: string;
  time?: string | null;
  category?: string | null;
  description?: string | null;
  venue?: string | null;
  location?: string | null;
  map?: string | null;
  poster?: string | null;
  maxParticipants?: number | null;
  tags: string[];
  status: "published";
  source: EventSource;
}

export type EventPageRecord =
  | {
      kind: "content";
      event: PublicEvent;
      entry: CollectionEntry<"events">;
    }
  | {
      kind: "typefully";
      event: PublicEvent;
      body?: string | null;
      sourceMetadata?: Record<string, unknown>;
    };

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export function normalizeTags(tags: Array<string | null | undefined>) {
  return [...new Set(tags.filter(Boolean).map((tag) => normalizeTag(String(tag))))];
}

export function hasEventTag(tags: string[]) {
  return tags.some((tag) => normalizeTag(tag) === "event");
}

export function toPublicEvent(event: EventRecord): PublicEvent | null {
  if (event.status !== "published" || !event.date) {
    return null;
  }

  return {
    slug: event.slug,
    title: event.title,
    date: event.date,
    time: event.time ?? null,
    category: event.category ?? null,
    description: event.description ?? null,
    venue: event.venue ?? null,
    location: event.location ?? null,
    map: event.map ?? null,
    poster: event.poster ?? null,
    maxParticipants: event.maxParticipants ?? null,
    tags: event.tags,
    status: "published",
    source: event.source,
  };
}

export function toEventKey(title: string, date?: string | null) {
  const normalizedTitle = slugify(title || "event") || "event";
  if (!date) {
    return normalizedTitle;
  }

  return `${normalizedTitle}-${date}`;
}

export function compareEventRecords(a: { date: string | null; title: string }, b: { date: string | null; title: string }) {
  const aTime = a.date ? new Date(a.date).getTime() : Number.NEGATIVE_INFINITY;
  const bTime = b.date ? new Date(b.date).getTime() : Number.NEGATIVE_INFINITY;

  if (aTime !== bTime) {
    return bTime - aTime;
  }

  return a.title.localeCompare(b.title);
}
