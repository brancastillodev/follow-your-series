"use server"

import { revalidatePath } from "next/cache"
import { registerUser, loginUser, deleteSession, verifySession } from "../auth"
import { prisma } from "../prisma"

export async function register(formData: FormData) {
  const username = String(formData.get("username")).trim()
  const email = String(formData.get("email")).trim()
  const password = String(formData.get("password"))

  if (!username || !email || !password) return { error: "All fields are required" }
  if (username.length < 3) return { error: "Username must be at least 3 characters" }
  if (password.length < 6) return { error: "Password must be at least 6 characters" }

  return registerUser(username, email, password)
}

export async function login(formData: FormData) {
  const username = String(formData.get("username")).trim()
  const password = String(formData.get("password"))

  if (!username || !password) return { error: "All fields are required" }

  return loginUser(username, password)
}

export async function logout() {
  await deleteSession()
  revalidatePath("/")
}

export async function addSeries(formData: FormData) {
  const session = await verifySession()
  if (!session) return { error: "Not authenticated" }

  const tmdbId = Number(formData.get("tmdbId"))
  const title = String(formData.get("title"))
  const posterPath = String(formData.get("posterPath") || "")
  const mediaType = String(formData.get("mediaType") || "tv")
  const platform = String(formData.get("platform") || "")
  const withWho = String(formData.get("withWho") || "")
  const format = String(formData.get("format") || "")
  const notes = String(formData.get("notes") || "")
  const lastWatchedSeason = Number(formData.get("lastWatchedSeason") || 1)
  const lastWatchedEpisode = Number(formData.get("lastWatchedEpisode") || 1)

  const existing = await prisma.userSeries.findUnique({
    where: { userId_tmdbId: { userId: session.userId, tmdbId } },
  })
  if (existing) return { error: "Series already in your list" }

  await prisma.userSeries.create({
    data: {
      userId: session.userId,
      tmdbId,
      title,
      posterPath: posterPath || null,
      mediaType,
      platform: platform || null,
      withWho: withWho || null,
      format: format || null,
      notes: notes || null,
      lastWatchedSeason,
      lastWatchedEpisode,
    },
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateSeries(formData: FormData) {
  const session = await verifySession()
  if (!session) return { error: "Not authenticated" }

  const id = String(formData.get("id"))
  const userSeries = await prisma.userSeries.findFirst({
    where: { id, userId: session.userId },
  })
  if (!userSeries) return { error: "Series not found" }

  const data: Record<string, string | number | null> = {}
  for (const field of ["platform", "withWho", "format", "notes", "title"]) {
    const val = formData.get(field)
    data[field] = val ? String(val) : null
  }
  const season = formData.get("lastWatchedSeason")
  const episode = formData.get("lastWatchedEpisode")
  if (season) data.lastWatchedSeason = Number(season)
  if (episode) data.lastWatchedEpisode = Number(episode)

  await prisma.userSeries.update({ where: { id }, data })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function removeSeries(id: string) {
  const session = await verifySession()
  if (!session) return { error: "Not authenticated" }

  await prisma.userSeries.deleteMany({ where: { id, userId: session.userId } })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function followUser(targetUsername: string) {
  const session = await verifySession()
  if (!session) return { error: "Not authenticated" }

  const target = await prisma.user.findUnique({ where: { username: targetUsername } })
  if (!target) return { error: "User not found" }
  if (target.id === session.userId) return { error: "Cannot follow yourself" }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: session.userId, followingId: target.id } },
  })
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    revalidatePath(`/profile/${targetUsername}`)
    return { success: true, unfollowed: true }
  }

  await prisma.follow.create({
    data: { followerId: session.userId, followingId: target.id },
  })

  revalidatePath(`/profile/${targetUsername}`)
  return { success: true, unfollowed: false }
}
