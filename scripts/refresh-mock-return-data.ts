/**
 * This is a script to refresh the mock return data for tests
 */

// import {loadQuestionDetail} from '~/server-utils/stampy'

async function main(): Promise<void> {
  const foo = await fetchQuestionDetails()
  console.log(foo)
}

async function fetchQuestionDetails() {
  console.log('works')
  // const questionDetail = await loadQuestionDetail('NEVER_RELOAD', '2400')
}

main()
