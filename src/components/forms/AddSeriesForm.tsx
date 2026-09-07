"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { addSeries } from "@/lib/actions/auth"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"

type Season = { season_number: number; episode_count: number; name: string }

export function AddSeriesForm({
  tmdbId,
  title,
  posterPath,
  seasons,
}: {
  tmdbId: number
  title: string
  posterPath: string
  seasons: Season[]
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await addSeries(formData)
      if (result?.success) {
        router.push("/dashboard")
        router.refresh()
      }
      return result
    },
    null
  )

  const lastSeason = seasons
    .filter((s) => s.season_number > 0)
    .sort((a, b) => b.season_number - a.season_number)?.[0]

  const seasonOptions = seasons
    .filter((s) => s.season_number > 0)
    .map((s) => ({ value: s.season_number, label: `Season ${s.season_number}` }))

  return (
    <form action={action} className="track-form">
      <input type="hidden" name="tmdbId" value={tmdbId} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="posterPath" value={posterPath} />
      <input type="hidden" name="mediaType" value="tv" />

      <h3 className="form-title">Track this series</h3>

      <div className="form-grid">
        <Select
          id="lastWatchedSeason"
          name="lastWatchedSeason"
          label="Season"
          options={seasonOptions}
          defaultValue={lastSeason?.season_number ?? 1}
        />
        <Input
          id="lastWatchedEpisode"
          name="lastWatchedEpisode"
          type="number"
          label="Episode"
          min={1}
          defaultValue={1}
        />
      </div>

      <div className="form-grid">
        <Input
          id="platform"
          name="platform"
          type="text"
          label="Platform"
          placeholder="Netflix..."
        />
        <Input
          id="withWho"
          name="withWho"
          type="text"
          label="With"
          placeholder="Friends..."
        />
      </div>

      <div className="form-grid">
        <Select
          id="format"
          name="format"
          label="Format"
          options={[
            { value: "", label: "Select..." },
            { value: "sub", label: "Subbed" },
            { value: "dub", label: "Dubbed" },
            { value: "raw", label: "Raw" },
          ]}
        />
      </div>

      <Textarea
        id="notes"
        name="notes"
        label="Notes"
        rows={2}
        placeholder="Any notes about this series..."
      />

      {state?.error && <p className="auth-error">{state.error}</p>}

      <Button type="submit" disabled={pending} fullWidth>
        {pending ? "Adding..." : "Add to My Series"}
      </Button>
    </form>
  )
}
