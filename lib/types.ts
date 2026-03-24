// ─── Shared TypeScript interfaces ───
// All streams code against these types. Stream A implements real data,
// Streams B/C/D use mock data matching these types until wired up.

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  createdAt: Date;
  children?: Category[];
};

export type Recipe = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  introHtml: string | null;
  heroImage: string | null;
  heroVideo: string | null;
  prepTime: number | null;
  cookTime: number | null;
  restTime: number | null;
  servings: number;
  difficulty: "easy" | "medium" | "hard" | null;
  published: boolean;
  featured: boolean;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  category?: Category | null;
  ingredients?: Ingredient[];
  steps?: Step[];
  images?: RecipeImage[];
  tags?: Tag[];
  reviewStats?: ReviewStats;
};

export type Ingredient = {
  id: number;
  recipeId: number;
  groupName: string | null;
  name: string;
  quantity: number | null;
  unitUs: string | null;
  unitMetric: string | null;
  quantityMetric: number | null;
  note: string | null;
  sortOrder: number;
};

export type Step = {
  id: number;
  recipeId: number;
  stepNumber: number;
  instruction: string;
  imageUrl: string | null;
  tip: string | null;
};

export type RecipeImage = {
  id: number;
  recipeId: number;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type Review = {
  id: number;
  recipeId: number;
  name: string;
  email: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  createdAt: Date;
};

export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
};

export type NewsletterSubscriber = {
  id: number;
  email: string;
  name: string | null;
  subscribed: boolean;
  createdAt: Date;
};

// ─── Form / Action types ───

export type RecipeFormData = {
  title: string;
  slug: string;
  description: string;
  introHtml: string;
  heroImage: string | null;
  heroVideo: string | null;
  prepTime: number | null;
  cookTime: number | null;
  restTime: number | null;
  servings: number;
  difficulty: "easy" | "medium" | "hard" | null;
  published: boolean;
  featured: boolean;
  categoryId: number | null;
  ingredients: IngredientFormData[];
  steps: StepFormData[];
};

export type IngredientFormData = {
  groupName: string | null;
  name: string;
  quantity: number | null;
  unitUs: string | null;
  unitMetric: string | null;
  quantityMetric: number | null;
  note: string | null;
  sortOrder: number;
};

export type StepFormData = {
  stepNumber: number;
  instruction: string;
  imageUrl: string | null;
  tip: string | null;
};

export type ReviewFormData = {
  recipeId: number;
  name: string;
  email: string;
  rating: number;
  comment: string | null;
};

// ─── Unit system ───

export type UnitSystem = "us" | "metric";

export type ServingMultiplier = 0.5 | 1 | 2 | 3;
