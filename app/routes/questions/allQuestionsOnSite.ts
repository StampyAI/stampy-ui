import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadAllQuestions} from '~/server-utils/stampy'

export const loader = async () => {
  return await loadAllQuestions()
}

export function fetchAllQuestionsOnSite() {
  const url = `/questions/allQuestionsOnSite`
  return fetch(url).then(async (response) => {
    const {data, timestamp}: Awaited<ReturnType<typeof loader>> = await response.json()
    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}
