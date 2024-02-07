import {useEffect, useState} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {useLoaderData} from '@remix-run/react'
import {loadTags, Tag as TagType} from '~/server-utils/stampy'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import {CategoriesNav} from '../components/CategoriesNav/Menu'
import {ListTable} from '~/components/Table/ListTable'
import {H1} from '~/components/Typography/H1'
import {Paragraph} from '~/components/Typography/Paragraph'
import useToC from '~/hooks/useToC'

export const loader = async ({request}: Parameters<LoaderFunction>[0]) => {
  try {
    const tags = await loadTags(request)
    return {tags}
  } catch (e) {
    console.error(e)
  }
}

interface SortFunc {
  [key: string]: (a: TagType, b: TagType) => number
}

export default function App() {
  const {tags} = useLoaderData<ReturnType<typeof loader>>()
  const {data = []} = tags ?? {}
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null)
  const [tagsFilter, setTagsFilter] = useState<string>('')
  const {toc} = useToC()

  const [sortBy, setSortBy] = useState<string>('alphabetically')
  const sortFuncs: SortFunc = {
    alphabetically: (a: TagType, b: TagType) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    'by number of questions': (a: TagType, b: TagType) => b.questions.length - a.questions.length,
  }
  const nextSortFunc = (): string => {
    const sortFuncKeys = Object.keys(sortFuncs)
    return sortFuncKeys[(sortFuncKeys.indexOf(sortBy) + 1) % sortFuncKeys.length]
  }

  const tag = data.filter((tag) => tag.tagId === selectedTag?.tagId)[0]
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
              <H1 main={true} style={{marginTop: '0px'}}>
                {tag.name}
              </H1>
              {tag.questions.length === 0 ? (
                <div className={'no-questions'}>No questions found</div>
              ) : (
                <Paragraph>
                  {tag.questions.length} pages tagged {`"${tag.name}"`}
                </Paragraph>
              )}
              {selectedTag && <ListTable elements={tag.questions} />}
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
