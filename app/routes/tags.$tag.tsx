import {useState, useEffect, ReactNode} from 'react'
import {LoaderFunction} from '@remix-run/cloudflare'
import {reloadInBackgroundIfNeeded} from '~/server-utils/kv-cache'
import {
  loadTag,
  Tag as TagType,
  QuestionState,
  RelatedQuestions,
  loadTags,
} from '~/server-utils/stampy'
import Dialog from '~/components/dialog'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import useToC from '~/hooks/useToC'
import {useLoaderData} from '@remix-run/react'
import {ListTable} from '~/components/Table/ListTable'
import {CategoriesNav} from '~/components/CategoriesNav/Menu'

type Props = {
  tags: string[]
  selectQuestion: (pageid: string, title: string) => void
  [k: string]: unknown
}

export const loader = async ({request, params}: Parameters<LoaderFunction>[0]) => {
  const {tag} = params
  if (!tag) {
    throw Error('missing tag name')
  }

  try {
    const tags = await loadTags(request)
    return {tag, tags}
  } catch (error: unknown) {
    console.error(`error fetching tag "${tag}":`, error)
    // return {
    //   error: error?.toString(),
    //   timestamp: new Date().toISOString(),
    //   data: [],
    // }
  }
}

export const sortFuncs = {
  alphabetically: (a: TagType, b: TagType) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  'by number of questions': (a: TagType, b: TagType) => b.questions.length - a.questions.length,
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

export default function App() {
  const {tag, tags} = useLoaderData<ReturnType<typeof loader>>()
  // const result = useLoaderData<ReturnType<typeof loader>>()
  const {data = []} = tags ?? {}
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)
  const [tagsFilter, setTagsFilter] = useState<string>('')
  const {toc} = useToC()

  const [sortBy, setSortBy] = useState<keyof typeof sortFuncs>('alphabetically')

  const tagWithQuestions = data.filter((tagData) => tagData.name === tag)[0]
  useEffect(() => {
    if (selectedTag === null) {
      setSelectedTag(data.filter((tag) => tag.questions.length > 0)[0])
    }
  }, [data, selectedTag])
  if (selectedTag === null) {
    return null
  }
  return (
    <>
      <Header toc={toc} categories={data} />
      <div className={'top-margin-large'} />
      <main>
        <div className={'group-elements'}>
          <CategoriesNav
            categories={
              data
                .filter((tag) => tag.questions.length > 0)
                .filter((tag) => tag.name.toLowerCase().includes(tagsFilter.toLowerCase()))
                .sort(sortFuncs[sortBy])

              // {title: "AI Safety", id: 1},
            }
            active={Number(selectedTag)}
            onClick={setSelectedTag}
            onChange={setTagsFilter}
          />

          {selectedTag === null ? null : (
            <div>
              <h1 style={{marginTop: '0px'}}>{tagWithQuestions.name}</h1>
              {tagWithQuestions.questions.length === 0 ? (
                <div className={'no-questions'}>No questions found</div>
              ) : (
                <p>
                  {tagWithQuestions.questions.length} pages tagged {`"${tagWithQuestions.name}"`}
                </p>
              )}
              {selectedTag && <ListTable elements={tagWithQuestions.questions} />}
            </div>
          )}
        </div>
      </main>

      <div className={'top-margin-large-with-border'} />

      <div className={'top-margin-large'} />

      <Footer />
    </>
  )
}