const TMDB_BASE = "https://api.themoviedb.org/3"
const ACCESS_TOKEN = process.env.TMDB_API_KEY

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
}

export async function searchTMDB(query: string, type?: "tv" | "movie") {
  const params = new URLSearchParams({ query, language: "es-ES" })
  const url = `${TMDB_BASE}/search/${type ?? "tv"}?${params}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error("TMDB search failed")
  const data = await res.json()
  return data.results as TMDBResult[]
}

export async function getSeriesDetails(tmdbId: number) {
  const url = `${TMDB_BASE}/tv/${tmdbId}?language=es-ES&append_to_response=external_ids`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error("TMDB series fetch failed")
  return res.json() as Promise<TMDBDetails>
}

export async function getEpisodeDetails(tmdbId: number, season: number, episode: number) {
  const url = `${TMDB_BASE}/tv/${tmdbId}/season/${season}/episode/${episode}?language=es-ES`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error("TMDB episode fetch failed")
  return res.json() as Promise<TMDBEpisodeResult>
}

export type TMDBResult = {
  id: number
  name: string
  poster_path: string | null
  first_air_date: string
  overview: string
  vote_average: number
  media_type?: string
}

export type TMDBDetails = {
  id: number
  name: string
  poster_path: string | null
  overview: string
  first_air_date: string
  last_air_date: string
  number_of_seasons: number
  number_of_episodes: number
  vote_average: number
  genres: { id: number; name: string }[]
  seasons: {
    id: number
    season_number: number
    episode_count: number
    name: string
    poster_path: string | null
  }[]
  external_ids: {
    imdb_id: string | null
  }
}

export type TMDBEpisodeResult = {
  id: number
  name: string
  overview: string
  air_date: string
  episode_number: number
  season_number: number
  still_path: string | null
  vote_average: number
}
