import { readFile } from 'fs/promises'
import { calendar, day } from './interfaces/calendar.interface'

export class Calendar {
  #calendar: calendar

  constructor(data: calendar) {
    this.#calendar = data
  }

  static async buildFromTxt(route: string): Promise<Calendar> {
    console.log('Extracting Data...')

    const calendar: calendar = {
      MO: new Array(1440) as string[][],
      TU: new Array(1440) as string[][],
      WE: new Array(1440) as string[][],
      TH: new Array(1440) as string[][],
      FR: new Array(1440) as string[][],
      SA: new Array(1440) as string[][],
      SU: new Array(1440) as string[][],
    }

    // txt to buffer and buffer to string
    const data = await readFile(route)
    const txt = data.toString()

    // create a array of employes
    // filter all empyt lines
    let employes = txt.split('\n').filter(Boolean)

    // Making a Calendar: {...Days} where each Day = employe[][] and the index
    // is the minute of the day
    employes.forEach((employe: string) => {
      const [name, dateString] = employe.split('=')
      const dates = dateString.split(',').filter(Boolean)

      for (let date of dates) {
        const day = date.slice(0, 2) as day

        const [startHour, endHour] = date.slice(2).split('-')

        //Start Hour to minutes 0...
        const [hour, minutes] = startHour.split(':')
        const startMinutes = Number(hour) * 60 + Number(minutes)

        //End Hour to minutes ...1440
        const [hourEnd, minutesEnd] = endHour.split(':')
        const endMinutes = Number(hourEnd) * 60 + Number(minutesEnd)

        for (let i = startMinutes; i < endMinutes; ++i)
          calendar[day][i] ? calendar[day][i].push(name) : (calendar[day][i] = [name])
      }
    })

    console.log('Extract Data Completed \n')
    return new Calendar(calendar)
  }

  getDay(day: day) {
    const result: { [x: number]: string[] } = {}

    for (let i = 0; i < this.#calendar[day].length; ) {
      if (this.#calendar[day][i]) result[i] = this.#calendar[day][i]
      else if (i != 0) result[i] = []

      const next = this.#calendar[day].slice(i + 1).findIndex((v: any, j: number) => {
        return this.#calendar[day][i] == undefined
          ? v != undefined
          : v?.join() != this.#calendar[day][i].join()
      })

      if (next === -1) break
      i = next + i + 1
    }
    return result
  }

  getWeek() {
    const result: { [x: string]: { [x: number]: string[] } } = {}

    for (let day in this.#calendar) {
      result[day] = this.getDay(day as day)
    }

    return result
  }

  get calendar(): calendar {
    return this.#calendar
  }
}
