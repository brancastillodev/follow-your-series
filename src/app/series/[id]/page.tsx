import { verifySession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getSeriesDetails } from "@/lib/tmdb"
import { PageContainer } from "@/components/layout/PageContainer"
import { AppHeader } from "@/components/layout/AppHeader"
import { SeriesHero } from "@/components/series/SeriesHero"
import { SeasonBlock } from "@/components/series/SeasonBlock"
import { AddSeriesForm } from "@/components/forms/AddSeriesForm"
import { UpdateSeriesForm } from "@/components/forms/UpdateSeriesForm"

export default async function SerieDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ title?: string; poster?: string }>
}) {
  const { id } = await params
  await searchParams
  const session = await verifySession()

  const tmdbId = Number(id)
  const details = await getSeriesDetails(tmdbId)

  const existing = session
    ? await prisma.userSeries.findUnique({
        where: { userId_tmdbId: { userId: session.userId, tmdbId } },
      })
    : null

  return (
    <PageContainer noNav>
      <AppHeader>
        <a href="/dashboard" className="header-back">‹</a>
        <h1 className="header-title" style={{ marginLeft: "0.5rem" }}>{details.name}</h1>
      </AppHeader>

      <SeriesHero
        name={details.name}
        overview={details.overview}
        posterPath={details.poster_path}
        genres={details.genres ?? []}
      />

      {session && (
        <div className="section">
          {existing ? (
            <UpdateSeriesForm series={existing} seasons={details.seasons} />
          ) : (
            <AddSeriesForm
              tmdbId={tmdbId}
              title={details.name}
              posterPath={details.poster_path ?? ""}
              seasons={details.seasons}
            />
          )}
        </div>
      )}

      <div className="section" style={{ paddingBottom: "6rem" }}>
        <h2 className="section-title">Seasons & Episodes</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {details.seasons
            .filter((s) => s.season_number > 0)
            .map((season) => (
              <SeasonBlock
                key={season.id}
                season={season}
                tmdbId={tmdbId}
                defaultOpen={existing?.lastWatchedSeason === season.season_number}
              />
            ))}
        </div>
      </div>
    </PageContainer>
  )
}
