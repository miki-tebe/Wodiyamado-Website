/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly LIBSQL_URL?: string;
  readonly LIBSQL_DATABASE_URL?: string;
  readonly TURSO_DATABASE_URL?: string;
  readonly LIBSQL_AUTH_TOKEN?: string;
  readonly TURSO_AUTH_TOKEN?: string;
  readonly DATABASE_AUTH_TOKEN?: string;
  readonly TYPEFULLY_WEBHOOK_SECRET?: string;
  readonly WEBHOOK_SECRET?: string;
  readonly TYPEFULLY_SECRET?: string;
}
