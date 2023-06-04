import {loadQuestionDetail} from '~/server-utils/stampy'
import {question2400} from '~/mocks/question-data/question-2400'

describe('loadQuestionDetail', () => {
  it('can load question', async () => {
    const fetchMock = getMiniflareFetchMock()
    // Throw when no matching mocked request is found
    // (see https://undici.nodejs.org/#/docs/api/MockAgent?id=mockagentdisablenetconnect)
    fetchMock.disableNetConnect()

    // (see https://undici.nodejs.org/#/docs/api/MockAgent?id=mockagentgetorigin)
    const mockedUrl = new URL(question2400.href)
    const origin = fetchMock.get(mockedUrl.origin)
    // (see https://undici.nodejs.org/#/docs/api/MockPool?id=mockpoolinterceptoptions)
    origin.intercept({method: 'GET', path: mockedUrl.pathname}).reply(200, question2400)
    origin
      .intercept({
        method: 'GET',
        path: '/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22Name%22:%22%60%60%602400%60%60%60%22',
      })
      .reply(200, {items: [question2400]})

    const questionDetail = await loadQuestionDetail(undefined, question2400.values['UI ID'])
    expect(questionDetail).toBeDefined
  })
})
