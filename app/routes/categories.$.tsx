import {useState, useEffect} from 'react'
import {useLoaderData} from '@remix-run/react'
import Page from '~/components/Page'
import ListTable from '~/components/Table'
import {loader} from '~/routes/categories.all'
import {CategoriesNav} from '~/components/CategoriesNav/CategoriesNav'
import type {Tag as TagType} from '~/server-utils/stampy'
import useIsMobile from '~/hooks/isMobile'
import {CategoriesPage} from '~/components/CategoriesNav/Page'
export {loader}

export const sortFuncs = {
  alphabetically: (a: TagType, b: TagType) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  'by number of questions': (a: TagType, b: TagType) => b.questions.length - a.questions.length,
}

export default function Tags() {
  const mobile = useIsMobile()
  const {data} = useLoaderData<ReturnType<typeof loader>>()
  const {currentTag, tags} = data
  const [selectedTag, setSelectedTag] = useState<TagType | null>(currentTag ?? null)

  const [sortBy] = useState<keyof typeof sortFuncs>('alphabetically')

  useEffect(() => {
    if (currentTag === undefined) {
      setSelectedTag(null)
    } else {
      if (selectedTag !== currentTag) {
        setSelectedTag(currentTag)
      }
    }
  }, [selectedTag, tags, currentTag])

  return (
    <Page>
      <main>
        <div className="article-container">
          {!mobile && selectedTag === null ? (
            <CategoriesPage
              categories={tags.filter((tag) => tag.questions.length > 0).sort(sortFuncs[sortBy])}
            />
          ) : (
            <>
              <CategoriesNav
                categories={tags.filter((tag) => tag.questions.length > 0).sort(sortFuncs[sortBy])}
                activeCategoryId={selectedTag?.tagId || 0}
                className={mobile && selectedTag !== null ? 'desktop-only' : ''}
              />
              {selectedTag === null ? null : (
                <article>
                  <h1 className="padding-bottom-40">{selectedTag.name}</h1>
                  <div className="padding-bottom-24">
                    {selectedTag.questions.length === 0
                      ? 'No pages found'
                      : `${selectedTag.questions.length} pages tagged "${selectedTag.name}"`}
                  </div>
                  {selectedTag && (
                    <ListTable
                      className={mobile ? 'full-width' : 'col-8'}
                      elements={selectedTag.questions}
                    />
                  )}
                </article>
              )}
            </>
          )}
        </div>
      </main>

      <div className={'top-margin-large-with-border'} />

      <div className={'top-margin-large'} />
    </Page>
  )
}
