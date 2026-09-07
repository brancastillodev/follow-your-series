"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { TMDBResult } from "@/lib/tmdb"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<TMDBResult[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleSearch(value: string) {
    setQuery(value)
    if (value.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    try {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(value)}&type=tv`)
      const data = await res.json()
      setResults(data.results?.slice(0, 8) ?? [])
      setOpen(true)
    } catch {
      setResults([])
    }
  }

  return (
    <div ref={ref} className="search-wrapper">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search series or anime..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setOpen(false)
                setQuery("")
                router.push(`/series/${r.id}?title=${encodeURIComponent(r.name)}&poster=${r.poster_path ?? ""}`)
              }}
              className="result-item"
            >
              {r.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${r.poster_path}`}
                  alt=""
                  width={40}
                  height={56}
                  className="result-poster"
                />
              ) : (
                <div className="result-poster-empty">
                  <span>?</span>
                </div>
              )}
              <div className="result-info">
                <p className="result-name">{r.name}</p>
                <p className="result-year">
                  {r.first_air_date?.slice(0, 4) ?? "N/A"}
                </p>
              </div>
              <span className="result-arrow">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
