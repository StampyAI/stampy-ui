import {useState, useEffect, FormEvent} from 'react'
import type {ActionArgs} from '@remix-run/cloudflare'
import {Form, useSearchParams, useSubmit} from '@remix-run/react'
import {redirect} from '@remix-run/cloudflare'
import {addQuestion, loadAllQuestions, fetchJsonList, RelatedQuestions} from '~/server-utils/stampy'

const getRelated = async (question: string): Promise<RelatedQuestions> => {
  const url = `${NLP_SEARCH_ENDPOINT}/api/search?query=${question}`
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
} & Omit<JSX.IntrinsicElements['form'], 'method' | 'ref'>

export const AddQuestion = ({title, relatedQuestions, ...props}: Props) => {
  const [remixSearchParams] = useSearchParams()
  const [stateString] = useState(() => remixSearchParams.get('state') ?? '')
  const [isSubmitted, setSubmitted] = useState(false)

  const submit = useSubmit()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit(e.currentTarget, {replace: true})
    setSubmitted(true)
  }

  useEffect(() => {
    setSubmitted(false)
  }, [title])

  if (isSubmitted) {
    return (
      <p className="result-item none-of-the-above">
        Thanks for asking a new question! {title} was added to our suggestion box. It might take a
        while for it to be answered by our writers, but check back in a few months.
        <br />
        <br />
        The list of current suggestions can be found at{' '}
        <a href="https://coda.io/@alignmentdev/ai-safety-info/suggested-questions-66">
          https://coda.io/@alignmentdev/ai-safety-info/suggested-questions-66
        </a>
      </p>
    )
  }

  return (
    <Form
      method="post"
      action="/questions/add"
      className="result-item none-of-the-above"
      title="Request a new question"
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
  )
}
