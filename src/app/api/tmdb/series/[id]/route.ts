import { NextRequest } from "next/server"
import { getSeriesDetails } from "@/lib/tmdb"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const details = await getSeriesDetails(Number(id))
    return Response.json(details)
  } catch {
    return Response.json({ error: "Series not found" }, { status: 404 })
  }
}
