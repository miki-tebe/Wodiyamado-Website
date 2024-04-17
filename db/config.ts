import { defineDb, column, defineTable } from "astro:db";

const NewMember = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    number: column.text(),
    username: column.text(),
    referral: column.text(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { NewMember },
});
