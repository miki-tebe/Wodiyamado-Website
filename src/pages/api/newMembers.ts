export const prerender = false;

import type { APIRoute } from "astro";
import { NewMember, db } from "astro:db";

import { formSchema } from "@/components/JoinDialogComponent.tsx";

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.json();

  try {
    formSchema.parse(payload);
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error,
      }),
      { status: 400 }
    );
  }

  try {
    await db.insert(NewMember).values(payload);

    const transformedPayload = {
      "Full Name": payload.name,
      Position: payload.designation,
      Gender: payload.gender,
      Email: payload.email,
      "Phone Number": payload.number,
      "Telegram Username": payload.username,
      "Classification/Profession": payload.profession,
      "Date of Birth": payload.birthDate,
      bodPosition: payload.bodPosition,
      "Where did you hear about us?": payload.referral,
      "What skill set do you have?": payload.skill,
    };
    const response = await fetch("https://api.zerosheets.com/v1/sv5", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.ZERO_SHEETS_BEARER_TOKEN}`,
      },
      body: JSON.stringify(transformedPayload),
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
