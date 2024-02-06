import {useEffect, useState, MouseEvent} from 'react'
import {useOutletContext} from '@remix-run/react'
import {Header, Footer} from '~/components/layouts'
import useQuestionStateInUrl from '~/hooks/useQuestionStateInUrl'
import {LINK_WITHOUT_DETAILS_CLS, fetchQuestion, Question} from '~/routes/questions.$question'
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
            <details key={i} id={normalizeName(child?.content)}>
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
            <span id={normalizeName(item.content)} style={{padding: '5px'}}>
              <MaybeURL item={item} selectItem={selectItem} />
            </span>
          </summary>
          {item?.items && <ChildList items={item.items} selectItem={selectItem} />}
        </details>
      ))}
    </nav>
  )
}

const showMore = (el: HTMLElement, toggle = false) => {
  const button = el.closest('.answer')?.querySelector('.see-more')
  if (toggle) {
    button?.classList.toggle('visible')
  } else {
    button?.classList.add('visible')
  }
  // The AutoHeight component doesn't notice when a random <div> changes CSS class,
  // so manually triggering toggle event (as if this was a <details> element).
  document.dispatchEvent(new Event('toggle'))
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

  useEffect(() => {
    const fetcher = async () => {
      selectItem({pageId: '9OGZ'})
      const response = await fetch('/toc.json')
      setToc(await response.json())
    }
    fetcher()
  }, [])

  const handleSpecialLinks = (e: MouseEvent) => {
    const el = e.target as HTMLAnchorElement
    if (
      el.tagName !== 'A' ||
      el.closest('.question-footer') ||
      el.classList.contains('footnote-backref') ||
      el.classList.contains(LINK_WITHOUT_DETAILS_CLS)
    )
      return

    if (el.classList.contains('see-more')) {
      showMore(el, true)
      e.preventDefault()
      return
    }
    if (el.parentElement?.classList.contains('footnote-ref')) {
      showMore(el)
      return
    }
  }

  return (
    <>
      <style>{`
        body { max-width: 1400px; }
            `}</style>
      <Header />
      <main className="toc-container" onClick={handleSpecialLinks}>
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
