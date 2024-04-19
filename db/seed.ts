import { db, Member } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Member).values([
    {
      firstName: "Jon",
      lastName: "Snow",
      quote:
        "Winter is coming. Winter is coming. Winter is coming, Better be prepared.",
      isApproved: true,
    },
    {
      firstName: "Enjoy",
      lastName: "Coding",
      quote: "I love coding.",
      isApproved: true,
    },
    {
      firstName: "Jon",
      lastName: "Snow",
      quote: "Winter is coming.",
      isApproved: true,
    },
    {
      firstName: "Enjoy",
      lastName: "Coding",
      quote: "I love coding.",
      isApproved: true,
    },
    {
      firstName: "Jon",
      lastName: "Snow",
      quote: "Winter is coming.",
      isApproved: true,
    },
    {
      firstName: "Enjoy",
      lastName: "Coding",
      quote: "I love coding.",
      isApproved: true,
    },
  ]);
}
