"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { followUser } from "@/lib/actions/auth"
import { Button } from "@/components/ui/Button"

interface FollowButtonProps {
  username: string
  isFollowing: boolean
}

export function FollowButton({ username, isFollowing: initialFollowing }: FollowButtonProps) {
  const router = useRouter()

  const [state, action, pending] = useActionState(
    async () => {
      const result = await followUser(username)
      router.refresh()
      return result
    },
    { success: true, unfollowed: !initialFollowing }
  )

  const following = state?.unfollowed === false

  return (
    <form action={action}>
      <Button
        type="submit"
        disabled={pending}
        variant={following ? "secondary" : "primary"}
      >
        {pending ? "..." : following ? "Following" : "Follow"}
      </Button>
    </form>
  )
}
