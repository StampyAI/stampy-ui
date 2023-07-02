/**
 * This is a script to refresh the mock return data for tests
 */

import {loadQuestionDetail} from '~/server-utils/stampy'

async function fetchQuestionDetails() {
  console.log('works')
  // const questionDetail = await loadQuestionDetail('NEVER_RELOAD', '2400')
}

await fetchQuestionDetails()
