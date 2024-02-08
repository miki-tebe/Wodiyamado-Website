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
          directory: 'public/images/events',
          publicPath: '/images/events/'
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
        })
      },
    }),
  },
});
