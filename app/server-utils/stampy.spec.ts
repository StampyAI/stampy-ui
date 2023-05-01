import {loadQuestionDetail} from '~/server-utils/stampy'
import {server} from '~/mocks/setupServers'
import {question2400} from '~/mocks/question-data/question-2400'

describe('loadQuestionDetail', () => {
  // Establish API mocking before all tests.
  beforeAll(() => server.listen())
  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => server.resetHandlers())
  // Clean up after the tests are finished.
  afterAll(() => server.close())

  it('can load question', async () => {
    const questionDetail = await loadQuestionDetail(undefined, question2400.values['UI ID'])
    expect(questionDetail).toBeDefined
  })
})
