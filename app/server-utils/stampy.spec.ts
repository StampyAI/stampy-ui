import {loadQuestionDetail} from '~/server-utils/stampy'
import cachedCodaQueriesJson from '~/mocks/coda-responses/cached-coda-responses.json'
import {QUESTION_DETAILS_TABLE} from './coda-urls'
import {CachedCodaQueries} from '~/mocks/coda-responses/refresh-coda-data-for-tests'
import _ from 'lodash'

export const questions: Array<string> = ['0']
const cachedQueries = cachedCodaQueriesJson as CachedCodaQueries

describe('loadQuestionDetail', () => {
  it.each<string>(questions)('can load question %i', async (questionId) => {
    const fetchMock = getMiniflareFetchMock()
    fetchMock.disableNetConnect()
    const mockCodaWithFetch = _.partial(mockCodaRequest, fetchMock)
    const allCachedRequests = cachedQueries.flatMap((codaQuery) => codaQuery.cachedRequests)
    for (const cachedRequest of allCachedRequests) {
      mockCodaWithFetch(cachedRequest.url, cachedRequest.responseData)
    }

    const cachedQuery = cachedQueries.find((cachedQuery) =>
      _.isEqual(cachedQuery.codaParams, {
        table: QUESTION_DETAILS_TABLE,
        queryColumn: 'UI ID',
        queryValue: questionId,
      })
    )
    if (!cachedQuery) {
      throw new Error(`Cached response not found for question ${questionId}`)
    }

    const questionDetail = await loadQuestionDetail('NEVER_RELOAD', questionId)

    const cachedQuestionData = cachedQuery.cachedRequests[0].responseData
    const firstItem = cachedQuestionData.items[0]
    expect(questionDetail.data.status).toBe(firstItem.values.Status.name)
    const linkUrl = new URL(firstItem.values.Link.url)
    expect(questionDetail.data.answerEditLink).toBe(linkUrl.origin + linkUrl.pathname)
  })
})

const mockCodaRequest = async (
  fetchMock: ReturnType<typeof getMiniflareFetchMock>,
  urlString: string,
  responseData: any
) => {
  const url = new URL(urlString)
  const origin = fetchMock.get(`${url.origin}`)
  origin
    .intercept({
      method: 'GET',
      path: url.href.replace(url.origin, ''),
    })
    .reply(200, responseData)
}
