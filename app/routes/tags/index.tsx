import {useState} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {useLoaderData} from '@remix-run/react'
import {loadTags, Tag as TagType} from '~/server-utils/stampy'
import {Header, Footer} from '~/components/layouts'
import {TagQuestions} from './$tag'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  try {
    const tags = await loadTags(request)
    return {tags}
  } catch (e) {
    console.error(e)
  }
}

function Tag(setTag: (tag: TagType) => void, tag: TagType) {
  return (
    <div className="tag" key={tag.tagId} onClick={() => setTag(tag)}>
      <img src={tag.icon || ''} alt=" " />
      <div className="tag-contents">
        <div className="tag-name">{tag.name}</div>
        <div className="tag-details">
          <span className="tag-stat">{tag.questions.length} questions</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const {tags} = useLoaderData<ReturnType<typeof loader>>()
  const {data = []} = tags ?? {}
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)

  return (
    <>
      <Header />
      <main>
        <div className="tags-container">
          {selectedTag && (
            <TagQuestions
              tag={selectedTag}
              selectQuestion={() => null}
              clearTag={() => setSelectedTag(null)}
            />
          )}
          {data.filter((tag) => tag.questions.length > 0).map((tag) => Tag(setSelectedTag, tag))}
        </div>
      </main>

      <Footer />
    </>
  )
}
