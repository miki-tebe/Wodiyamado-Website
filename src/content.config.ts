import { defineCollection, z } from "astro:content";

// Content collections (have body content via .mdoc)
const events = defineCollection({
	type: "content",
	schema: z.object({
		// Keystatic used a slug field for title; here we keep a frontmatter title
		title: z.string(),
		// Store public image path as string (we're not using the image() helper since assets live in /public)
		poster: z.string().optional(),
		// Accept string or Date and coerce to Date
		date: z.coerce.date(),
		time: z.string().optional(),
		venue: z.string().optional(),
		map: z.string().url().optional(),
	}),
});

const blogs = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		category: z.string(),
		cover: z.string(),
		author: z.string().optional(),
		description: z.string().optional(),
	}),
});

// Data collections (YAML without body content)
const gallery = defineCollection({
	type: "data",
	schema: z.object({
		alt: z.string(),
		image: z.string(),
	}),
});

const donations = defineCollection({
	type: "data",
	schema: z.object({
		name: z.string(),
		description: z.string(),
	}),
});

const structures = defineCollection({
	type: "data",
		schema: z.object({
			// year comes from the filename (slug) in current content, so it's not required in YAML
			president: z.string().optional(),
			president_image: z.string().optional(),
			vicePresident: z.string().optional(),
			vicePresident_image: z.string().optional(),
			secretary: z.string().optional(),
			secretary_image: z.string().optional(),
			treasurer: z.string().optional(),
			treasurer_image: z.string().optional(),
			clubServiceDirector: z.string().optional(),
			clubServiceDirector_image: z.string().optional(),
			communityServiceDirector: z.string().optional(),
			communityServiceDirector_image: z.string().optional(),
			publicRelationDirector: z.string().optional(),
			publicRelationDirector_image: z.string().optional(),
			professionalDevelopmentAndStrategicPlanDirector: z.string().optional(),
			professionalDevelopmentAndStrategicPlanDirector_image: z.string().optional(),
			// also accept shorter alias used in components
			professionalDevelopmentDirector: z.string().optional(),
			professionalDevelopmentDirector_image: z.string().optional(),
			projectOfficer: z.string().optional(),
			projectOfficer_image: z.string().optional(),
			fundraisingDirector: z.string().optional(),
			fundraisingDirector_image: z.string().optional(),
			internationalServiceDirector: z.string().optional(),
			internationalServiceDirector_image: z.string().optional(),
			interactDirector: z.string().optional(),
			interactDirector_image: z.string().optional(),
			greenRotaractRepresentative: z.string().optional(),
			greenRotaractRepresentative_image: z.string().optional(),
			membershipAndRetentionDirector: z.string().optional(),
			membershipAndRetentionDirector_image: z.string().optional(),
			immediatePastPresident: z.string().optional(),
			immediatePastPresident_image: z.string().optional(),
		}),
});

export const collections = {
	events,
	blogs,
	gallery,
	donations,
		structures,
};

