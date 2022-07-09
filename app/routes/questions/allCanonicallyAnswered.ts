import type {LoaderFunction} from '@remix-run/cloudflare'
import {getAllCanonicallyAnsweredQuestions} from '~/stampy'

export const loader: LoaderFunction = async () => {
  return await getAllCanonicallyAnsweredQuestions()
}
