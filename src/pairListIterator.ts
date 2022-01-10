import { writeFile } from 'fs/promises'
import { calendar, day, pairList } from './interfaces/calendar.interface'

export const generatePairList = (calendar: calendar) => {
  const pairList: pairList = {}

  //this for is a constant of 7 days as MAX
  for (const day in calendar) {
    //filter undefinedes
    const filtered = calendar[day as day].filter(Boolean)

    //this for is a constant of 1440 minutes as MAX
    //just iterate one time per group of people in a moment of the day
    for (let i = 0; i < filtered.length; ) {
      //check te user and create the userPairs (n^2 / 2)

      filtered[i].forEach((v: any, j: number) => {
        let percent = (j / filtered[i].length) * 100
        console.log(day, Math.ceil(percent) + '%')

        filtered[i].slice(j + 1).forEach((w: any) => {
          const key = v + '-' + w

          if (!pairList[key]) pairList[key] = { count: 1, days: day }

          //Not count more than one time per day
          if (!pairList[key].days.includes(day)) {
            pairList[key].count++
            pairList[key].days += '-' + day
          }
        })

        console.clear()
      })

      //find the next group of users Index
      let next = filtered.findIndex(
        (v: any, j: number) => v.join() != filtered[i].join() && j > i
      )
      if (next === -1) break
      i = next
    }
  }
  return pairList
}

export const createResultFile = async (pairList: any) => {
  console.log('Creating File...')

  let string = JSON.stringify(pairList).replaceAll(/[{}]|(,"days")|("count":)|["]/g, '')
  string = string.replaceAll(/[,]/g, '\n')

  await writeFile(__dirname + '/assets/Result.txt', string)

  console.log('File Complete. Locate at ./assets/Result.txt')
}
