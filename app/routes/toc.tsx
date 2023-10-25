import {useEffect, useState} from 'react'
import {useOutletContext} from '@remix-run/react'
import {Header, Footer} from '~/components/layouts'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {fetchQuestion, Question} from '~/routes/questions/$question'
import {QuestionState} from '~/server-utils/stampy'
import type {Question as QuestionType, PageId} from '~/server-utils/stampy'
import type {Context} from '~/root'

type Item = {
  items?: Item[]
  content?: string
  pageId?: PageId
}

const normalizeName = (name: string | undefined) => name?.replace(/[^A-Za-z]/g, '').toLowerCase()

const MaybeURL = ({item, selectItem}: {item: Item; selectItem: (i: Item) => void}) => {
  if (!item || !item.content) {
    return null
  } else if (!item.pageId) {
    return <>{item.content}</>
  }
  return (
    <a
      href={item.pageId}
      onClick={(e) => {
        e.preventDefault()
        selectItem(item)
      }}
    >
      {item.content}
    </a>
  )
}

const ChildList = ({items, selectItem}: {items: Item[]; selectItem: (i: Item) => void}) => {
  if (!items) return null

  return (
    <div style={{marginLeft: '15px'}}>
      {items.map((child, i) => {
        if (child?.items && child.items.length > 0) {
          return (
            <details key={i} id={normalizeName(child?.content)} open>
              <summary>
                <MaybeURL item={child} selectItem={selectItem} />
              </summary>
              {child?.items && <ChildList items={child.items} selectItem={selectItem} />}
            </details>
          )
        } else {
          return (
            <li key={i} style={{marginLeft: '15px'}}>
              <MaybeURL item={child} selectItem={selectItem} />
            </li>
          )
        }
      })}
    </div>
  )
}

const ToC = ({toc, selectItem}: {toc: Item[]; selectItem: (i: Item) => void}) => {
  return (
    <nav className="toc" style={{flex: '1 1 500px', marginRight: '10px'}}>
      {toc.map((item: Item, i: number) => (
        <details key={i} open>
          <summary>
            <span id={normalizeName(item.content)} style={{fontSize: '32px', padding: '5px'}}>
              <MaybeURL item={item} selectItem={selectItem} />
            </span>
          </summary>
          {item?.items && <ChildList items={item.items} selectItem={selectItem} />}
        </details>
      ))}
    </nav>
  )
}

export default function App() {
  const [toc, setToc] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState<QuestionType>()
  const {minLogo} = useOutletContext<Context>()
  const {toggleQuestion, onLazyLoadQuestion, selectQuestion, glossary} = useQuestionStateInUrl(
    minLogo,
    []
  )

  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch('/toc.json')
      setToc(await response.json())
    }
    fetcher()
  }, [])

  const selectItem = async (item: Item) => {
    if (!item.pageId) return
    setLoading(true)
    try {
      const question = await fetchQuestion(item.pageId)
      setQuestion({...question, questionState: QuestionState.OPEN})
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        body { max-width: 1400px; }
            `}</style>
      <Header />
      <main className="toc-container">
        <ToC toc={toc} selectItem={selectItem} />
        <div style={{flex: '5 3 auto'}}>
          <div className={`search-loader ${loading ? 'loader' : ''}`}> </div>
          {question && (
            <Question
              questionProps={question}
              onLazyLoadQuestion={onLazyLoadQuestion}
              onToggle={toggleQuestion}
              selectQuestion={selectQuestion}
              glossary={glossary}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
