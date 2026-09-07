import { NextRequest } from "next/server"
import { getEpisodeDetails } from "@/lib/tmdb"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const season = Number(_request.nextUrl.searchParams.get("season"))
  const episode = Number(_request.nextUrl.searchParams.get("episode"))

  if (!season || !episode) {
    return Response.json({ error: "season and episode params required" }, { status: 400 })
  }

  try {
    const details = await getEpisodeDetails(Number(id), season, episode)
    return Response.json(details)
  } catch {
    return Response.json({ error: "Episode not found" }, { status: 404 })
  }
}
