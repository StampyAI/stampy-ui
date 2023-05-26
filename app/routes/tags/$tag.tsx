import {useState, ReactNode} from 'react'
import {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {loadTag, Tag as TagType} from '~/server-utils/stampy'
import Dialog from '~/components/dialog'

type Props = {
  tags: string[]
  selectQuestion: (pageid: string, title: string) => void
  [k: string]: any
}

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {tag} = params
  if (!tag) {
    throw Error('missing tag name')
  }

  try {
    return await loadTag(request, tag)
  } catch (error: any) {
    console.error(`error fetching tag "${tag}":`, error)
    return {
      error: error.toString(),
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
        Select a question from the <b>{tag.name}</b> tag...
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

export function Tags({tags, selectQuestion}: Props) {
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)

  const setTag = async (tagName: string) => {
    setSelectedTag({name: tagName} as TagType)

    try {
      const tag = (await fetchTag(tagName)) as TagType
      setSelectedTag(tag)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="tags-container">
      {selectedTag && (
        <TagQuestions
          tag={selectedTag}
          selectQuestion={selectQuestion}
          clearTag={() => setSelectedTag(null)}
        />
      )}
      <div>
        {tags &&
          tags.map((t) => (
            <button className="question-tag" key={t} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
      </div>
    </div>
  )
}
