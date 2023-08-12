import {AnswersRow, CodaResponse, loadQuestionDetail} from '~/server-utils/stampy'
import cachedCodaResponses from '~/mocks/coda-responses/cached-coda-responses.json'
import {QUESTION_DETAILS_TABLE, makeCodaRequest} from './coda-urls'

export const questions: Array<string> = ['0']

describe('loadQuestionDetail', () => {
  it.each<string>(questions)('can load question %i', async (questionId) => {
    const fetchMock = getMiniflareFetchMock()
    fetchMock.disableNetConnect()

    // Steps:
    // 1. Get the path for this question
    // 2. Check if the path is in the cached data
    // 3. If yes, return the cached data. If no, throw error.

    // Rationale:
    // If the path isn't in the cached data, then the cached data should be refreshed or updated.

    const urlString = makeCodaRequest({
      table: QUESTION_DETAILS_TABLE,
      queryColumn: 'UI ID',
      queryValue: questionId,
    })
    const method = 'GET'
    const cachedResponse = cachedCodaResponses.find(
      (response) => response.url === urlString && response.httpMethod === method
    )
    if (!cachedResponse) {
      throw new Error(`Cached response not found for question ${questionId}`)
    }
    // TODO: the addition of nextPageLink is a kludge to make the test compile. The CodaResponse type should be fixed instead.
    const questionData = {...cachedResponse.responseData, ...{nextPageLink: null}} as CodaResponse
    const url = new URL(urlString)
    const origin = fetchMock.get(`${url.origin}`)
    origin
      .intercept({
        method,
        path: url.href.replace(url.origin, ''),
      })
      .reply(200, cachedResponse.responseData)

    const questionDetail = await loadQuestionDetail('NEVER_RELOAD', questionId)
    const firstItem = questionData.items[0] as AnswersRow
    expect(questionDetail.data.status).toBe(firstItem.values.Status.name)
    const linkUrl = new URL(firstItem.values.Link.url)
    expect(questionDetail.data.answerEditLink).toBe(linkUrl.origin + linkUrl.pathname)
  })
})
