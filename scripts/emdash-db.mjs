import { Kysely } from "kysely";
import { createDialect as createLibsqlDialect } from "emdash/db/libsql";
import { createDialect as createSqliteDialect } from "emdash/db/sqlite";

function readEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export function createEmdashDb() {
  const url = readEnv("LIBSQL_URL", "LIBSQL_DATABASE_URL", "EMDASH_DATABASE_URL", "TURSO_DATABASE_URL");
  const authToken = readEnv("LIBSQL_AUTH_TOKEN", "EMDASH_AUTH_TOKEN", "TURSO_AUTH_TOKEN", "DATABASE_AUTH_TOKEN");

  return new Kysely({
    dialect: url
      ? createLibsqlDialect({ url, authToken: authToken ?? undefined })
      : createSqliteDialect({ url: "file:./data/emdash.db" }),
  });
}
