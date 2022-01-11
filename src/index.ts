import { Calendar } from './Calendar'
import { pairList } from './interfaces/calendar.interface'
import { createResultFile, generatePairList } from './pairListIterator'
import { generateRandomTXT } from './textGenerator'

const start = async () => {
  //we generate a ramdom text for test big data
  //if you gonna check this with the pairlist method i recommend use little amounds
  await generateRandomTXT(10000, __dirname + '/assets/generate.txt')

  //creating the class with a async builder this part is O(n)
  //change "test" for "generate" if you wanna test the performance
  const calendar = await Calendar.buildFromTxt(__dirname + '/assets/test.txt')

  //some methods
  const monday = calendar.getDay('MO')
  //do things with the day...

  const week = calendar.getWeek()
  //do things with the week...

  const juanita = calendar.get('JUANITA')
  //do things with the person/s

  /*
  the calendar is the better way to group days and hours
  for know what employes are working together you can use the calendar and their methods
  generate pairsList need many resources and time
  if you are runing files with many elements i don't recommend use pairList method.*/
  const pairListObject: pairList = generatePairList(calendar.calendar)
  await createResultFile(pairListObject)

  //some tests
  console.log('\nPairlist: ', pairListObject)

  calendar.append('JUANITA', 840, 900, 'MO')
  console.log('\nMonday', monday)
  console.log('\nJuanita exits?', calendar.has('JUANITA'))

  console.log('\nJuanita :', juanita)
  console.log('\nCamila-Juanita :', calendar.get(['CAMILA', 'JUANITA']))

  calendar.delete('JUANITA')
  console.log('\nJuanita exits? ', calendar.has('JUANITA'))
  console.log('\nSchedule:', week)

  console.log('\nPragram End.\n')
}

//this is for run await in the top level
start()
