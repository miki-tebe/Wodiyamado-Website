import { createClient, type Client } from "@libsql/client/web";

const schemaStatements = [
  `
    CREATE TABLE IF NOT EXISTS webhook_deliveries (
      delivery_key TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      payload TEXT NOT NULL,
      received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      source_key TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      date TEXT,
      time TEXT,
      category TEXT,
      description TEXT,
      venue TEXT,
      location TEXT,
      map TEXT,
      poster TEXT,
      max_participants INTEGER,
      tags TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL,
      source TEXT NOT NULL,
      source_metadata TEXT NOT NULL DEFAULT '{}',
      body TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `,
  `CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, date)`,
];

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = import.meta.env[key as keyof ImportMetaEnv];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export function getLibsqlConfig() {
  const url = readEnv("LIBSQL_URL", "LIBSQL_DATABASE_URL", "TURSO_DATABASE_URL");
  const authToken = readEnv("LIBSQL_AUTH_TOKEN", "TURSO_AUTH_TOKEN", "DATABASE_AUTH_TOKEN");

  return { url, authToken };
}

export function getLibsqlClient() {
  if (client) {
    return client;
  }

  const { url, authToken } = getLibsqlConfig();
  if (!url) {
    throw new Error(
      "LibSQL is not configured. Set LIBSQL_URL (or LIBSQL_DATABASE_URL/TURSO_DATABASE_URL)."
    );
  }

  client = createClient({
    url,
    authToken: authToken ?? undefined,
  });

  return client;
}

export async function ensureLibsqlSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getLibsqlClient();
      for (const statement of schemaStatements) {
        await db.execute(statement);
      }
    })();
  }

  return schemaReady;
}

export function jsonText(value: unknown) {
  return JSON.stringify(value ?? null);
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
