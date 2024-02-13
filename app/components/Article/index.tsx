import {useRef, useState, useEffect} from 'react'
import KeepGoing from '~/components/Article/KeepGoing'
import CopyIcon from '~/components/icons-generated/Copy'
import EditIcon from '~/components/icons-generated/Pencil'
import ThumbUpIcon from '~/components/icons-generated/ThumbUp'
import ThumbDownIcon from '~/components/icons-generated/ThumbDown'
import Button, {CompositeButton} from '~/components/Button'
import type {Question, Glossary, PageId, GlossaryEntry} from '~/server-utils/stampy'
import './article.css'

const isLoading = ({text}: Question) => !text || text === 'Loading...'

const footnoteHTML = (el: HTMLDivElement, e: HTMLAnchorElement): string | null => {
  const id = e.getAttribute('href') || ''
  const footnote = el.querySelector(id)

  if (!footnote) return null

  const elem = document.createElement('div')
  elem.innerHTML = footnote.innerHTML

  // remove the back link, as it's useless in the popup
  if (elem?.firstElementChild?.lastChild)
    elem.firstElementChild.removeChild(elem.firstElementChild.lastChild)

  return elem.innerHTML
}

const addPopup = (e: HTMLElement, id: string, contents: string): HTMLElement => {
  const preexisting = document.getElementById(id)
  if (preexisting) return preexisting

  const popup = document.createElement('div')
  popup.className = 'link-popup bordered'
  popup.innerHTML = contents
  popup.id = id

  e.insertAdjacentElement('afterend', popup)

  e.addEventListener('mouseover', () => popup.classList.add('shown'))
  e.addEventListener('mouseout', () => popup.classList.remove('shown'))
  popup.addEventListener('mouseover', () => popup.classList.add('shown'))
  popup.addEventListener('mouseout', () => popup.classList.remove('shown'))

  return popup
}

/*
 * Recursively go through the child nodes of the provided node, and replace all text nodes
 * with the result of calling `textProcessor(textNode)`
 */
const updateTextNodes = (el: Node, textProcessor: (node: Node) => Node) => {
  Array.from(el.childNodes).forEach((child) => updateTextNodes(child, textProcessor))

  if (el.nodeType == Node.TEXT_NODE && el.textContent) {
    const node = textProcessor(el)
    el?.parentNode?.replaceChild(node, el)
  }
}

/*
 * Replace all known glossary words in the given `textNode` with:
 *  - a span to mark it as a glossary item
 *  - an on hover popup with a short explaination of the glossary item
 *  - use each glossary item only once
 */
const glossaryInjecter = (pageid: string, glossary: Glossary) => {
  const unusedGlossaryEntries = Object.values(glossary)
    .filter((item) => item.pageid != pageid)
    .map(({term}) => term)
    .sort((a, b) => b.length - a.length)
    .map(
      (term) =>
        [
          new RegExp(`(^|[^\\w-])(${term})($|[^\\w-])`, 'i'),
          '$1<span class="glossary-entry">$2</span>$3',
        ] as const
    )

  return (html: string) => {
    return unusedGlossaryEntries.reduce((html, [match, replacement], index) => {
      if (html.match(match)) {
        unusedGlossaryEntries.splice(index, 1)
        return html.replace(match, replacement)
      }
      return html
    }, html)
  }
}

