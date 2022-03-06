import {LoaderFunction} from 'remix'
import {getQuestionDetail} from '~/stampy'

export const loader: LoaderFunction = async ({params}) => {
  const {questionTitle} = params
  if (!questionTitle) {
    throw Error('missing question title')
  }

  return await getQuestionDetail(questionTitle)
}
