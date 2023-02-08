import {useState} from 'react'
import type {Tag as TagType} from '~/server-utils/stampy'
import Dialog from '~/components/dialog'

type Props = {
  tags: TagType[]
  selectQuestion: (pageid: string, title: string) => void
  [k: string]: any
}

function TagQuestions({
  tag,
  selectQuestion,
  clearTag,
}: {
  tag: TagType | null
  selectQuestion: (pageid: string, title: string) => void
  clearTag: () => void
}) {
  if (!tag) {
    return <></>
  }

  return (
    <Dialog onClose={() => clearTag()}>
      <div className="dialog-title">
        Select a question from the <b>{tag.name}</b> tag...
      </div>
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
    </Dialog>
  )
}

export default function Tags({tags, selectQuestion}: Props) {
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)
  return (
    <div className="tags-container">
      <TagQuestions
        tag={selectedTag}
        selectQuestion={selectQuestion}
        clearTag={() => setSelectedTag(null)}
      />
      <div>
        {tags &&
          tags
            .filter((t) => t && !t.internal)
            .map((t) => (
              <button className="question-tag" key={t.tagId} onClick={() => setSelectedTag(t)}>
                {t.name}
              </button>
            ))}
      </div>
    </div>
  )
}
