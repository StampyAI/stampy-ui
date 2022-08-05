import type {LoaderFunction} from '@remix-run/cloudflare'
import {loadQuestionDetail} from '~/server-utils/stampy'

export const loader: LoaderFunction = async ({request, params}) => {
  const {question} = params
  if (!question) {
    throw Error('missing question title')
  }

  return await loadQuestionDetail(request, question)
}
