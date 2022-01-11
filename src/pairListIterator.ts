import { writeFile } from 'fs/promises'
import { calendar, day, pairList } from './interfaces/calendar.interface'

export const generatePairList = (calendar: calendar) => {
  const pairList: pairList = new Map()

  //this for is a constant of 7 days as MAX
  for (const day in calendar) {
    let last: string[] = []
    //this for is a constant of 1440 minutes as MAX
    calendar[day as day].forEach((actual: string[], minute: number) => {
      if (actual.length === 0 || last.toString() === actual.toString()) return

      //Create the userPairs O(n^2 / 2) //this part is scare D:
      actual.forEach((v: string, i: number) =>
        actual.slice(i + 1).forEach((w: string) => {
          //Not count more than one time per day
          const key = `${v}-${w}`
          let pair = pairList.get(key)
          if (!pair?.days.includes(day))
            pairList.set(key, {
              count: (pair?.count ?? 0) + 1,
              days: `${pair?.days ?? ' '}${day} `,
            })
        })
      )

      last = actual
      printPercent((minute / calendar[day as day].length) * 100, day)
    })
  }

  printPercent(100)
  return pairList
}

export const createResultFile = async (pairList: pairList) => {
  console.log(`\nSaving ${pairList.size} elements...`)

  let string = ''
  for (const [key, data] of pairList) string += `${key}: ${data.count} :${data.days}\n`

  await writeFile(__dirname + '/assets/result.txt', string)

  console.log('File Complete. Locate at ./assets/result.txt')
}

const printPercent = (percent: number, otherString: string = '') => {
  console.clear()
  console.log(`

  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░░░░░░░░░███░████░███░███░░░░░░░░░░
  ░░░░░░░░░░█░░█░░█░█░░░░█░░░░░░░░░░░
  ░░░░░░░░░░█░░█░░█░██░░░█░░░░░░░░░░░
  ░░░░░░░░░░█░░█░░█░█░░░░█░░░░░░░░░░░
  ░░░░░░░░░███░████░███░░█░░░░░░░░░░░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  `)
  console.log(`    //////////// ${otherString} ${Math.floor(percent)}% ///////////`)
}
