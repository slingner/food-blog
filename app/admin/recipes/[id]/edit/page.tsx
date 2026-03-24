import { RecipeEditor } from "@/components/admin/RecipeEditor";
import { updateRecipe } from "@/lib/actions/recipe-actions";
import type { RecipeFormData } from "@/lib/types";

// Stub categories
const stubCategories = [
  { id: 1, name: "Breads", slug: "breads", description: null, parentId: null, sortOrder: 0, createdAt: new Date() },
  { id: 2, name: "Mains", slug: "mains", description: null, parentId: null, sortOrder: 1, createdAt: new Date() },
  { id: 3, name: "Desserts", slug: "desserts", description: null, parentId: null, sortOrder: 2, createdAt: new Date() },
  { id: 4, name: "Salads", slug: "salads", description: null, parentId: null, sortOrder: 3, createdAt: new Date() },
  { id: 5, name: "Soups", slug: "soups", description: null, parentId: null, sortOrder: 4, createdAt: new Date() },
];

// Stub recipe for editing
const stubRecipe: RecipeFormData & { id: number } = {
  id: 1,
  title: "Classic Sourdough Bread",
  slug: "classic-sourdough-bread",
  description: "A rustic sourdough with a crispy crust and chewy interior",
  introHtml: "<p>This recipe takes time but the results are worth it.</p>",
  heroImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
  heroVideo: null,
  prepTime: 30,
  cookTime: 45,
  restTime: 720,
  servings: 2,
  difficulty: "hard",
  published: true,
  featured: true,
  categoryId: 1,
  ingredients: [
    { groupName: null, name: "Bread flour", quantity: 500, unitUs: "cup", unitMetric: "g", quantityMetric: 500, note: null, sortOrder: 0 },
    { groupName: null, name: "Water", quantity: 1.5, unitUs: "cup", unitMetric: "ml", quantityMetric: 350, note: "lukewarm", sortOrder: 1 },
    { groupName: null, name: "Sourdough starter", quantity: 1, unitUs: "cup", unitMetric: "g", quantityMetric: 150, note: "active and bubbly", sortOrder: 2 },
    { groupName: null, name: "Salt", quantity: 2, unitUs: "tsp", unitMetric: "g", quantityMetric: 10, note: null, sortOrder: 3 },
  ],
  steps: [
    { stepNumber: 1, instruction: "<p>Mix flour and water, rest for 30 minutes (autolyse).</p>", imageUrl: null, tip: "This rest period develops gluten" },
    { stepNumber: 2, instruction: "<p>Add starter and salt, fold until combined.</p>", imageUrl: null, tip: null },
    { stepNumber: 3, instruction: "<p>Perform stretch and folds every 30 minutes for 2 hours.</p>", imageUrl: null, tip: "Wet your hands to prevent sticking" },
  ],
};

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipeId = Number(id);

  async function handleSave(data: RecipeFormData) {
    "use server";
    return updateRecipe(recipeId, data);
  }

  return (
    <RecipeEditor
      initialData={stubRecipe}
      categories={stubCategories}
      onSave={handleSave}
    />
  );
}
