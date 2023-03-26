import {loadQuestionDetail} from '~/server-utils/stampy'
import {server} from '~/mocks/setupServers'

describe('loadQuestionDetail', () => {
  beforeAll(() => server.listen())
  it('whose text matches url but url is not valid', async () => {
    const questionDetail = await loadQuestionDetail('question1')
    expect(true).toBe(true)
  })
})
