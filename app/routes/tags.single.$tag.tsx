import {useState, useEffect, ReactNode} from 'react'
import {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {Tag as TagType, QuestionState, RelatedQuestions, loadTag} from '~/server-utils/stampy'
import Dialog from '~/components/dialog'

type Props = {
  tags: string[]
  selectQuestion: (pageid: string, title: string) => void
  [k: string]: unknown
}

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {tag: tagFromUrl} = params
  if (!tagFromUrl) {
    throw Error('missing tag name')
  }

  try {
    return await loadTag(request, tagFromUrl)
  } catch (error: unknown) {
    console.error(`error fetching tag "${tagFromUrl}":`, error)
    return {
      error: error?.toString(),
      timestamp: new Date().toISOString(),
      data: [],
    }
  }
}

export async function fetchTag(tagName: string): Promise<TagType | never[]> {
  const url = `/tags/${encodeURIComponent(tagName)}`
  return fetch(url).then(async (response) => {
    const json: Awaited<ReturnType<typeof loader>> = await response.json()
    if ('error' in json) console.error(json.error)
    const {data, timestamp} = json

    reloadInBackgroundIfNeeded(url, timestamp)

    return data
  })
}

export function Tag({
  name,
  questions: tqs,
  showCount,
}: {
  name: string
  questions?: RelatedQuestions
  showCount?: boolean
}) {
  const [questions, setQuestions] = useState(tqs)
  const pageIds = questions?.map((q) => q.pageid).join(QuestionState.COLLAPSED)

  useEffect(() => {
    const fetcher = async () => {
      if (!questions) {
        const tag = (await fetchTag(name)) as TagType
        if (tag) setQuestions(tag.questions)
      }
    }
    fetcher()
  }, [questions, name])

  return (
    <a className="tag" href={`/?state=${pageIds}${QuestionState.COLLAPSED}`} key={name}>
      <span className="tag-name">{name}</span>
      {showCount && <span className="tag-stat">({questions?.length})</span>}
    </a>
  )
}

export function TagQuestions({
  tag,
  selectQuestion,
  clearTag,
}: {
  tag: TagType
  selectQuestion: (pageid: string, title: string) => void
  clearTag: () => void
}) {
  const TagDialog = ({children}: {children: ReactNode | ReactNode[]}) => (
    <Dialog onClose={() => clearTag()}>
      <div className="dialog-title">
        <div className="dialog-title-header">
          Select a question from the <b>{tag.name}</b> tag...
        </div>
      </div>
      {children}
    </Dialog>
  )

  if (!tag.rowId) {
    return (
      <TagDialog>
        <div className="loader"></div>
      </TagDialog>
    )
  }

  return (
    <TagDialog>
      <div className="tag-questions">
        {tag.questions.map((question) => (
          <div key={tag.rowId + '-' + question.pageid}>
            <button
              className="question-tag"
              onClick={() => {
                selectQuestion(question.pageid, question.title)
                clearTag()
              }}
            >
              {question.title}
            </button>
          </div>
        ))}
      </div>
    </TagDialog>
  )
}

export function Tags({tags}: Props) {
  return (
    <div className="tags-container">
      <div>{tags && tags.map((name) => <Tag key={name} name={name} />)}</div>
    </div>
  )
}