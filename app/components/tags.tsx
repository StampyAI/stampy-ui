import type {Tag as TagType} from '~/server-utils/stampy'

type Props = {
  tags: TagType[]
  [k: string]: any
}

export default function Tags({tags}: Props) {
  return (
    <div className="tags-container">
      <div>
        {tags &&
          tags.filter(Boolean).map((t) => (
            <span className="question-tag" key="{t.tagId}">
              {t.name}
            </span>
          ))}
      </div>
    </div>
  )
}
