import { Kysely } from "kysely";
import { createDialect as createLibsqlDialect } from "emdash/db/libsql";
import { createDialect as createSqliteDialect } from "emdash/db/sqlite";

type Db = any;

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value =
      typeof process !== "undefined"
        ? process.env[key]
        : import.meta.env[key as keyof ImportMetaEnv];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export function getEmdashDatabaseConfig() {
  const url = readEnv("LIBSQL_URL", "LIBSQL_DATABASE_URL", "EMDASH_DATABASE_URL", "TURSO_DATABASE_URL");
  const authToken = readEnv("LIBSQL_AUTH_TOKEN", "EMDASH_AUTH_TOKEN", "TURSO_AUTH_TOKEN", "DATABASE_AUTH_TOKEN");

  if (url) {
    return {
      kind: "libsql" as const,
      url,
      authToken: authToken ?? undefined,
    };
  }

  return {
    kind: "sqlite" as const,
    url: "file:./data/emdash.db",
  };
}

export function createEmdashDb() {
  const config = getEmdashDatabaseConfig();

  return new Kysely<Db>({
    dialect:
      config.kind === "libsql"
        ? createLibsqlDialect({ url: config.url, authToken: config.authToken })
        : createSqliteDialect({ url: config.url }),
  });
}
