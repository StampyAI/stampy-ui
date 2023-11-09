import {useState} from 'react'
import type {LoaderFunction} from '@remix-run/cloudflare'
import {useLoaderData} from '@remix-run/react'
import {loadTags, Tag as TagType} from '~/server-utils/stampy'
import {Header, Footer} from '~/components/layouts'
import {MagnifyingGlass} from '~/components/icons-generated'
import {TagQuestions, Tag} from './$tag'
import {Undo} from '../../components/icons-generated'

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

  const [sortBy, setSortBy] = useState<string>('by number of questions')
  const sortFuncs: SortFunc = {
    alphabetically: (a: TagType, b: TagType) => (a.name > b.name ? 1 : -1),
    'by number of questions': (a: TagType, b: TagType) => b.questions.length - a.questions.length,
  }
  const nextSortFunc = (): string => {
    const sortFuncKeys = Object.keys(sortFuncs)
    return sortFuncKeys[(sortFuncKeys.indexOf(sortBy) + 1) % sortFuncKeys.length]
  }

  return (
    <>
      <Header />
      <main>
        <div className="tag-controls">
          <a href="/" className="icon-link">
            <Undo />
            Back
          </a>
          <label className="searchbar">
            <input
              type="search"
              name="searchbar"
              placeholder="Filter tags"
              onChange={(e) => setTagsFilter(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && setTagsFilter(e.currentTarget.value)}
            />
            <MagnifyingGlass />
          </label>
          <div className="sort-by">
            <input
              type="button"
              name="sort"
              onClick={() => setSortBy(nextSortFunc())}
              value={`Sort ${nextSortFunc()}`}
            />
          </div>
        </div>

        <div className="all-tags-container">
          {selectedTag && (
            <TagQuestions
              tag={selectedTag}
              selectQuestion={() => null}
              clearTag={() => setSelectedTag(null)}
            />
          )}
          {data
            .filter((tag) => tag.questions.length > 0)
            .filter((tag) => tag.name.toLowerCase().includes(tagsFilter.toLowerCase()))
            .sort(sortFuncs[sortBy])
            .map(({name, questions}) => (
              <Tag key={name} name={name} questions={questions} showCount />
            ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
