export interface ShowOptions {
  name: string,
  url: string,
  event: 'add' | 'remove'
}

export type ShowFn = (opts: ShowOptions) => void
