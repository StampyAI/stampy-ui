import {baselineSearch, normalize} from '../search'

describe('baselineSearch', () => {
  // Mock data for testing
  const questions = [
    {pageid: '1', title: 'What time is it?'},
    {pageid: '2', title: 'time to say goodbye'},
    {pageid: '3', title: 'What is the answer to life, the universe and everything?'},
    {pageid: '4', title: 'This is a pen'},
    {pageid: '41', title: 'This is not a pen'},
    {pageid: '42', title: 'This is a red pen'},
    {pageid: '5', title: 'Is a pen something that is common?'},
    {pageid: '6', title: 'I have a pen in my pocket'},
  ]

  it('should return an empty array if searchQueryRaw is empty', async () => {
    const searchQueryRaw = ''
    const result = await baselineSearch(searchQueryRaw, questions)
    expect(result).toEqual([])
  })

  it('should return the correct number of search results', async () => {
    const numResults = 2
    const result = await baselineSearch('What is a pen?', questions, numResults)
    expect(result).toHaveLength(numResults)
  })

  it('should prioritize exact matches', async () => {
    const result = await baselineSearch('What time is it?', questions)
    expect(result[0].title).toEqual('What time is it?')
  })

  it('should give a small boost to "What is" questions', async () => {
    const searchQueryRaw = 'time'
    const result = await baselineSearch(searchQueryRaw, questions)
    expect(result[0].title).toEqual('What time is it?')
  })

  it('should return 5 items by default', async () => {
    const searchQueryRaw = 'time'
    const repeatedQuestions = [].concat(...Array(10).fill(questions))
    const result = await baselineSearch(searchQueryRaw, repeatedQuestions)
    expect(result.length).toEqual(5)
  })

  it('should return numResult items', async () => {
    const searchQueryRaw = 'time'
    const repeatedQuestions = [].concat(...Array(10).fill(questions))
    const result = await baselineSearch(searchQueryRaw, repeatedQuestions, 12)
    expect(result.length).toEqual(12)
  })
})

describe('normalize', () => {
  it('should convert all characters to lowercase', () => {
    expect(normalize('Hello World')).toBe('hello world')
  })

  it('should remove special characters', () => {
    const question = 'How do you do, Mr. Smith?'
    const result = normalize(question)
    expect(result).toBe('how do you do mr smith')
  })

  it('should remove common articles (a, an, the)', () => {
    const question = 'What is the meaning of life?'
    const result = normalize(question)
    expect(result).toBe('what is meaning of life')
  })

  it('should remove plural "s" if preceded by at least two characters', () => {
    const question = 'Where are the books and pens?'
    const result = normalize(question)
    expect(result).toBe('where are book and pen')
  })

  it('should replace multiple spaces, underscores, and ampersands with a single space', () => {
    const question = '  This  _ is  &  a  test  '
    const result = normalize(question)
    expect(result).toBe('thi   is test')
  })

  it('should trim any leading or trailing spaces', () => {
    const question = '   What is your favorite color?   '
    const result = normalize(question)
    expect(result).toBe('what is your favorite color')
  })
})
