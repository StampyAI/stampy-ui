import {LoaderFunction} from 'remix'
import {getQuestionDetail} from '~/stampy'

export const loader: LoaderFunction = async ({params}) => {
  const {question} = params
  if (!question) {
    throw Error('missing question title')
  }

  return await getQuestionDetail(question)
}
