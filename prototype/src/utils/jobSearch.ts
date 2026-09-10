import type { IntercompanyJob } from '../types/intercompany'

export function jobMatchesSearch(job: IntercompanyJob, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const haystack = `${job.number} ${job.name} ${job.customer ?? ''}`.toLowerCase()
  const tokens = normalized.split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}
