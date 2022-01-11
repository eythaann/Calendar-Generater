import { Calendar } from '../src/Calendar'
import { generatePairList, createResultFile } from '../src/pairListIterator'
import { calendar, groupWeek, pairList } from '../src/interfaces/calendar.interface'

describe('Testing for Calendar and PairList', () => {
  const expected: groupWeek = {
    MO: {
      600: ['RENE', 'ASTRID', 'ANDRES'],
      690: ['RENE', 'ANDRES'],
      720: [],
      840: ['CAMILA'],
      900: [],
    },
    TU: { '600': ['RENE'], '720': [] },
    WE: {},
    TH: {
      60: ['RENE'],
      180: [],
      720: ['ASTRID', 'ANDRES'],
      840: [],
    },
    FR: {},
    SA: { 840: ['RENE', 'CAMILA'], 1080: [] },
    SU: { 1200: ['RENE', 'ASTRID', 'ANDRES'], 1260: [] },
  }

  let testCalendar: Calendar | undefined = undefined
  let pairList: pairList | undefined = undefined

  describe('Class and Methods Calendar', () => {
    it('Should Builder Found', async () => {
      try {
        testCalendar = await Calendar.buildFromTxt(__dirname + '/../src/assets/test.txt')
      } catch (e) {
        fail('Create Calendar Fail')
      }
      expect(testCalendar).toBeInstanceOf(Calendar)
    })

    it('Should getDay Method', () => {
      expect(testCalendar?.getDay('MO')).toEqual(expected.MO)
    })

    it('Should getWeek Method', () => {
      expect(testCalendar?.getWeek()).toEqual(expected)
    })

    it('Should Get Method found with single Param', () => {
      expect(testCalendar?.get('CAMILA').MO?.length).toBe(60)
      expect(testCalendar?.get('CAMILA').SA?.length).toBe(240)
      expect(testCalendar?.get('CAMILA').FR).toEqual(undefined)
    })

    it('Should Get Method found with Multiple Params', () => {
      expect(testCalendar?.get(['RENE', 'ASTRID']).MO?.length).toBe(90)
      expect(testCalendar?.get(['RENE', 'ASTRID']).SU?.length).toBe(60)
      expect(testCalendar?.get(['RENE', 'ASTRID']).SA).toEqual(undefined)
    })

    it('Should Has Method found', () => {
      expect(testCalendar?.has('CAMILA')).toBe(true)
      expect(testCalendar?.has('userPrueba')).toBe(false)
    })

    it('Should Append Method found', () => {
      testCalendar?.append('JUANITA', 840, 900, 'MO')
      testCalendar?.append('JUANITA', 500, 700, 'SA')
      testCalendar?.append('JUANITA', 900, 1100, 'SU')
      expect(testCalendar?.has('JUANITA')).toBe(true)
    })

    it('Should Delete Method found in Specific Day', () => {
      testCalendar?.delete('JUANITA', 'MO')
      expect(testCalendar?.has('JUANITA', 'MO')).toBe(false)
      expect(testCalendar?.has('JUANITA')).toBe(true)
    })

    it('Should Delete Method found all Days', () => {
      testCalendar?.delete('JUANITA')
      expect(testCalendar?.has('JUANITA')).toBe(false)
    })

    it('Should the calendar be equal after run all methods', () => {
      expect(testCalendar?.getWeek()).toEqual(expected)
    })
  })

  describe('PairList and Create File', () => {
    it('Should Pairs are correctly', () => {
      pairList = generatePairList(testCalendar?.calendar as calendar)
      expect(pairList.get('RENE-ASTRID')?.days).toBe(' MO SU ')
      expect(pairList.get('RENE-ANDRES')?.count).toBe(2)
      expect(pairList.get('ASTRID-ANDRES')?.count).toBe(3)
      expect(pairList.has('RENE-CAMILA')).toBe(true)
      expect(pairList.has('Testing-Jest')).toBe(false)
    })

    it('Should Write File Found', async () => {
      await createResultFile(pairList as pairList)
    })
  })
})
