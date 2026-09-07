import Link from "next/link"
import Image from "next/image"
import { Tag } from "@/components/ui/Tag"

type SeriesCardProps = {
  series: {
    id: string
    tmdbId: number
    title: string
    posterPath: string | null
    lastWatchedSeason: number
    lastWatchedEpisode: number
    platform: string | null
    mediaType: string
    updatedAt: Date
  }
}

export function SeriesCard({ series }: SeriesCardProps) {
  return (
    <Link
      href={`/series/${series.tmdbId}?title=${encodeURIComponent(series.title)}`}
      className="series-card"
    >
      {series.posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w342${series.posterPath}`}
          alt={series.title}
          width={342}
          height={513}
          className="poster"
        />
      ) : (
        <div className="poster-placeholder">
          <span>🎬</span>
        </div>
      )}
      <div className="info">
        <p className="title">{series.title}</p>
        <div className="meta">
          <Tag variant="cyan">S{series.lastWatchedSeason} E{series.lastWatchedEpisode}</Tag>
          {series.platform && (
            <span className="platform">{series.platform}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
