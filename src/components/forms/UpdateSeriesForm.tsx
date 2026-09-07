"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { updateSeries, removeSeries } from "@/lib/actions/auth"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"

type Season = { season_number: number; episode_count: number }

export function UpdateSeriesForm({
  series,
  seasons,
}: {
  series: {
    id: string
    tmdbId: number
    lastWatchedSeason: number
    lastWatchedEpisode: number
    platform: string | null
    withWho: string | null
    format: string | null
    notes: string | null
  }
  seasons: Season[]
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await updateSeries(formData)
      if (result?.success) {
        router.refresh()
      }
      return result
    },
    null
  )

  async function handleRemove() {
    if (confirm("Remove this series from your list?")) {
      await removeSeries(series.id)
      router.push("/dashboard")
      router.refresh()
    }
  }

  const seasonOptions = seasons
    .filter((s) => s.season_number > 0)
    .map((s) => ({ value: s.season_number, label: `Season ${s.season_number}` }))

  return (
    <div className="track-form">
      <form action={action}>
        <input type="hidden" name="id" value={series.id} />

        <h3 className="form-title">Update tracking</h3>

        <div className="form-grid">
          <Select
            id="lastWatchedSeason"
            name="lastWatchedSeason"
            label="Season"
            options={seasonOptions}
            defaultValue={series.lastWatchedSeason}
          />
          <Input
            id="lastWatchedEpisode"
            name="lastWatchedEpisode"
            type="number"
            label="Episode"
            min={1}
            defaultValue={series.lastWatchedEpisode}
          />
        </div>

        <div className="form-grid">
          <Input
            id="platform"
            name="platform"
            type="text"
            label="Platform"
            defaultValue={series.platform ?? ""}
          />
          <Input
            id="withWho"
            name="withWho"
            type="text"
            label="With"
            defaultValue={series.withWho ?? ""}
          />
        </div>

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
          defaultValue={series.format ?? ""}
        />

        <Textarea
          id="notes"
          name="notes"
          label="Notes"
          rows={2}
          defaultValue={series.notes ?? ""}
        />

        {state?.error && <p className="auth-error">{state.error}</p>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button type="submit" disabled={pending} fullWidth>
            {pending ? "Saving..." : "Update"}
          </Button>
          <Button type="button" variant="danger" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </form>
    </div>
  )
}
