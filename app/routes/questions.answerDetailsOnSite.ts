import type {LoaderFunctionArgs} from '@remix-run/cloudflare'
import {loadOnSiteAnswers, loadMoreAnswerDetails} from '~/server-utils/stampy'

export const loader = async ({request}: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams
  const nextPage = searchParams.get('nextPage')
  if (nextPage !== null) {
    return await loadMoreAnswerDetails(request, nextPage || null)
  }
  const {data, timestamp} = await loadOnSiteAnswers(request)
  return {data: {questions: data, nextPageLink: null}, timestamp}
}
