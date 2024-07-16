export const prerender = false;

import type { APIRoute } from "astro";
import { NewMember, db } from "astro:db";

import { formSchema } from "@/components/JoinDialogComponent.tsx";

export const POST: APIRoute = async ({ request }) => {
  const {
    name,
    designation,
    gender,
    email,
    number,
    username,
    profession,
    birthDate,
    bodPosition,
    referral,
    skill,
  } = await request.json();

  try {
    formSchema.parse({
      name,
      designation,
      gender,
      email,
      number,
      username,
      profession,
      birthDate,
      bodPosition,
      referral,
      skill,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error,
      }),
      { status: 400 }
    );
  }

  try {
    await db.insert(NewMember).values({
      name,
      designation,
      gender,
      email,
      number,
      username,
      profession,
      birthDate,
      bodPosition,
      referral,
      skill,
    });
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
