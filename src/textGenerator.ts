import { writeFile } from 'fs/promises'

export const generateRandomTXT = async (amount: number, route: string) => {
  console.log('Generating txt...')

  const LETTERS = 'QWERTYUIOPASDFGHJKLZXXCVBNM'
  const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

  let string = ''

  // If you gonna use the PairListIterator
  // be secure that you gonna have time and memory
  // If just gonna use the calendar don't be scare
  for (let i = 0; i < amount; i++) {
    let ramdomName = ''
    let ramdomHour = ''

    for (let j = 0; j < 8; ++j) {
      let r = Math.floor(Math.random() * LETTERS.length)
      ramdomName += LETTERS[r]
    }

    //Generating ramdoms Days and Hours
    const days = [...DAYS]
    for (let k = 0; k < 5; ++k) {
      let hourEnd = String(Math.floor(Math.random() * 23))
      let hourStart = String(Math.floor(Math.random() * Number(hourEnd)))

      let minuteEnd = String(Math.floor(Math.random() * 59))
      let minuteStart = String(Math.floor(Math.random() * Number(minuteEnd)))

      //we asegurated that is 24H format
      hourStart = hourStart.length === 1 ? '0' + hourStart : hourStart
      hourEnd = hourEnd.length === 1 ? '0' + hourEnd : hourEnd

      minuteStart = minuteStart.length === 1 ? '0' + minuteStart : minuteStart
      minuteEnd = minuteEnd.length === 1 ? '0' + minuteEnd : minuteEnd

      const [day] = days.splice(Math.floor(Math.random() * days.length), 1)
      //return
      ramdomHour += `${day}${hourStart}:${minuteStart}-${hourEnd}:${minuteEnd},`
    }

    string += ramdomName + '=' + ramdomHour + '\n'
  }

  await writeFile(route, string)

  console.log(`${route.slice(route.lastIndexOf('/') + 1)} generated at ${route}\n`)
}
