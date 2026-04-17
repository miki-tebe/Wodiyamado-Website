export const prerender = false;

import type { APIRoute } from "astro";

import { handleTypefullyWebhook } from "@/lib/typefully-webhook";

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();
  const result = await handleTypefullyWebhook(rawBody, request.headers);

  if (!result.ok) {
    return new Response(JSON.stringify(result), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(result), {
    status: result.ignored ? 202 : 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
