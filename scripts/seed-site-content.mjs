import { applySeed } from "emdash/seed";
import { monotonicFactory } from "ulidx";
import { createEmdashDb } from "./emdash-db.mjs";

const createId = monotonicFactory();

const db = createEmdashDb();

const stats = [
  { slug: "active-members", label: "Active Members", stat_value: 50, suffix: "+", sort_order: 1 },
  { slug: "events-hosted", label: "Events Hosted", stat_value: 100, suffix: "+", sort_order: 2 },
  { slug: "years-active", label: "Years Active", stat_value: 10, suffix: "+", sort_order: 3 },
];

const socials = [
  {
    slug: "instagram",
    title: "Instagram",
    platform: "instagram",
    subtitle: "@racwodiyamado",
    url: "https://instagram.com/racwodiyamado",
    button_text: "Follow",
    class_name: "col-span-2 xl:col-span-1",
    sort_order: 1,
  },
  {
    slug: "facebook",
    title: "Facebook",
    platform: "facebook",
    subtitle: "facebook.com",
    url: "https://www.facebook.com/racwodiyamado?mibextid=ZbWKwL",
    class_name: "col-span-2 xl:col-span-1",
    sort_order: 2,
  },
  {
    slug: "spotify",
    title: "Spotify",
    platform: "spotify",
    url: "https://podcasters.spotify.com/pod/show/wodiyamado",
    button_text: "Play",
    button_icon: "play",
    class_name: "col-span-2 xl:col-span-1",
    sort_order: 3,
  },
  {
    slug: "tiktok",
    title: "TikTok",
    platform: "tiktok",
    subtitle: "@racwodiyamado",
    url: "https://tiktok.com/@racwodiyamado",
    button_text: "Follow",
    class_name: "col-span-2 xl:col-span-1",
    sort_order: 4,
  },
  {
    slug: "youtube",
    title: "Rotaract Club of Wodiyamado | YouTube",
    platform: "youtube",
    url: "https://youtube.com/@racwodiyamado",
    button_text: "Subscribe",
    class_name: "col-span-2",
    sort_order: 5,
  },
  {
    slug: "discord",
    title: "Rotaract Club of Wodiyamado | Discord",
    platform: "discord",
    subtitle: "discord.gg",
    url: "https://discord.gg/4mdy36rQnS",
    button_text: "Join",
    class_name: "col-span-2",
    sort_order: 6,
  },
  {
    slug: "linkedin",
    title: "Rotaract Club of Wodiyamado | LinkedIn",
    platform: "linkedin",
    subtitle: "linkedin.com",
    url: "https://www.linkedin.com/company/rotaract-club-of-wodiyamado",
    class_name: "col-span-2",
    sort_order: 7,
  },
  {
    slug: "twitter",
    title: "Twitter",
    platform: "twitter",
    subtitle: "@racwodiyamado",
    description:
      "Wodiyamado was established by 17 young professionals on November 13, 2009 as a community based Rotaract club i...",
    url: "https://twitter.com/racwodiyamado",
    button_text: "Follow",
    class_name: "col-span-2",
    sort_order: 8,
  },
  {
    slug: "telegram-channel",
    title: "Telegram Channel",
    platform: "telegram",
    subtitle: "t.me",
    url: "https://t.me/racwodiyamado",
    class_name: "col-span-2",
    sort_order: 9,
  },
  {
    slug: "telegram-group",
    title: "Telegram Group",
    platform: "telegram",
    subtitle: "t.me",
    url: "https://t.me/wodiyamado",
    class_name: "col-span-2",
    sort_order: 10,
  },
  {
    slug: "telegram-gallery",
    title: "Telegram Gallery",
    platform: "telegram",
    subtitle: "t.me",
    url: "https://t.me/racwodiyamadogallery",
    class_name: "col-span-2",
    sort_order: 11,
  },
  {
    slug: "chess-wm",
    title: "Chess WM",
    platform: "telegram",
    subtitle: "t.me",
    url: "https://t.me/chessWM",
    class_name: "col-span-2",
    sort_order: 12,
  },
];

try {
  const result = await applySeed(
    db,
    {
      version: "1",
      meta: {
        name: "Wodiyamado site dynamic content",
        description: "Editable homepage stats and social links.",
      },
      collections: [
        {
          slug: "site_stats",
          label: "Site Stats",
          labelSingular: "Site Stat",
          supports: ["drafts", "revisions"],
          fields: [
            { slug: "title", label: "Title", type: "string", required: true },
            { slug: "label", label: "Label", type: "string", required: true },
            { slug: "stat_value", label: "Value", type: "integer", required: true },
            { slug: "suffix", label: "Suffix", type: "string" },
            { slug: "sort_order", label: "Sort Order", type: "integer" },
          ],
        },
        {
          slug: "social_links",
          label: "Social Links",
          labelSingular: "Social Link",
          supports: ["drafts", "revisions"],
          fields: [
            { slug: "title", label: "Title", type: "string", required: true },
            { slug: "platform", label: "Platform", type: "string", required: true },
            { slug: "url", label: "URL", type: "url", required: true },
            { slug: "subtitle", label: "Subtitle", type: "string" },
            { slug: "description", label: "Description", type: "text" },
            { slug: "button_text", label: "Button Text", type: "string" },
            { slug: "button_icon", label: "Button Icon", type: "string" },
            { slug: "class_name", label: "Layout Class", type: "string" },
            { slug: "sort_order", label: "Sort Order", type: "integer" },
          ],
        },
      ],
      content: {
        site_stats: stats.map((stat) => ({
          id: `site-stat:${stat.slug}`,
          slug: stat.slug,
          status: "published",
          data: { title: stat.label, ...stat },
        })),
        social_links: socials.map((link) => ({
          id: `social-link:${link.slug}`,
          slug: link.slug,
          status: "published",
          data: link,
        })),
      },
    },
    { includeContent: true, onConflict: "update" },
  );

  console.log(JSON.stringify(result, null, 2));

  const siteStats = await db
    .selectFrom("_emdash_collections")
    .select("id")
    .where("slug", "=", "site_stats")
    .executeTakeFirst();

  if (siteStats) {
    await db
      .deleteFrom("_emdash_fields")
      .where("collection_id", "=", siteStats.id)
      .where("slug", "=", "value")
      .execute();

    for (const [slug, sortOrder] of [
      ["title", 0],
      ["label", 1],
      ["stat_value", 2],
      ["suffix", 3],
      ["sort_order", 4],
    ]) {
      await db
        .updateTable("_emdash_fields")
        .set({ sort_order: sortOrder })
        .where("collection_id", "=", siteStats.id)
        .where("slug", "=", slug)
        .execute();
    }

    const statRows = await db
      .selectFrom("ec_site_stats")
      .select(["id", "slug", "title", "label", "stat_value", "suffix", "sort_order"])
      .execute();

    for (const row of statRows) {
      const draftRevisionId = createId();
      await db
        .insertInto("revisions")
        .values({
          id: draftRevisionId,
          collection: "site_stats",
          entry_id: row.id,
          data: JSON.stringify({
            title: row.title,
            slug: row.slug,
            label: row.label,
            stat_value: row.stat_value,
            suffix: row.suffix,
            sort_order: row.sort_order,
          }),
        })
        .execute();

      await db
        .updateTable("ec_site_stats")
        .set({ draft_revision_id: draftRevisionId })
        .where("id", "=", row.id)
        .execute();
    }
  }
} finally {
  await db.destroy();
}
