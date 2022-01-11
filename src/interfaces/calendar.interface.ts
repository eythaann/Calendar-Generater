export type day = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export type calendar = {
  [index in day]: string[][]
}

export type pairList = {
  count: number
  days: string
}

export type individualWeek = {
  [index in day]?: number[]
}

export type groupWeek = {
  [index in day]?: groupDay
}

export type groupDay = {
  [x: number]: string[]
}
