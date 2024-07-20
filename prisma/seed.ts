import { db } from "../src/server/db";
import { faker } from "@faker-js/faker";

async function main() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await db.$transaction(async (tx) => {
    await tx.category.deleteMany();

    const categories = generateUniqueCategories();

    await tx.category.createMany({
      data: categories,
      skipDuplicates: true,
    });

    console.log("Seeding completed.");
  });
}

function generateUniqueCategories() {
  const set = new Set<string>();

  while (set.size < 100) {
    const category =
      faker.commerce.productAdjective() + " " + faker.commerce.productName();

    set.add(category);
  }

  return Array.from(set).map((category) => ({
    name: category,
  }));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await db.$disconnect();
  });
