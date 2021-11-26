export interface IRunner {
  id: number
  ids: number[]
  text: string
  name: string

  // Ranking...
  rank: number
  nfts: number[]
  rating: number
  won: number
  draw: number
  lost: number
}

export type TPage = 'vote' | 'ranking' | 'style'

export enum EVoteNumber {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
}

export interface IAppState {
  page: TPage
  ranking?: IRunner[]
  lastUpdateTimestamp?: string
  runner1?: IRunner
  runner2?: IRunner
  voted: boolean
  winner: EVoteNumber

  address?: string
  nonce: number
  signature?: string
  numOwnedRunners: number
  ownedRunners: number[]
  lookupOwners: boolean

  isFirefox: boolean
}

export type TRunnerClickedFn = (runner: IRunner) => () => void
export type TConnectFn = () => void
export type TNavigateFn = (page: TPage) => () => void
export type TVoteFn = (winner: EVoteNumber) => () => void
