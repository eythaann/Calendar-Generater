import { Calendar } from './Calendar'
import { createResultFile, generatePairList } from './pairListIterator'
import { generateRandomTXT } from './textGenerator'

const start = async () => {
  //we generate a ramdom text for test big data
  await generateRandomTXT(5000, __dirname + '/assets/generate.txt')

  //creating the class with a async builder
  const calendar = await Calendar.buildFromTxt(__dirname + '/assets/generate.txt')

  //some methods
  const monday = calendar.getDay('TH')
  //do things with the day...

  const week = calendar.getWeek()
  //do things with the week...

  /*
  the calendar is the better way to group days and hours
  for know what employes are working together you can use the calendar and their methods
  generate pairsList need many resources and time
  if you are runing files with many elements i don't recommend use pairList method.
  */

  // const pairListObject = generatePairList(calendar)

  //create the Results File
  //createResultFile(pairListObject)

  console.log('Pragram End')
}

//this is for run await in the top level
start()
