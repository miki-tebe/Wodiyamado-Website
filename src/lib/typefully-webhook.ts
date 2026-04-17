import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import { format, isValid, parse, parseISO } from "date-fns";

import {
  hasEventTag,
  normalizeTags,
  slugify,
  toEventKey,
  type EventRecord,
} from "./event-types";
import { ensureLibsqlSchema, getLibsqlClient, jsonText } from "./libsql";

type UnknownRecord = Record<string, unknown>;

export interface TypefullyWebhookResult {
  ok: boolean;
  ignored?: boolean;
  duplicate?: boolean;
  status?: "draft" | "published";
  slug?: string;
  title?: string;
  reason?: string;
}

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function getNestedValue(root: unknown, path: string[]) {
  let current: unknown = root;
  for (const key of path) {
    const record = asRecord(current);
    if (!record) {
      return undefined;
    }

    current = record[key];
  }

  return current;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    const stringValue = readString(value);
    if (stringValue) {
      return stringValue;
    }
  }

  return "";
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function splitBodyLines(body: string) {
  return body.replace(/\r\n/g, "\n").split("\n");
}

function stripMarkdownDecorations(line: string) {
  return line.replace(/^#{1,6}\s+/, "").replace(/^\s*>\s?/, "").trim();
}

function parseDateCandidate(value: string) {
  const candidate = value
    .replace(/\s+at\s+.+$/i, "")
    .replace(/\s+\|\s+.+$/i, "")
    .trim();

  if (!candidate) {
    return null;
  }

  const isoDate = parseISO(candidate);
  if (!Number.isNaN(isoDate.getTime())) {
    return format(isoDate, "yyyy-MM-dd");
  }

  const formats = [
    "yyyy-MM-dd",
    "yyyy/MM/dd",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "MMMM d, yyyy",
    "MMM d, yyyy",
    "d MMMM yyyy",
    "d MMM yyyy",
    "MMMM d yyyy",
    "MMM d yyyy",
  ];

  for (const format of formats) {
    const parsed = parseWithFormat(candidate, format);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function parseWithFormat(value: string, pattern: string) {
  const parsed = parse(value, pattern, new Date());
  if (!isValid(parsed)) {
    return null;
  }

  return format(parsed, "yyyy-MM-dd");
}

function extractDate(bodyLines: string[], explicitDate?: string) {
  const explicit = explicitDate ? parseDateCandidate(explicitDate) : null;
  if (explicit) {
    return explicit;
  }

  for (const line of bodyLines) {
    const cleaned = stripMarkdownDecorations(line);
    if (!cleaned) {
      continue;
    }

    const lower = normalizeKey(cleaned);
    if (lower.startsWith("date ")) {
      const candidate = cleaned.slice(cleaned.indexOf(" ") + 1).trim();
      const parsed = parseDateCandidate(candidate);
      if (parsed) {
        return parsed;
      }
    }
  }

  const text = bodyLines.join("\n");
  const patterns = [
    /\b\d{4}-\d{2}-\d{2}\b/g,
    /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
    /\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/gi,
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b/gi,
    /\b\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (!matches) {
      continue;
    }

    for (const match of matches) {
      const parsed = parseDateCandidate(match);
      if (parsed) {
        return parsed;
      }
    }
  }

  return null;
}

function readNestedString(root: UnknownRecord, path: string[]) {
  return firstString(getNestedValue(root, path));
}

function extractMetadataFromBody(body: string) {
  const lines = splitBodyLines(body);
  const metadata: UnknownRecord = {};
  const visibleLines: string[] = [];
  let title = "";
  let explicitDescription = "";
  let explicitDate = "";
  let time = "";
  let venue = "";
  let location = "";
  let map = "";
  let poster = "";
  let category = "";
  let maxParticipants: number | null = null;
  const extraTags: string[] = [];
  let titleCaptured = false;

  for (const rawLine of lines) {
    const line = stripMarkdownDecorations(rawLine);
    if (!line) {
      visibleLines.push("");
      continue;
    }

    const keyValue = line.match(/^([A-Za-z][\w\s/-]{0,40}):\s*(.+)$/);
    if (keyValue) {
      const key = normalizeKey(keyValue[1]);
      const value = keyValue[2].trim();

      switch (key) {
        case "title":
          title = value;
          titleCaptured = true;
          break;
        case "date":
          explicitDate = value;
          break;
        case "time":
          time = value;
          break;
        case "venue":
          venue = value;
          break;
        case "location":
          location = value;
          break;
        case "map":
        case "map link":
          map = value;
          break;
        case "poster":
        case "image":
        case "cover":
          poster = value;
          break;
        case "category":
          category = value;
          break;
        case "description":
          explicitDescription = value;
          break;
        case "max participants":
        case "capacity":
          maxParticipants = Number.parseInt(value.replace(/[^\d]/g, ""), 10) || null;
          break;
        case "tag":
        case "tags":
          extraTags.push(
            ...value
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          );
          break;
        default:
          visibleLines.push(rawLine);
          continue;
      }

      continue;
    }

    if (!titleCaptured && !title) {
      title = line.replace(/^#{1,6}\s+/, "");
      titleCaptured = true;
      continue;
    }

    visibleLines.push(rawLine);
  }

  const inferredDescription = visibleLines.join("\n").trim();
  const parsedDate = extractDate(lines, explicitDate);
  const finalDescription = explicitDescription || inferredDescription || "";

  return {
    title: title || "",
    date: parsedDate,
    time: time || null,
    venue: venue || null,
    location: location || null,
    map: map || null,
    poster: poster || null,
    category: category || null,
    description: finalDescription || null,
    maxParticipants,
    extraTags,
    metadata,
  };
}

function extractTags(payload: UnknownRecord, bodyTags: string[]) {
  const candidates = [
    payload.tags,
    payload.tag_names,
    payload.labels,
    getNestedValue(payload, ["draft", "tags"]),
    getNestedValue(payload, ["data", "tags"]),
    getNestedValue(payload, ["draft", "tag_names"]),
  ];

  const tags = candidates.flatMap((candidate) => readStringArray(candidate));
  return normalizeTags([...tags, ...bodyTags]);
}

function extractWebhookEventName(payload: UnknownRecord, headers: Headers) {
  return firstString(
    readNestedString(payload, ["event"]),
    readNestedString(payload, ["type"]),
    readNestedString(payload, ["name"]),
    readNestedString(payload, ["action"]),
    headers.get("x-typefully-event"),
    headers.get("x-webhook-event"),
    headers.get("x-event-name")
  );
}

function extractSourceId(payload: UnknownRecord) {
  return firstString(
    readNestedString(payload, ["id"]),
    readNestedString(payload, ["draft_id"]),
    readNestedString(payload, ["draftId"]),
    readNestedString(payload, ["draft", "id"]),
    readNestedString(payload, ["data", "id"]),
    readNestedString(payload, ["post_id"])
  );
}

function extractWebhookId(headers: Headers, payload: UnknownRecord) {
  return firstString(
    headers.get("x-typefully-delivery-id"),
    headers.get("x-webhook-id"),
    headers.get("x-request-id"),
    extractSourceId(payload)
  );
}

function extractBody(payload: UnknownRecord) {
  return firstString(
    readNestedString(payload, ["body"]),
    readNestedString(payload, ["content"]),
    readNestedString(payload, ["text"]),
    readNestedString(payload, ["preview"]),
    readNestedString(payload, ["draft", "body"]),
    readNestedString(payload, ["draft", "content"]),
    readNestedString(payload, ["draft", "text"]),
    readNestedString(payload, ["data", "body"]),
    readNestedString(payload, ["data", "content"]),
    readNestedString(payload, ["data", "text"]),
    readNestedString(payload, ["draft", "preview"])
  );
}

function extractTitle(payload: UnknownRecord, parsedBodyTitle: string) {
  return firstString(
    readNestedString(payload, ["title"]),
    readNestedString(payload, ["draft_title"]),
    readNestedString(payload, ["draft", "title"]),
    parsedBodyTitle,
    readNestedString(payload, ["name"]),
    "Untitled event"
  );
}

function extractCategory(payload: UnknownRecord, parsedCategory: string | null, tags: string[]) {
  const tagCategory = tags.find((tag) => tag.startsWith("category:"));
  if (tagCategory) {
    return tagCategory.slice("category:".length).trim() || null;
  }

  return firstString(
    readNestedString(payload, ["category"]),
    parsedCategory ?? "",
    readNestedString(payload, ["draft", "category"])
  ) || null;
}

function extractStatus(payload: UnknownRecord, eventName: string, hasUsableDate: boolean) {
  const lower = normalizeKey(eventName);
  const payloadStatus = normalizeKey(
    firstString(
      readNestedString(payload, ["status"]),
      readNestedString(payload, ["state"]),
      readNestedString(payload, ["draft_status"])
    )
  );

  if (lower.includes("published") || payloadStatus === "published") {
    return hasUsableDate ? "published" : "draft";
  }

  return "draft";
}

function buildSlug(title: string, date: string | null, sourceId: string) {
  const base = toEventKey(title, date) || slugify(sourceId || "event");
  return base || "event";
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function verifyWebhookSignature(rawBody: string, headers: Headers) {
  const secret =
    import.meta.env.TYPEFULLY_WEBHOOK_SECRET ??
    import.meta.env.WEBHOOK_SECRET ??
    import.meta.env.TYPEFULLY_SECRET ??
    "";

  if (!secret) {
    return import.meta.env.DEV;
  }

  const directSecret = firstString(
    headers.get("x-typefully-secret"),
    headers.get("x-webhook-secret"),
    headers.get("x-shared-secret")
  );
  if (directSecret && safeCompare(directSecret, secret)) {
    return true;
  }

  const signature = firstString(
    headers.get("x-typefully-signature"),
    headers.get("x-webhook-signature"),
    headers.get("x-signature")
  );
  if (!signature) {
    return false;
  }

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const variants = [digest, `sha256=${digest}`];
  return variants.some((variant) => safeCompare(signature, variant));
}

async function upsertEventRecord(record: EventRecord, rawPayload: UnknownRecord, webhookEventName: string, deliveryKey: string) {
  await ensureLibsqlSchema();

  const db = getLibsqlClient();
  const tx = await db.transaction();
  const sourceKey = record.sourceKey ?? `typefully:${record.slug}`;
  try {
    const deliveryInsert = await tx.execute({
      sql: `INSERT OR IGNORE INTO webhook_deliveries (delivery_key, event_name, payload, received_at)
            VALUES (?, ?, ?, datetime('now'))`,
      args: [deliveryKey, webhookEventName, jsonText(rawPayload)],
    });

    if (deliveryInsert.rowsAffected === 0) {
      await tx.rollback();
      return { duplicate: true };
    }

    await tx.execute({
      sql: `
        INSERT INTO events (
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
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(source_key) DO UPDATE SET
          slug = excluded.slug,
          title = excluded.title,
          date = excluded.date,
          time = excluded.time,
          category = excluded.category,
          description = excluded.description,
          venue = excluded.venue,
          location = excluded.location,
          map = excluded.map,
          poster = excluded.poster,
          max_participants = excluded.max_participants,
          tags = excluded.tags,
          status = excluded.status,
          source = excluded.source,
          source_metadata = excluded.source_metadata,
          body = excluded.body,
          updated_at = datetime('now')
      `,
      args: [
        randomUUID(),
        sourceKey,
        record.slug,
        record.title,
        record.date,
        record.time ?? null,
        record.category ?? null,
        record.description ?? null,
        record.venue ?? null,
        record.location ?? null,
        record.map ?? null,
        record.poster ?? null,
        record.maxParticipants ?? null,
        jsonText(record.tags),
        record.status,
        record.source,
        jsonText(record.sourceMetadata ?? {}),
        record.body ?? null,
      ],
    });

    await tx.commit();
    return { duplicate: false };
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}

export async function handleTypefullyWebhook(rawBody: string, headers: Headers): Promise<TypefullyWebhookResult> {
  if (!verifyWebhookSignature(rawBody, headers)) {
    return {
      ok: false,
      reason: "Webhook signature verification failed",
    };
  }

  let payload: UnknownRecord;
  try {
    payload = JSON.parse(rawBody) as UnknownRecord;
  } catch {
    return {
      ok: false,
      reason: "Invalid JSON payload",
    };
  }

  const eventName = extractWebhookEventName(payload, headers) || "unknown";
  const deliveryKey = extractWebhookId(headers, payload) || createHmac("sha256", "typefully").update(rawBody).digest("hex");
  const body = extractBody(payload);
  const parsed = extractMetadataFromBody(body);

  const tags = extractTags(payload, parsed.extraTags);
  if (!hasEventTag(tags)) {
    return {
      ok: true,
      ignored: true,
      reason: "Missing event tag",
    };
  }

  const title = extractTitle(payload, parsed.title);
  const category = extractCategory(payload, parsed.category, tags);
  const sourceId = extractSourceId(payload);
  const slug = buildSlug(title, parsed.date, sourceId);
  const status = extractStatus(payload, eventName, Boolean(parsed.date));
  const sourceKey = sourceId ? `typefully:${sourceId}` : `typefully:${slug}`;

  const record: EventRecord = {
    slug,
    title,
    date: parsed.date,
    time: parsed.time,
    category,
    description: parsed.description,
    venue: parsed.venue,
    location: parsed.location,
    map: parsed.map,
    poster: parsed.poster,
    maxParticipants: parsed.maxParticipants,
    tags,
    status,
    source: "typefully",
    body,
    sourceKey,
    sourceMetadata: {
      webhookEventName: eventName,
      deliveryKey,
      sourceId,
      rawTags: tags,
      payload,
      parsed,
    },
  };

  const result = await upsertEventRecord(record, payload, eventName, deliveryKey);

  return {
    ok: true,
    ...result,
    status: record.status,
    slug: record.slug,
    title: record.title,
  };
}
