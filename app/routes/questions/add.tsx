import {useState, useEffect} from 'react'
import type {ActionArgs} from '@remix-run/cloudflare'
import {Form, useSearchParams} from '@remix-run/react'
import {redirect} from '@remix-run/cloudflare'
import {addQuestion, loadAllQuestions, fetchJsonList, RelatedQuestions} from '~/server-utils/stampy'

const getRelated = async (question: string): Promise<RelatedQuestions> => {
  const url = `${NLP_SEARCH_ENDPOINT}/api/search?query=${question}&showLive=0`
  try {
    return await fetchJsonList(url)
  } catch (e) {
    return []
  }
}

export const action = async ({request}: ActionArgs) => {
  const formData = await request.formData()
  let title = formData.get('title') as string
  const state = formData.get('stateString')
  const redirectTo = '/' + (state ? '?state=' + state : '')

  // Make sure that the question was provided
  if (!title) return redirect(redirectTo)

  // Check whether the question is simply a prefix of an existant question,
  // and if so ignore it
  const allQuestions = await loadAllQuestions(request)
  const isPrefix = allQuestions.data.some((question) =>
    question.title.toLowerCase().startsWith(title.toLowerCase())
  )
  if (isPrefix) return redirect(redirectTo)

  // Try to get the related questions from semantic search, and if that doesn't work,
  // fallback to sending along whatever was displayed by the search box
  let relatedQuestions = await getRelated(title)
  if (relatedQuestions && relatedQuestions.length > 0) {
    relatedQuestions = relatedQuestions.map(({pageid, title}) => ({
      title,
      pageid,
    }))
  } else {
    relatedQuestions = formData
      .getAll('relatedQuestion')
      .map((question) => ({title: question})) as RelatedQuestions
  }

  // Make sure the question is formatted as a question
  if (!title.endsWith('?')) title = title + '?'
  title = title[0].toUpperCase() + title.substring(1)
  title = title.trim()

  const result = await addQuestion(title, relatedQuestions)
  console.log('Added question "' + title + '", response:', result)

  return redirect(redirectTo)
}

type Props = {
  title: string
  relatedQuestions: string[]
  immediately?: boolean
} & Omit<JSX.IntrinsicElements['form'], 'method' | 'ref'>

export const AddQuestion = ({title, relatedQuestions, immediately, ...props}: Props) => {
  const url = '/questions/add'
  const [remixSearchParams] = useSearchParams()
  const [stateString] = useState(() => remixSearchParams.get('state') ?? '')
  const [isSubmitted, setSubmitted] = useState(immediately)

  const handleSubmit = async () => {
    setSubmitted(true)
  }

  useEffect(() => {
    const addQuestion = async () => {
      const body = new FormData()
      body.append('title', title)
      body.append('stateString', stateString)
      await fetch(url, {method: 'POST', body})
    }
    if (immediately) {
      addQuestion()
    }
  }, [title, stateString, immediately])

  if (isSubmitted) {
    return (
      <p className="none-of-the-above no-stretch">
        Thank you! {title} was added to our suggestion box. Our editors will work on answering these
        in the upcoming weeks. Feel free to browse through our current list of{' '}
        <a href="https://coda.io/@alignmentdev/ai-safety-info/suggested-questions-66">
          suggested questions
        </a>
        .
      </p>
    )
  }

  return (
    <div className="possible-question">
      <Form
        method="post"
        action={url}
        className="result-item result-item-box none-of-the-above"
        onSubmit={handleSubmit}
        {...props}
      >
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="stateString" value={stateString} />
        {relatedQuestions.map((title) => (
          <input type="hidden" name="relatedQuestion" key={title} value={title} />
        ))}
        <button type="submit" className="transparent-button result-item">
          ＋ None of these: Request an answer to my exact question above
        </button>
      </Form>
      <div className="padding"></div>
    </div>
  )
}
