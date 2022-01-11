import { writeFile } from 'fs/promises'
import { calendar, day, pairList } from './interfaces/calendar.interface'

export const generatePairList = (calendar: calendar) => {
  const pairList: Map<string, pairList> = new Map()

  //this for is a constant of 7 days as MAX
  for (const day in calendar) {
    const filtered = calendar[day as day]

    //this for is a constant of 1440 minutes as MAX
    let last: string[] = []
    for (let i = 0; i < filtered.length; ++i) {
      const actual = filtered[i]

      if (!actual || last.toString() === actual.toString()) continue

      //Create the userPairs O(n^2 / 2) //this part is scare D:
      actual.forEach((v: string, j: number) =>
        actual.slice(j + 1).forEach((w: string) => {
          const key = `${v}-${w}`

          //Not count more than one time per day
          let temp = pairList.get(key)
          if (!temp?.days.includes(day)) {
            pairList.set(key, {
              count: (temp?.count ?? 0) + 1,
              days: `${temp?.days ?? ' '}${day} `,
            })
          }
        })
      )

      last = actual
      printPercent((i / filtered.length) * 100, day)
    }
  }

  return pairList
}

export const createResultFile = async (pairList: Map<string, pairList>) => {
  console.log(`Saving ${pairList.size} elements...`)

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
