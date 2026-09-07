import Link from "next/link"
import { verifySession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PageContainer } from "@/components/layout/PageContainer"
import { AppHeader } from "@/components/layout/AppHeader"
import { BottomNav } from "@/components/layout/BottomNav"
import { LogoutButton } from "@/components/layout/LogoutButton"
import { SearchBar } from "@/components/search/SearchBar"
import { SeriesCard } from "@/components/series/SeriesCard"

export default async function DashboardPage() {
  const session = await verifySession()
  if (!session) return null

  const seriesList = await prisma.userSeries.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  })

  const following = await prisma.follow.findMany({
    where: { followerId: session.userId },
    include: { following: { select: { id: true, username: true } } },
  })

  return (
    <PageContainer>
      <AppHeader
        right={<LogoutButton />}
      >
        <div>
          <h1 className="header-title">Follow Your Series</h1>
          <p className="header-subtitle">@{session.username}</p>
        </div>
      </AppHeader>

      <div className="section" id="search">
        <SearchBar />
      </div>

      {following.length > 0 && (
        <div className="section">
          <h2 className="section-title">Following</h2>
          <div className="following-chips">
            {following.map((f) => (
              <Link
                key={f.following.id}
                href={`/profile/${f.following.username}`}
                className="following-chip"
              >
                @{f.following.username}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="section" style={{ flex: 1 }}>
        <h2 className="section-title">
          My Series {seriesList.length > 0 && `(${seriesList.length})`}
        </h2>
        {seriesList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <p className="empty-text">Search and add your first series above.</p>
          </div>
        ) : (
          <div className="grid-2">
            {seriesList.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </div>

      <BottomNav username={session.username} />
    </PageContainer>
  )
}
