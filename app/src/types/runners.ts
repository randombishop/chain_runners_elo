export interface RunnerType {
  id: string
  ids: string[] // hmm...
  text: string
  name: string

  // Ranking...
  rank: number
  nfts: string[]
  rating: number
  won: number
  draw: number
  lost: number
}
