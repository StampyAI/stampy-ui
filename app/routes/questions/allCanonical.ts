import type {LoaderFunction} from '@remix-run/cloudflare'
import {getAllCanonicalQuestions} from '~/stampy'

export const loader: LoaderFunction = async () => {
  return await getAllCanonicalQuestions()
}
