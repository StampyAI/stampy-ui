import {AnswersRow, loadQuestionDetail} from '~/server-utils/stampy'
import question8486 from '~/mocks/coda-responses/question-8486.json'

export type questionData = [string, {items: AnswersRow[]}]
export const questions: Array<questionData> = [['8486', question8486]]

describe('loadQuestionDetail', () => {
  it.each<questionData>(questions)('can load question %i', async (questionId, questionData) => {
    const fetchMock = getMiniflareFetchMock()
    fetchMock.disableNetConnect()

    const origin = fetchMock.get('https://coda.io')
    origin
      .intercept({
        method: 'GET',
        path: `/apis/v1/docs/fau7sl2hmG/tables/grid-sync-1059-File/rows?useColumnNames=true&sortBy=natural&valueFormat=rich&query=%22UI%20ID%22:%22${questionId}%22`,
      })
      .reply(200, questionData)

    const questionDetail = await loadQuestionDetail('NEVER_RELOAD', questionId)
    const firstItem = questionData.items[0]
    expect(questionDetail.data.status).toBe(firstItem.values.Status.name)
    const linkUrl = new URL(firstItem.values.Link.url)
    expect(questionDetail.data.answerEditLink).toBe(linkUrl.origin + linkUrl.pathname)
  })
})
