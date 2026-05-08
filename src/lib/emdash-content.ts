import type { Kysely } from "kysely";
import { createEmdashDb } from "./emdash-db";

type ImageValue = {
  src?: string;
  alt?: string;
};

type Db = any;

export interface CmsEntry<T> {
  id: string;
  slug: string;
  data: T;
}

export interface CmsBlog {
  title: string;
  date: Date;
  category: string;
  cover: string;
  author?: string;
  description?: string;
}

export interface CmsGalleryItem {
  alt: string;
  image: string;
}

export interface CmsDonation {
  name: string;
  description: string;
}

export type CmsStructure = Record<string, string | undefined>;

export interface CmsSiteStat {
  label: string;
  value: number;
  suffix?: string;
  sort_order: number;
}

export interface CmsSocialLink {
  title: string;
  platform: string;
  url: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_icon?: string;
  class_name?: string;
  sort_order: number;
}

function parseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function imageSrc(value: unknown) {
  if (typeof value === "string" && value.startsWith("/")) return value;
  return parseJson<ImageValue>(value)?.src ?? "";
}

function toDate(value: unknown) {
  const date = value ? new Date(String(value)) : new Date(0);
  return Number.isNaN(date.valueOf()) ? new Date(0) : date;
}

async function categoryMap(db: Kysely<Db>) {
  const rows = await db
    .selectFrom("content_taxonomies as ct")
    .innerJoin("taxonomies as t", "t.id", "ct.taxonomy_id")
    .select(["ct.entry_id as entryId", "t.label as label"])
    .where("ct.collection", "=", "posts")
    .where("t.name", "=", "category")
    .execute();

  return new Map(rows.map((row) => [String(row.entryId), String(row.label)]));
}

export async function getCmsBlogs(limit?: number) {
  const db = createEmdashDb();
  try {
    const categories = await categoryMap(db);
    const rows = await db
      .selectFrom("ec_posts")
      .selectAll()
      .where("status", "=", "published")
      .where("deleted_at", "is", null)
      .orderBy("published_at", "desc")
      .execute();

    const entries = rows.map((row) => ({
      id: String(row.slug),
      slug: String(row.slug),
      data: {
        title: String(row.title ?? ""),
        date: toDate(row.date ?? row.published_at),
        category: categories.get(String(row.id)) ?? "Blog",
        cover: imageSrc(row.featured_image),
        description: row.excerpt ? String(row.excerpt) : undefined,
      },
    })) satisfies CmsEntry<CmsBlog>[];

    return typeof limit === "number" ? entries.slice(0, limit) : entries;
  } finally {
    await db.destroy();
  }
}

export async function getCmsGallery(limit?: number) {
  const db = createEmdashDb();
  try {
    const rows = await db
      .selectFrom("ec_gallery")
      .selectAll()
      .where("status", "=", "published")
      .where("deleted_at", "is", null)
      .orderBy("published_at", "desc")
      .execute();

    const entries = rows.map((row) => ({
      id: String(row.slug),
      slug: String(row.slug),
      data: {
        alt: String(row.alt ?? row.title ?? ""),
        image: imageSrc(row.image),
      },
    })) satisfies CmsEntry<CmsGalleryItem>[];

    return typeof limit === "number" ? entries.slice(0, limit) : entries;
  } finally {
    await db.destroy();
  }
}

export async function getCmsDonations() {
  const db = createEmdashDb();
  try {
    const rows = await db
      .selectFrom("ec_donations")
      .selectAll()
      .where("status", "=", "published")
      .where("deleted_at", "is", null)
      .orderBy("published_at", "desc")
      .execute();

    return rows.map((row) => ({
      id: String(row.slug),
      slug: String(row.slug),
      data: {
        name: String(row.name ?? row.title ?? ""),
        description: String(row.description ?? ""),
      },
    })) satisfies CmsEntry<CmsDonation>[];
  } finally {
    await db.destroy();
  }
}

