export type day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export type calendar = {
  [index in day]: string[][]
}

export type pairList = {
  [index: string]: { count: number; days: string }
}
