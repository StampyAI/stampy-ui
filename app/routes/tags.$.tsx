import {useState, useEffect} from 'react'
import {useLoaderData} from '@remix-run/react'
import Page from '~/components/Page'
import ListTable from '~/components/Table'
import {loader} from '~/routes/tags.all'
import {CategoriesNav} from '~/components/CategoriesNav/Menu'
import type {Tag as TagType} from '~/server-utils/stampy'

export {loader}

export const buildTagUrl = ({tagId, name}: TagType) => `/tags/${tagId}/${name}`

export const sortFuncs = {
  alphabetically: (a: TagType, b: TagType) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  'by number of questions': (a: TagType, b: TagType) => b.questions.length - a.questions.length,
}

export default function Tags() {
  const {data} = useLoaderData<ReturnType<typeof loader>>()
  const {currentTag, tags} = data
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)

  const [sortBy] = useState<keyof typeof sortFuncs>('alphabetically')

  useEffect(() => {
    if (selectedTag !== currentTag) {
      setSelectedTag(currentTag)
    }
  }, [selectedTag, tags, currentTag])
  if (selectedTag === null) {
    return null
  }
  return (
    <Page>
      <main>
        <div className="article-container">
          <CategoriesNav
            categories={tags.filter((tag) => tag.questions.length > 0).sort(sortFuncs[sortBy])}
            activeCategoryId={selectedTag.tagId}
          />

          {selectedTag === null ? null : (
            <article>
              <h1 className="padding-bottom-40">{selectedTag.name}</h1>
              <div className="padding-bottom-24">
                {selectedTag.questions.length === 0
                  ? 'No pages found'
                  : `${selectedTag.questions.length} pages tagged "${selectedTag.name}"`}
              </div>
              {selectedTag && <ListTable className="col-8" elements={selectedTag.questions} />}
            </article>
          )}
        </div>
      </main>

      <div className={'top-margin-large-with-border'} />

      <div className={'top-margin-large'} />
    </Page>
  )
}
