export const prerender = false;

import { Resend } from "resend";
import { render } from "@react-email/render";
import type { APIRoute } from "astro";

import { formSchema } from "@/components/JoinDialogComponent.tsx";
import WodiyamadoWelcomeEmail from "@/components/WodiyamadoWelcomeEmail";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

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
    const sheetResponse = await fetch("https://api.zerosheets.com/v1/sv5", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.ZERO_SHEETS_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedPayload),
    });

    if (!sheetResponse.ok) {
      const errorBody = await sheetResponse.text();
      throw new Error(
        `Failed to record member on Google Sheet: ${sheetResponse.status} ${sheetResponse.statusText} - ${errorBody}`
      );
    }
    /* 
    Subject: Welcome to Wodiyamado – We’ll Be in Touch Soon!

Dear [Member's Name],

Thank you for joining Rotaract Club of Wodiyamado! We're thrilled to have you as part of our community.

Your membership has been accepted, and we’ll be reaching out soon with more details on next steps, upcoming events, and how you can get involved.

In the meantime, feel free to explore our website or check out our socials to learn more about what we do.

We’d also love to see you at our weekly Coffee Time—happening every Tuesday at Spanish Café and Restaurant after 5:30 PM! It’s a great way to meet fellow members, share ideas, and unwind. 

Looking forward to connecting soon!

Best,
Membership Extension and Retention Team
Rotaract Club of Wodiyamado
*/
    const emailBody = `
    <p>Dear ${payload.name},</p>
    <p>Thank you for joining <strong>Rotaract Club of Wodiyamado!</strong> We're thrilled to have you as part of our community.</p>
    <p>Your membership has been accepted, and we’ll be reaching out soon with more details on next steps, upcoming events, and how you can get involved.</p>
    <p>In the meantime, feel free to explore our <a href="https://www.racwodiyamado.org/">website</a> or check out our <a href="https://www.racwodiyamado.org/contact">socials</a> to learn more about what we do.</p>
    <p>We’d also love to see you at our <strong>weekly Coffee Time</strong>—happening <strong>every Tuesday at <a href="https://maps.app.goo.gl/q1QirRANFuzE8Bkx5">Karavan Cake Coffee Food | Next to BIS</a> after 5:30 PM!</strong> It’s a great way to meet fellow members, share ideas, and unwind.</p>
    <p>Looking forward to connecting soon!</p>
    <p><strong>Best,</strong></p>
    <p><strong>Membership Extension and Retention Team</strong></p>
    <p><strong>Rotaract Club of Wodiyamado</strong></p>
    `;

    const emailHtml = await render(WodiyamadoWelcomeEmail({ firstName: payload.name.split(" ")[0] || "there" }));
    const { error } = await resend.emails.send({
      from: "noreply@racwodiyamado.org",
      to: payload.email,
      subject: "Welcome to Wodiyamado – We’ll Be in Touch Soon!",
      html: emailHtml,
    });
    if (error) {
      throw new Error("Failed to send email");
    }
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
