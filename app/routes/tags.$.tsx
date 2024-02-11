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
      <div className={'top-margin-large'} />
      <main>
        <div className={'group-elements'}>
          <CategoriesNav
            categories={tags.filter((tag) => tag.questions.length > 0).sort(sortFuncs[sortBy])}
            activeCategoryId={selectedTag.tagId}
          />

          {selectedTag === null ? null : (
            <div>
              <h1 style={{marginTop: '0px'}}>{selectedTag.name}</h1>
              {selectedTag.questions.length === 0 ? (
                <div className={'no-questions'}>No questions found</div>
              ) : (
                <p>
                  {selectedTag.questions.length} pages tagged {`"${selectedTag.name}"`}
                </p>
              )}
              {selectedTag && <ListTable elements={selectedTag.questions} />}
            </div>
          )}
        </div>
      </main>

      <div className={'top-margin-large-with-border'} />

      <div className={'top-margin-large'} />
    </Page>
  )
}
