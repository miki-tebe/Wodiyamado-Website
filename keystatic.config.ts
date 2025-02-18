// keystatic.config.ts
import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  cloud: {
    project: "wodiyamado/wodiyamado-website",
  },
  collections: {
    events: collection({
      label: "Events",
      slugField: "title",
      path: "src/content/events/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.document({
          label: "Content",
          description: "Description/Detail of the event",
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
        poster: fields.image({
          label: "Poster",
          description: "The poster for this event",
          directory: "public/images/events",
          publicPath: "/images/events/",
        }),
        date: fields.date({
          label: "Date",
          description: "The date of the event",
          validation: {
            isRequired: true,
          },
        }),
        time: fields.text({
          label: "Time",
          description: "The time of the event",
        }),
        venue: fields.text({
          label: "Venue",
          description: "The venue for this event",
        }),
        map: fields.url({
          label: "Map",
          description: "Link to the map",
        }),
      },
    }),
    clubStructures: collection({
      label: "Club Structures",
      slugField: "year",
      path: "src/content/structures/*",
      schema: {
        year: fields.text({
          label: "Year",
          description: "The year of the club structure",
        }),
        president: fields.text({
          label: "President",
          description: "The president of the club",
        }),
        president_image: fields.image({
          label: "President Image",
          description: "The image of the president of the club",
          directory: "public/images/presidents",
          publicPath: "/images/presidents/",
        }),
        vicePresident: fields.text({
          label: "Vice President",
          description: "The vice president of the club",
        }),
        vicePresident_image: fields.image({
          label: "Vice President Image",
          description: "The image of the vice president of the club",
          directory: "public/images/vicePresidents",
          publicPath: "/images/vicePresidents/",
        }),
        secretary: fields.text({
          label: "Secretary",
          description: "The secretary of the club",
        }),
        secretary_image: fields.image({
          label: "Secretary Image",
          description: "The image of the secretary of the club",
          directory: "public/images/secretaries",
          publicPath: "/images/secretaries/",
        }),
        treasurer: fields.text({
          label: "Treasurer",
          description: "The treasurer of the club",
        }),
        treasurer_image: fields.image({
          label: "Treasurer Image",
          description: "The image of the treasurer of the club",
          directory: "public/images/treasurers",
          publicPath: "/images/treasurers/",
        }),
        clubServiceDirector: fields.text({
          label: "Club Service Director",
          description: "The club service director of the club",
        }),
        clubServiceDirector_image: fields.image({
          label: "Club Service Director Image",
          description: "The image of the club service director of the club",
          directory: "public/images/clubServiceDirectors",
          publicPath: "/images/clubServiceDirectors/",
        }),
        communityServiceDirector: fields.text({
          label: "Community Service Director",
          description: "The community service director of the club",
        }),
        communityServiceDirector_image: fields.image({
          label: "Community Service Director Image",
          description:
            "The image of the community service director of the club",
          directory: "public/images/communityServiceDirectors",
          publicPath: "/images/communityServiceDirectors/",
        }),
        publicRelationDirector: fields.text({
          label: "Public Relation Director",
          description: "The public relation director of the club",
        }),
        publicRelationDirector_image: fields.image({
          label: "Public Relation Director Image",
          description: "The image of the public relation director of the club",
          directory: "public/images/publicRelationDirectors",
          publicPath: "/images/publicRelationDirectors/",
        }),
        professionalDevelopmentAndStrategicPlanDirector: fields.text({
          label: "Professional Development and Strategic Plan Director",
          description:
            "The professional development and strategic plan director of the club",
        }),
        professionalDevelopmentAndStrategicPlanDirector_image: fields.image({
          label: "Professional Development and Strategic Plan Director Image",
          description:
            "The image of the professional development and strategic plan director of the club",
          directory:
            "public/images/professionalDevelopmentAndStrategicPlanDirectors",
          publicPath:
            "/images/professionalDevelopmentAndStrategicPlanDirectors/",
        }),
        projectOfficer: fields.text({
          label: "Project Officer",
          description: "The project officer of the club",
        }),
        projectOfficer_image: fields.image({
          label: "Project Officer Image",
          description: "The image of the project officer of the club",
          directory: "public/images/projectOfficers",
          publicPath: "/images/projectOfficers/",
        }),
        fundraisingDirector: fields.text({
          label: "Fundraising Director",
          description: "The fundraising director of the club",
        }),
        fundraisingDirector_image: fields.image({
          label: "Fundraising Director Image",
          description: "The image of the fundraising director of the club",
          directory: "public/images/fundraisingDirectors",
          publicPath: "/images/fundraisingDirectors/",
        }),
        internationalServiceDirector: fields.text({
          label: "International Service Director",
          description: "The international service director of the club",
        }),
        internationalServiceDirector_image: fields.image({
          label: "International Service Director Image",
          description:
            "The image of the international service director of the club",
          directory: "public/images/internationalServiceDirectors",
          publicPath: "/images/internationalServiceDirectors/",
        }),
        interactDirector: fields.text({
          label: "Interact Director",
          description: "The interact director of the club",
        }),
        interactDirector_image: fields.image({
          label: "Interact Director Image",
          description: "The image of the interact director of the club",
          directory: "public/images/interactDirectors",
          publicPath: "/images/interactDirectors/",
        }),
        greenRotaractRepresentative: fields.text({
          label: "Green Rotaract Representative",
          description: "The green rotaract representative of the club",
        }),
        greenRotaractRepresentative_image: fields.image({
          label: "Green Rotaract Representative Image",
          description:
            "The image of the green rotaract representative of the club",
          directory: "public/images/greenRotaractRepresentatives",
          publicPath: "/images/greenRotaractRepresentatives/",
        }),
        membershipAndRetentionDirector: fields.text({
          label: "Membership and Retention Director",
          description: "The membership and retention director of the club",
        }),
        membershipAndRetentionDirector_image: fields.image({
          label: "Membership and Retention Director Image",
          description:
            "The image of the membership and retention director of the club",
          directory: "public/images/membershipAndRetentionDirectors",
          publicPath: "/images/membershipAndRetentionDirectors/",
        }),
        immediatePastPresident: fields.text({
          label: "Immediate Past President",
          description: "The immediate past president of the club",
        }),
        immediatePastPresident_image: fields.image({
          label: "Immediate Past President Image",
          description: "The image of the immediate past president of the club",
          directory: "public/images/immediatePastPresidents",
          publicPath: "/images/immediatePastPresidents/",
        }),
      },
    }),
    gallery: collection({
      label: "Gallery",
      slugField: "alt",
      path: "src/content/gallery/*",
      schema: {
        alt: fields.slug({ name: { label: "Alt Text" } }),
        image: fields.image({
          label: "Image",
          description: "The image for this gallery",
          directory: "public/images/gallery",
          publicPath: "/images/gallery/",
        }),
      },
    }),
    donations: collection({
      label: "Donations",
      slugField: "name",
      path: "src/content/donations/*",
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        description: fields.text({
          label: "Description",
          description: "The description of the donation",
        }),
      },
    }),
    blogs: collection({
      label: "Blogs",
      slugField: "title",
      path: "src/content/blogs/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({
          label: "Date",
          description: "The date of the blog",
          validation: {
            isRequired: true,
          },
          defaultValue: new Date().toISOString(),
        }),
        category: fields.text({
          label: "Category",
          description: "The category of the blog",
        }),
        cover: fields.image({
          label: "Cover",
          description: "The cover image for this blog",
          directory: "public/images/blogs",
          publicPath: "/images/blogs/",
        }),
        author: fields.text({
          label: "Author",
          description: "The author of the blog",
        }),
        content: fields.document({
          label: "Content",
          description: "Description/Detail of the blog",
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