const structureFieldMap: Record<string, string> = {
  president: "president",
  president_image: "president_image",
  vice_president: "vicePresident",
  vice_president_image: "vicePresident_image",
  secretary: "secretary",
  secretary_image: "secretary_image",
  treasurer: "treasurer",
  treasurer_image: "treasurer_image",
  club_service_director: "clubServiceDirector",
  club_service_director_image: "clubServiceDirector_image",
  community_service_director: "communityServiceDirector",
  community_service_director_image: "communityServiceDirector_image",
  public_relation_director: "publicRelationDirector",
  public_relation_director_image: "publicRelationDirector_image",
  professional_development_and_strategic_plan_director:
    "professionalDevelopmentAndStrategicPlanDirector",
  professional_development_and_strategic_plan_director_image:
    "professionalDevelopmentAndStrategicPlanDirector_image",
  professional_development_director: "professionalDevelopmentDirector",
  professional_development_director_image: "professionalDevelopmentDirector_image",
  project_officer: "projectOfficer",
  project_officer_image: "projectOfficer_image",
  fundraising_director: "fundraisingDirector",
  fundraising_director_image: "fundraisingDirector_image",
  international_service_director: "internationalServiceDirector",
  international_service_director_image: "internationalServiceDirector_image",
  interact_director: "interactDirector",
  interact_director_image: "interactDirector_image",
  green_rotaract_representative: "greenRotaractRepresentative",
  green_rotaract_representative_image: "greenRotaractRepresentative_image",
  membership_and_retention_director: "membershipAndRetentionDirector",
  membership_and_retention_director_image: "membershipAndRetentionDirector_image",
  immediate_past_president: "immediatePastPresident",
  immediate_past_president_image: "immediatePastPresident_image",
};

export async function getCmsStructures() {
  const db = createEmdashDb();
  try {
    const rows = await db
      .selectFrom("ec_structures")
      .selectAll()
      .where("status", "=", "published")
      .where("deleted_at", "is", null)
      .orderBy("slug", "desc")
      .execute();

    return rows.map((row) => {
      const data: CmsStructure = {};
      for (const [source, target] of Object.entries(structureFieldMap)) {
        const value = row[source];
        data[target] = target.endsWith("_image") ? imageSrc(value) : value ? String(value) : undefined;
      }

      return {
        id: String(row.slug),
        slug: String(row.slug),
        data,
      };
    }) satisfies CmsEntry<CmsStructure>[];
  } finally {
    await db.destroy();
  }
}

export async function getCmsSiteStats() {
  const db = createEmdashDb();
  try {
    const rows = await db
      .selectFrom("ec_site_stats")
      .selectAll()
      .where("status", "=", "published")
      .where("deleted_at", "is", null)
      .orderBy("sort_order", "asc")
      .execute();

    const entries = rows.map((row) => ({
      id: String(row.slug),
      slug: String(row.slug),
      data: {
        label: String(row.label ?? row.title ?? ""),
        value: Number(row.stat_value ?? row.value ?? 0),
        suffix: row.suffix ? String(row.suffix) : "",
        sort_order: Number(row.sort_order ?? 0),
      },
    })) satisfies CmsEntry<CmsSiteStat>[];

    return entries.length
      ? entries
      : [
          { id: "active-members", slug: "active-members", data: { label: "Active Members", value: 50, suffix: "+", sort_order: 1 } },
          { id: "events-hosted", slug: "events-hosted", data: { label: "Events Hosted", value: 100, suffix: "+", sort_order: 2 } },
          { id: "years-active", slug: "years-active", data: { label: "Years Active", value: 10, suffix: "+", sort_order: 3 } },
        ];
  } catch {
    return [
      { id: "active-members", slug: "active-members", data: { label: "Active Members", value: 50, suffix: "+", sort_order: 1 } },
      { id: "events-hosted", slug: "events-hosted", data: { label: "Events Hosted", value: 100, suffix: "+", sort_order: 2 } },
      { id: "years-active", slug: "years-active", data: { label: "Years Active", value: 10, suffix: "+", sort_order: 3 } },
    ];
  } finally {
    await db.destroy();
  }
}

export async function getCmsSocialLinks() {
  const db = createEmdashDb();
  try {
    const rows = await db
      .selectFrom("ec_social_links")
      .selectAll()
      .where("status", "=", "published")
      .where("deleted_at", "is", null)
      .orderBy("sort_order", "asc")
      .execute();

    return rows.map((row) => ({
      id: String(row.slug),
      slug: String(row.slug),
      data: {
        title: String(row.title ?? ""),
        platform: String(row.platform ?? "link"),
        url: String(row.url ?? "#"),
        subtitle: row.subtitle ? String(row.subtitle) : undefined,
        description: row.description ? String(row.description) : undefined,
        button_text: row.button_text ? String(row.button_text) : undefined,
        button_icon: row.button_icon ? String(row.button_icon) : undefined,
        class_name: row.class_name ? String(row.class_name) : undefined,
        sort_order: Number(row.sort_order ?? 0),
      },
    })) satisfies CmsEntry<CmsSocialLink>[];
  } finally {
    await db.destroy();
  }
}
