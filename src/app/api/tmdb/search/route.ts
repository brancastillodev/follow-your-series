import { NextRequest } from "next/server"
import { searchTMDB } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")
  const type = request.nextUrl.searchParams.get("type") as "tv" | "movie" | null

  if (!query) {
    return Response.json({ results: [] })
  }

  try {
    const results = await searchTMDB(query, type ?? undefined)
    return Response.json({ results })
  } catch {
    return Response.json({ error: "Search failed" }, { status: 500 })
  }
}
