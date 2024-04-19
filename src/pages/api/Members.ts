export const prerender = false;

import type { APIRoute } from "astro";
import { Member, db } from "astro:db";

import { formSchema } from "@/components/MemberDialogComponent.tsx";

export const POST: APIRoute = async ({ request }) => {
  const { firstName, lastName, quote } = await request.json();

  try {
    formSchema.parse({ firstName, lastName, quote });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error,
      }),
      { status: 400 }
    );
  }

  try {
    await db.insert(Member).values({ firstName, lastName, quote });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "error",
      }),
      { status: 400 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "success",
    }),
    { status: 200 }
  );
};
