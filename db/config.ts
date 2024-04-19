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

const Member = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    firstName: column.text(),
    lastName: column.text(),
    quote: column.text(),
    isApproved: column.boolean({ default: false }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { NewMember, Member },
});
