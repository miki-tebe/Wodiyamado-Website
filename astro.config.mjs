import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import keystatic from "@keystatic/astro";
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel/serverless";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    markdoc(),
    keystatic(),
    db(),
  ],
  output: "hybrid",
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
