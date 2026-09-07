import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { cache } from "react"
import { prisma } from "./prisma"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const SESSION_COOKIE = "session"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

type SessionPayload = {
  userId: string
  username: string
  expiresAt: Date
}

async function encrypt(payload: SessionPayload) {
  return new SignJWT({ userId: payload.userId, username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(payload.expiresAt)
    .sign(JWT_SECRET)
}

async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, username: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  const session = await encrypt({ userId, username, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE)?.value
  if (!cookie) return null
  const session = await decrypt(cookie)
  if (!session?.userId) return null
  return { userId: session.userId, username: session.username }
})

export async function requireAuth() {
  const session = await verifySession()
  if (!session) redirect("/login")
  return session
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function registerUser(username: string, email: string, password: string) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  })
  if (existing) {
    if (existing.username === username) return { error: "Username already taken" }
    return { error: "Email already registered" }
  }
  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: { username, email, password: hashed },
  })
  await createSession(user.id, user.username)
  return { user }
}

export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return { error: "Invalid username or password" }
  const valid = await comparePassword(password, user.password)
  if (!valid) return { error: "Invalid username or password" }
  await createSession(user.id, user.username)
  return { user }
}
