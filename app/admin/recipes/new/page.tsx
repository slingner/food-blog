import { RecipeEditor } from "@/components/admin/RecipeEditor";
import { createRecipe } from "@/lib/actions/recipe-actions";
import type { RecipeFormData } from "@/lib/types";

// Stub categories until DB is wired
const stubCategories = [
  { id: 1, name: "Breads", slug: "breads", description: null, parentId: null, sortOrder: 0, createdAt: new Date() },
  { id: 2, name: "Mains", slug: "mains", description: null, parentId: null, sortOrder: 1, createdAt: new Date() },
  { id: 3, name: "Desserts", slug: "desserts", description: null, parentId: null, sortOrder: 2, createdAt: new Date() },
  { id: 4, name: "Salads", slug: "salads", description: null, parentId: null, sortOrder: 3, createdAt: new Date() },
  { id: 5, name: "Soups", slug: "soups", description: null, parentId: null, sortOrder: 4, createdAt: new Date() },
];

export default function NewRecipePage() {
  async function handleSave(data: RecipeFormData) {
    "use server";
    return createRecipe(data);
  }

  return <RecipeEditor categories={stubCategories} onSave={handleSave} />;
}
