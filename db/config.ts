import { defineDb, column, defineTable } from "astro:db";

const NewMember = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    designation: column.text({ optional: true }),
    gender: column.text({ optional: true }),
    email: column.text({ optional: true }),
    number: column.text(),
    username: column.text({ optional: true }),
    profession: column.text({ optional: true }),
    birthDate: column.text({ optional: true }),
    bodPosition: column.text({ optional: true }),
    referral: column.text({ optional: true }),
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