const insertGlossary = (pageid: string, glossary: Glossary) => {
  const injecter = glossaryInjecter(pageid, glossary)

  return (textNode: Node) => {
    const html = (textNode.textContent || '').replace('’', "'").replace('—', '-')
    // The glossary items have to be injected somewhere, so this does it by manually wrapping any known
    // definitions with spans. This is done from the longest to the shortest to make sure that sub strings
    // of longer definitions don't override them.
    const updated = injecter(html)
    if (updated == html) {
      return textNode
    }

    const range = document.createRange()
    const fragment = range.createContextualFragment(updated)

    /*
     * If the provided element is a word in the glossary, return its data.
     * This is used to filter out invalid glossary elements
     */
    const glossaryEntry = (e: Element) => {
      const entry = e.textContent && glossary[e?.textContent.toLowerCase().trim()]
      if (
        // If the contents of this item aren't simply a glossary item word, then
        // something has gone wrong and the glossary-entry should be removed
        !entry ||
        // It's possible for a glossary entry to contain another one (e.g. 'goodness' and 'good'), so
        // if this entry is a subset of a bigger entry, remove it.
        e.parentElement?.classList.contains('glossary-entry') ||
        // Remove entries that point to the current question
        pageid == (entry as GlossaryEntry)?.pageid
      ) {
        return null
      }
      return entry
    }

    /*
     * Add a popup to all real glossary words in this text node
     */
    fragment.querySelectorAll('.glossary-entry').forEach((e) => {
      const entry = glossaryEntry(e)
      entry &&
        addPopup(
          e as HTMLSpanElement,
          `glossary-${entry.term}`,
          `<div>${entry.contents}</div>` +
            (entry.pageid ? `<br><a href="/${entry.pageid}">See more...</a>` : '')
        )
    })

    return fragment
  }
}

const ArticleFooter = (question: Question) => {
  const date =
    question.updatedAt &&
    new Date(question.updatedAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    })

  return (
    !isLoading(question) && (
      <div className="footer-comtainer">
        {date && <div className="grey"> {`Updated ${date}`}</div>}
        <div className="flex-double">
          <Button
            className="secondary"
            action={question.answerEditLink || ''}
            tooltip="Edit article"
          >
            <EditIcon className="no-fill" />
          </Button>
        </div>
        <span>Did this page help you?</span>

        <CompositeButton>
          <Button className="secondary" action={() => alert('Like')}>
            <ThumbUpIcon />
            <span className="teal-500">Yes</span>
          </Button>
          <Button className="secondary" action={() => alert('Dislike')}>
            <ThumbDownIcon />
            <span className="teal-500">No</span>
          </Button>
        </CompositeButton>
      </div>
    )
  )
}

const ArticleActions = ({answerEditLink}: Question) => {
  const [tooltip, setTooltip] = useState('Copy link to clipboard')

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.toString())
    setTooltip('Copied link to clipboard')
    setTimeout(() => setTooltip('Copy link to clipboard'), 1000)
  }

  return (
    <CompositeButton>
      <Button className="secondary" action={copyLink} tooltip={tooltip}>
        <CopyIcon />
      </Button>
      <Button className="secondary" action={answerEditLink || ''} tooltip="Edit article">
        <EditIcon className="no-fill" />
      </Button>
    </CompositeButton>
  )
}

const Contents = ({pageid, html, glossary}: {pageid: PageId; html: string; glossary: Glossary}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    updateTextNodes(el, insertGlossary(pageid, glossary))

    // In theory this could be extended to all links
    el.querySelectorAll('.footnote-ref > a').forEach((e) => {
      const footnote = footnoteHTML(el, e as HTMLAnchorElement)
      const footnoteId = (e.getAttribute('href') || '').replace('#', '')
      if (footnote) addPopup(e as HTMLAnchorElement, `footnote-${footnoteId}`, footnote)
    })
  }, [html, glossary, pageid])

  return (
    <div
      className="contents"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      ref={elementRef}
    />
  )
}

const ArticleMeta = (question: Question) => {
  const {text} = question

  const ttr = (text: string, rate = 160) => {
    const time = text.split(' ')
    return Math.ceil(time.length / rate) // ceil to avoid "0 min read"
  }

  return (
    !isLoading(question) && (
      <div className="article-meta">
        <p className="grey">{ttr(text || '')} min read</p>

        <ArticleActions {...question} />
      </div>
    )
  )
}

type ArticleProps = {
  question: Question
  glossary?: Glossary
}
export const Article = ({question, glossary}: ArticleProps) => {
  const {title, text, pageid, tags} = question

  return (
    <article className="article-container">
      <h1 className="teal">{title}</h1>
      <ArticleMeta {...question} />

      <Contents pageid={pageid} html={text || ''} glossary={glossary || {}} />

      <KeepGoing {...question} />

      <ArticleFooter {...question} />
      <hr />
      <div className="article-tags">
        {tags.map((tag) => (
          <Button key={tag} className="primary" action={`/tags/${tag}`}>
            {tag}
          </Button>
        ))}
      </div>
    </article>
  )
}
export default Article
