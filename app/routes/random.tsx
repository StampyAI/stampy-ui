import {LoaderFunction, redirect} from '@remix-run/cloudflare'
import {loadAllQuestions, QuestionStatus} from '~/server-utils/stampy'

function randomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  try {
    const {data} = await loadAllQuestions(request)
    const question = randomItem(data.filter((q) => q.status == QuestionStatus.LIVE_ON_SITE))
    return redirect(`/?state=${question.pageid}`)
  } catch (e) {
    console.error(e)
  }
}

export default function Random() {
  // This component will never be rendered because the loader function always redirects
  return null
}
