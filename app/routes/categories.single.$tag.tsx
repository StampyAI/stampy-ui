import {ReactNode} from 'react'
import {LoaderFunction} from '@remix-run/cloudflare'
import {Tag as TagType, loadTag} from '~/server-utils/stampy'
import Dialog from '~/components/dialog'

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
