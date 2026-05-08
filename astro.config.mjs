import { defineConfig, sessionDrivers } from "astro/config";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel";
import emdash, { local, s3 } from "emdash/astro";
import { libsql, sqlite } from "emdash/db";

const emdashDatabaseUrl =
  process.env.LIBSQL_URL ||
  process.env.LIBSQL_DATABASE_URL ||
  process.env.EMDASH_DATABASE_URL ||
  process.env.TURSO_DATABASE_URL;

const emdashAuthToken =
  process.env.LIBSQL_AUTH_TOKEN ||
  process.env.EMDASH_AUTH_TOKEN ||
  process.env.TURSO_AUTH_TOKEN ||
  process.env.DATABASE_AUTH_TOKEN;

const emdashStorage =
  process.env.S3_ENDPOINT && process.env.S3_BUCKET
    ? s3()
    : local({
        directory: "./uploads",
        baseUrl: "/_emdash/api/media/file",
      });

// https://astro.build/config
export default defineConfig({
  session: {
    driver: sessionDrivers.fs({
      base: "./data/sessions",
    }),
    cookie: {
      name: "astro-session",
      sameSite: "lax",
      secure: false,
      httpOnly: true,
    },
  },
  integrations: [
    react(),
    markdoc(),
    emdash({
      database: emdashDatabaseUrl
        ? libsql({ url: emdashDatabaseUrl, authToken: emdashAuthToken })
        : sqlite({ url: "file:./data/emdash.db" }),
      storage: emdashStorage,
      plugins: [],
      fonts: {
        scripts: ["ethiopic"],
      },
    }),
  ],
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
