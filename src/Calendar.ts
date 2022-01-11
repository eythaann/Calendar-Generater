import { readFile } from 'fs/promises'
import {
  calendar,
  day,
  groupDay,
  groupWeek,
  individualWeek,
} from './interfaces/calendar.interface'

export class Calendar {
  #calendar: calendar

  constructor(data: calendar) {
    this.#calendar = data
  }

  static async buildFromTxt(route: string): Promise<Calendar> {
    console.log('Extracting Data...')

    // txt to buffer and buffer to string
    const data = await readFile(route)
    const txt = data.toString()

    // create a array of persons and filter all empyt lines
    const persons = txt.split('\n')

    console.log('Extract Data Completed \n')
    console.log('Creating New Calendar')

    const calendar: calendar = {
      MO: new Array(1440) as string[][],
      TU: new Array(1440) as string[][],
      WE: new Array(1440) as string[][],
      TH: new Array(1440) as string[][],
      FR: new Array(1440) as string[][],
      SA: new Array(1440) as string[][],
      SU: new Array(1440) as string[][],
    }
    // Making a Calendar: {...Days} where each Day = employe[][]
    // and the index is the minute of the day
    persons.forEach((employe: string) => {
      const [name, dateString] = employe.split('=')
      const dates = dateString.split(',')

      dates.forEach((date: string) => {
        //Convert the string to Days, Hours and Minutes
        const day = date.slice(0, 2) as day

        const [startHour, endHour] = date.slice(2).split('-')
        const [startMinutes, endMinutes] = this.hourToMinutes(startHour, endHour)

        //fill the calendar[day][minutes] with the name of the person
        for (let minute = startMinutes; minute < endMinutes; ++minute)
          calendar[day][minute]
            ? calendar[day][minute].push(name)
            : (calendar[day][minute] = [name])
      })
    })

    console.log('Calendar Created \n')
    return new Calendar(calendar)
  }

  static hourToMinutes(...hours: string[]): number[] {
    return hours.map((v: string) => {
      const [hour, minutes] = v.split(':').map(v => Number(v))
      if (hour > 23 || minutes > 59) throw 'invalid format'
      return hour * 60 + minutes
    })
  }

  //return a single day of the times where change something
  getDay(day: day): groupDay {
    const result: groupDay = {}
    let last: any = undefined

    //here we use For and not forEach beacouse we need the undefineds
    for (let minute = 0; minute < 1440; ++minute) {
      let actual = this.#calendar[day][minute]
      //just returned the hour of Enter and Exit
      if (actual?.length === 0 || last?.toString() === actual?.toString()) continue
      result[minute] = actual ?? []
      last = actual
    }

    return result
  }

  //return all the getDays() in a object
  getWeek(): groupWeek {
    const result: groupWeek = {}
    for (let day in this.#calendar) result[day as day] = this.getDay(day as day)
    return result
  }

  get(persons: string | string[], day?: day): individualWeek {
    let result: individualWeek = {}

    if (day) {
      this.#calendar[day].forEach((actual: string[], minute: number) => {
        for (const person of [persons].flat()) if (!actual.includes(person)) return
        result[day] ? result[day as day]?.push(minute) : (result[day as day] = [minute])
      })
      return result
    }

    for (const day in this.#calendar) {
      result = { ...result, ...this.get(persons, day as day) }
    }

    return result
  }

  has(person: string, day?: day): boolean {
    if (day) {
      for (let minute = 0; minute < 1440; ++minute)
        if (this.#calendar[day][minute]?.includes(person)) return true

      return false
    }

    for (const day in this.#calendar) if (this.has(person, day as day)) return true

    return false
  }

  append(name: string, startMinutes: number, endMinutes: number, day: day): void {
    for (let minute = startMinutes; minute < endMinutes; ++minute)
      this.#calendar[day][minute]
        ? this.#calendar[day][minute].push(name)
        : (this.#calendar[day][minute] = [name])
  }

  delete(person: string, day?: day): void {
    if (day) {
      this.#calendar[day].forEach((actual: any) => {
        const index = actual?.indexOf(person)
        if (index !== -1) actual.splice(index, 1)
      })
      return
    }

    for (const day in this.#calendar) this.delete(person, day as day)
  }

  get calendar(): calendar {
    return this.#calendar
  }
}
