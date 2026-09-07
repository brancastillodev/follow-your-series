"use client"

import { useState, useEffect, useRef } from "react"
import type { TMDBEpisodeResult } from "@/lib/tmdb"
import { Tag } from "@/components/ui/Tag"

interface SeasonBlockProps {
  season: {
    season_number: number
    episode_count: number
    name: string
    poster_path: string | null
  }
  tmdbId: number
  defaultOpen?: boolean
}

export function SeasonBlock({ season, tmdbId, defaultOpen = false }: SeasonBlockProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [episodes, setEpisodes] = useState<TMDBEpisodeResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (open && !episodes && !fetchingRef.current) {
      fetchingRef.current = true
      setLoading(true)
      fetch(`/api/tmdb/episode/${tmdbId}?season=${season.season_number}&episode=1`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) return
          setEpisodes([data])
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [open, episodes, tmdbId, season.season_number])

  return (
    <div className="season-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="season-header"
      >
        <div className="season-info">
          <span className="season-name">Season {season.season_number}</span>
          <Tag>{season.episode_count} episodes</Tag>
        </div>
        <span className={`season-arrow ${open ? "open" : ""}`}>›</span>
      </button>
      {open && (
        <div className="episodes">
          {loading ? (
            <div className="loading" style={{ padding: "1rem" }}>
              <div className="spinner" />
            </div>
          ) : episodes ? (
            <div>
              {Array.from({ length: season.episode_count }, (_, i) => i + 1).map((ep) => (
                <div key={ep} className="episode-item">
                  <div className="episode-left">
                    <span className="episode-circle">{ep}</span>
                    <span className="episode-name">Episode {ep}</span>
                  </div>
                  <span className="episode-status">○</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8125rem", padding: "1rem" }}>
              Episodes will load when expanded
            </p>
          )}
        </div>
      )}
    </div>
  )
}
