export const prerender = false;

import type { APIRoute } from "astro";
import { NewMember, db } from "astro:db";

import { formSchema } from "@/components/JoinDialogComponent.tsx";

export const POST: APIRoute = async ({ request }) => {
  const { name, number, username, referral } = await request.json();

  try {
    formSchema.parse({ name, number, username, referral });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error,
      }),
      { status: 400 }
    );
  }

  try {
    await db.insert(NewMember).values({ name, number, username, referral });
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
