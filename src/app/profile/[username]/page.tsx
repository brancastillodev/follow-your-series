import Link from "next/link"
import Image from "next/image"
import { verifySession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FollowButton } from "@/components/profile/FollowButton"
import { PageContainer } from "@/components/layout/PageContainer"
import { AppHeader } from "@/components/layout/AppHeader"
import { Tag } from "@/components/ui/Tag"
import { notFound } from "next/navigation"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const session = await verifySession()
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      series: { orderBy: { updatedAt: "desc" } },
      followers: { select: { followerId: true } },
      following: { select: { followingId: true } },
    },
  })

  if (!user) notFound()

  const isOwnProfile = session?.userId === user.id
  const isFollowing = session
    ? user.followers.some((f) => f.followerId === session.userId)
    : false

  return (
    <PageContainer noNav>
      <AppHeader>
        <a href="/dashboard" className="header-back">‹</a>
        <h1 className="header-title" style={{ marginLeft: "0.5rem" }}>@{user.username}</h1>
      </AppHeader>

      <div style={{ padding: "0 1.25rem" }}>
        {isOwnProfile ? (
          <Link href="/dashboard" style={{ marginBottom: "1rem", display: "inline-block" }}>
            <Tag>Dashboard</Tag>
          </Link>
        ) : session ? (
          <div style={{ marginBottom: "1rem" }}>
            <FollowButton username={username} isFollowing={isFollowing} />
          </div>
        ) : null}

        <div className="stats-row" style={{ padding: 0, marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <span className="stat-value">{user.series.length}</span>
            <span className="stat-label">Series</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.followers.length}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.following.length}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingBottom: "6rem" }}>
        <h2 className="section-title">Series</h2>
        {user.series.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <p className="empty-text">No series tracked yet.</p>
          </div>
        ) : (
          <div className="grid-2">
            {user.series.map((s) => (
              <Link
                key={s.id}
                href={`/series/${s.tmdbId}?title=${encodeURIComponent(s.title)}`}
                className="series-card"
              >
                {s.posterPath ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${s.posterPath}`}
                    alt={s.title}
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
                  <p className="title">{s.title}</p>
                  <div className="meta">
                    <Tag variant="cyan">S{s.lastWatchedSeason} E{s.lastWatchedEpisode}</Tag>
                    {s.platform && (
                      <span className="platform">{s.platform}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
