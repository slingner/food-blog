import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { config } from "dotenv";
config({ path: ".env.local" });

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  // ─── Categories ───
  const [recipesCategory] = await db
    .insert(schema.categories)
    .values([
      { name: "Recipes", slug: "recipes", description: "All recipes", sortOrder: 0 },
      { name: "Techniques", slug: "techniques", description: "Cooking techniques and methods", sortOrder: 1 },
      { name: "Equipment", slug: "equipment", description: "Kitchen equipment reviews and guides", sortOrder: 2 },
      { name: "Ingredients", slug: "ingredients", description: "Ingredient deep dives", sortOrder: 3 },
      { name: "Holidays", slug: "holidays", description: "Holiday and seasonal recipes", sortOrder: 4 },
    ])
    .returning();

  // Sub-categories under Recipes
  const [dinner, desserts, breakfast] = await db
    .insert(schema.categories)
    .values([
      { name: "Dinner", slug: "dinner", description: "Main courses and dinner ideas", parentId: recipesCategory.id, sortOrder: 0 },
      { name: "Desserts", slug: "desserts", description: "Sweet treats and baked goods", parentId: recipesCategory.id, sortOrder: 1 },
      { name: "Breakfast", slug: "breakfast", description: "Morning meals and brunch", parentId: recipesCategory.id, sortOrder: 2 },
    ])
    .returning();

  console.log("Categories seeded");

  // ─── Recipe 1: Classic Pasta ───
  const [pasta] = await db
    .insert(schema.recipes)
    .values({
      title: "Classic Spaghetti Aglio e Olio",
      slug: "spaghetti-aglio-e-olio",
      description: "A simple, elegant Roman pasta that proves the best dishes need only a few perfect ingredients.",
      introHtml: `<p>There's a reason this dish has survived centuries in Italian kitchens — it's the ultimate expression of simplicity. Just garlic, olive oil, chili, and pasta, transformed into something far greater than the sum of its parts.</p><p>The key is patience: cook the garlic slowly until it turns golden (never brown), and use the starchy pasta water to create a silky emulsion that clings to every strand.</p>`,
      heroImage: null,
      prepTime: 5,
      cookTime: 20,
      restTime: 0,
      servings: 4,
      difficulty: "easy",
      published: true,
      featured: true,
      categoryId: dinner.id,
    })
    .returning();

  await db.insert(schema.ingredients).values([
    { recipeId: pasta.id, name: "Spaghetti", quantity: "1", unitUs: "lb", unitMetric: "g", quantityMetric: "450", sortOrder: 0 },
    { recipeId: pasta.id, name: "Extra virgin olive oil", quantity: "0.33", unitUs: "cup", unitMetric: "ml", quantityMetric: "80", sortOrder: 1 },
    { recipeId: pasta.id, name: "Garlic cloves, thinly sliced", quantity: "6", unitUs: "cloves", unitMetric: "cloves", quantityMetric: "6", sortOrder: 2 },
    { recipeId: pasta.id, name: "Red pepper flakes", quantity: "0.5", unitUs: "tsp", unitMetric: "tsp", quantityMetric: "0.5", note: "adjust to taste", sortOrder: 3 },
    { recipeId: pasta.id, name: "Fresh parsley, chopped", quantity: "0.25", unitUs: "cup", unitMetric: "g", quantityMetric: "15", sortOrder: 4 },
    { recipeId: pasta.id, name: "Kosher salt", quantity: null, unitUs: null, unitMetric: null, quantityMetric: null, note: "to taste", sortOrder: 5 },
  ]);

  await db.insert(schema.steps).values([
    { recipeId: pasta.id, stepNumber: 1, instruction: "Bring a large pot of generously salted water to a boil. Cook spaghetti according to package directions until just al dente. Reserve 1 cup of pasta water before draining." },
    { recipeId: pasta.id, stepNumber: 2, instruction: "While the pasta cooks, heat olive oil in a large skillet over medium-low heat. Add the sliced garlic and cook slowly, stirring occasionally, until golden — about 4-5 minutes. Do not let it brown.", tip: "Low and slow is the key here. Burnt garlic will make the dish bitter." },
    { recipeId: pasta.id, stepNumber: 3, instruction: "Add red pepper flakes to the garlic oil and cook for 30 seconds until fragrant." },
    { recipeId: pasta.id, stepNumber: 4, instruction: "Add the drained pasta to the skillet along with ½ cup of the reserved pasta water. Toss vigorously over medium heat for 1-2 minutes, until the oil and water emulsify into a silky sauce that coats the pasta. Add more pasta water if needed." },
    { recipeId: pasta.id, stepNumber: 5, instruction: "Remove from heat, toss with chopped parsley, and serve immediately. No cheese needed — let the garlic and oil shine." },
  ]);

  console.log("Recipe 1 seeded: Spaghetti Aglio e Olio");

  // ─── Recipe 2: Chocolate Chip Cookies ───
  const [cookies] = await db
    .insert(schema.recipes)
    .values({
      title: "Brown Butter Chocolate Chip Cookies",
      slug: "brown-butter-chocolate-chip-cookies",
      description: "Nutty brown butter, a touch of espresso, and two types of chocolate create the ultimate chewy cookie with crispy edges.",
      introHtml: `<p>After testing dozens of cookie recipes, this is the one. The secret weapon is brown butter — it adds a nutty, toffee-like depth that regular melted butter just can't match.</p><p>These cookies rest overnight in the fridge, which lets the flour fully hydrate and the flavors meld. The result is a cookie that's crispy on the edges, chewy in the center, with deep pockets of melted chocolate.</p>`,
      heroImage: null,
      prepTime: 20,
      cookTime: 12,
      restTime: 720,
      servings: 24,
      difficulty: "medium",
      published: true,
      featured: true,
      categoryId: desserts.id,
    })
    .returning();

  await db.insert(schema.ingredients).values([
    { recipeId: cookies.id, groupName: "Dry ingredients", name: "All-purpose flour", quantity: "2.25", unitUs: "cups", unitMetric: "g", quantityMetric: "280", sortOrder: 0 },
    { recipeId: cookies.id, groupName: "Dry ingredients", name: "Baking soda", quantity: "1", unitUs: "tsp", unitMetric: "tsp", quantityMetric: "1", sortOrder: 1 },
    { recipeId: cookies.id, groupName: "Dry ingredients", name: "Fine sea salt", quantity: "1", unitUs: "tsp", unitMetric: "tsp", quantityMetric: "1", sortOrder: 2 },
    { recipeId: cookies.id, groupName: "Dry ingredients", name: "Instant espresso powder", quantity: "1", unitUs: "tsp", unitMetric: "tsp", quantityMetric: "1", note: "optional but recommended", sortOrder: 3 },
    { recipeId: cookies.id, groupName: "Wet ingredients", name: "Unsalted butter", quantity: "1", unitUs: "cup", unitMetric: "g", quantityMetric: "225", note: "2 sticks", sortOrder: 4 },
    { recipeId: cookies.id, groupName: "Wet ingredients", name: "Dark brown sugar", quantity: "0.75", unitUs: "cup", unitMetric: "g", quantityMetric: "165", note: "packed", sortOrder: 5 },
    { recipeId: cookies.id, groupName: "Wet ingredients", name: "Granulated sugar", quantity: "0.5", unitUs: "cup", unitMetric: "g", quantityMetric: "100", sortOrder: 6 },
    { recipeId: cookies.id, groupName: "Wet ingredients", name: "Large eggs", quantity: "2", unitUs: "eggs", unitMetric: "eggs", quantityMetric: "2", sortOrder: 7 },
    { recipeId: cookies.id, groupName: "Wet ingredients", name: "Vanilla extract", quantity: "2", unitUs: "tsp", unitMetric: "tsp", quantityMetric: "2", sortOrder: 8 },
    { recipeId: cookies.id, groupName: "Mix-ins", name: "Dark chocolate chips", quantity: "1", unitUs: "cup", unitMetric: "g", quantityMetric: "170", sortOrder: 9 },
    { recipeId: cookies.id, groupName: "Mix-ins", name: "Milk chocolate, chopped", quantity: "0.5", unitUs: "cup", unitMetric: "g", quantityMetric: "85", sortOrder: 10 },
    { recipeId: cookies.id, groupName: "Mix-ins", name: "Flaky sea salt", quantity: null, unitUs: null, unitMetric: null, quantityMetric: null, note: "for topping", sortOrder: 11 },
  ]);

  await db.insert(schema.steps).values([
    { recipeId: cookies.id, stepNumber: 1, instruction: "Brown the butter: Cut butter into pieces and melt in a light-colored saucepan over medium heat. Swirl occasionally until the butter foams, then turns golden with brown bits on the bottom — about 5 minutes. Pour into a heatproof bowl (scrape in those brown bits!) and let cool for 10 minutes.", tip: "Use a light-colored pan so you can see the butter changing color. It goes from brown to burnt quickly." },
    { recipeId: cookies.id, stepNumber: 2, instruction: "Whisk flour, baking soda, salt, and espresso powder together in a medium bowl. Set aside." },
    { recipeId: cookies.id, stepNumber: 3, instruction: "Add both sugars to the brown butter and whisk vigorously until smooth. Add eggs one at a time, whisking well after each. Stir in vanilla." },
    { recipeId: cookies.id, stepNumber: 4, instruction: "Fold the dry ingredients into the wet ingredients with a spatula until just combined — don't overmix. Fold in chocolate chips and chopped chocolate." },
    { recipeId: cookies.id, stepNumber: 5, instruction: "Cover the dough and refrigerate for at least 12 hours (up to 72 hours). This step is non-negotiable — it makes all the difference.", tip: "The overnight rest lets the flour fully hydrate and develops deeper flavor. Trust the process." },
    { recipeId: cookies.id, stepNumber: 6, instruction: "When ready to bake, preheat oven to 375°F (190°C). Scoop dough into 2-tablespoon balls and place on parchment-lined baking sheets, 3 inches apart. Sprinkle with flaky sea salt." },
    { recipeId: cookies.id, stepNumber: 7, instruction: "Bake for 10-12 minutes until the edges are set and golden but the centers still look slightly underdone. Let cool on the pan for 5 minutes, then transfer to a wire rack." },
  ]);

  console.log("Recipe 2 seeded: Brown Butter Chocolate Chip Cookies");

  // ─── Recipe 3: Japanese Breakfast ───
  const [tamagoyaki] = await db
    .insert(schema.recipes)
    .values({
      title: "Tamagoyaki (Japanese Rolled Omelette)",
      slug: "tamagoyaki-japanese-rolled-omelette",
      description: "A sweet and savory rolled omelette that's a staple of Japanese home cooking — lighter and more delicate than Western omelets.",
      introHtml: `<p>Tamagoyaki is one of those dishes that looks deceptively simple but rewards practice. The technique — pouring thin layers of seasoned egg and rolling them into a log — becomes meditative once you get the rhythm.</p><p>You don't need a special rectangular pan (though it helps). A small non-stick skillet works perfectly. The key is keeping the heat medium-low and working quickly.</p>`,
      heroImage: null,
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: "medium",
      published: true,
      featured: false,
      categoryId: breakfast.id,
    })
    .returning();

  await db.insert(schema.ingredients).values([
    { recipeId: tamagoyaki.id, name: "Large eggs", quantity: "4", unitUs: "eggs", unitMetric: "eggs", quantityMetric: "4", sortOrder: 0 },
    { recipeId: tamagoyaki.id, name: "Dashi stock", quantity: "2", unitUs: "tbsp", unitMetric: "ml", quantityMetric: "30", note: "or water with a pinch of dashi powder", sortOrder: 1 },
    { recipeId: tamagoyaki.id, name: "Mirin", quantity: "1", unitUs: "tbsp", unitMetric: "ml", quantityMetric: "15", sortOrder: 2 },
    { recipeId: tamagoyaki.id, name: "Soy sauce", quantity: "0.5", unitUs: "tsp", unitMetric: "tsp", quantityMetric: "0.5", sortOrder: 3 },
    { recipeId: tamagoyaki.id, name: "Sugar", quantity: "1", unitUs: "tsp", unitMetric: "tsp", quantityMetric: "1", sortOrder: 4 },
    { recipeId: tamagoyaki.id, name: "Neutral oil", quantity: null, unitUs: null, unitMetric: null, quantityMetric: null, note: "for the pan", sortOrder: 5 },
  ]);

  await db.insert(schema.steps).values([
    { recipeId: tamagoyaki.id, stepNumber: 1, instruction: "Whisk eggs gently in a bowl — you want them mixed but not frothy. Stir in dashi, mirin, soy sauce, and sugar until the sugar dissolves." },
    { recipeId: tamagoyaki.id, stepNumber: 2, instruction: "Heat a small non-stick pan or tamagoyaki pan over medium-low heat. Lightly oil the surface with a paper towel." },
    { recipeId: tamagoyaki.id, stepNumber: 3, instruction: "Pour a thin layer of egg mixture into the pan, tilting to cover the surface evenly. When the bottom is set but the top is still slightly wet, roll the egg toward you using chopsticks or a spatula.", tip: "Don't wait for the egg to fully set — the residual heat will finish cooking it as you roll." },
    { recipeId: tamagoyaki.id, stepNumber: 4, instruction: "Push the rolled egg back to the far side of the pan. Oil the empty surface again, pour another thin layer of egg, lifting the roll to let egg flow underneath. When set, roll again toward you." },
    { recipeId: tamagoyaki.id, stepNumber: 5, instruction: "Repeat until all the egg is used — usually 4-5 layers. Transfer to a cutting board, let rest for 1 minute, then slice into rounds." },
  ]);

  console.log("Recipe 3 seeded: Tamagoyaki");

  // ─── Sample reviews ───
  await db.insert(schema.reviews).values([
    { recipeId: pasta.id, name: "Maria", email: "maria@example.com", rating: 5, comment: "So simple yet so perfect. This is now my go-to weeknight dinner.", approved: true },
    { recipeId: pasta.id, name: "James", email: "james@example.com", rating: 4, comment: "Great recipe! I added a squeeze of lemon at the end which really brightened it up.", approved: true },
    { recipeId: cookies.id, name: "Sarah", email: "sarah@example.com", rating: 5, comment: "The brown butter makes ALL the difference. Best cookies I've ever made.", approved: true },
  ]);

  console.log("Reviews seeded");
  console.log("✓ Database seeded successfully!");
}

seed().catch(console.error);
