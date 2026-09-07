import Image from "next/image"
import { Tag } from "@/components/ui/Tag"

interface SeriesHeroProps {
  name: string
  overview: string
  posterPath: string | null
  genres: { id: number; name: string }[]
}

export function SeriesHero({ name, overview, posterPath, genres }: SeriesHeroProps) {
  return (
    <div className="series-hero">
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w185${posterPath}`}
          alt={name}
          width={185}
          height={278}
          className="hero-poster"
        />
      ) : (
        <div className="hero-poster-empty">
          <span>🎬</span>
        </div>
      )}
      <div className="hero-info">
        <p className="hero-overview">{overview}</p>
        <div className="hero-genres">
          {genres?.slice(0, 3).map((g) => (
            <Tag key={g.id}>{g.name}</Tag>
          ))}
        </div>
      </div>
    </div>
  )
}
