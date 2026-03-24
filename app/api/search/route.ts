import { searchRecipes } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const results = await searchRecipes(q, 8);
  return NextResponse.json(results);
}
