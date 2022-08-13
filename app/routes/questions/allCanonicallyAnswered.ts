import type {LoaderFunction} from '@remix-run/cloudflare'
import {loadAllCanonicallyAnsweredQuestions} from '~/server-utils/stampy'

export const loader: LoaderFunction = async ({request}) => {
  return await loadAllCanonicallyAnsweredQuestions(request)
}
