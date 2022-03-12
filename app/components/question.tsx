import {useEffect} from 'react'
import {useFetcher} from 'remix'
import AutoHeight from 'react-auto-height'
import type {Questions} from '~/utils/stampy'

export default function Question({
  pageid,
  title,
  text,
  expanded,
  onToggle,
}: Questions[0] & {
  expanded: boolean
  onToggle: () => void
}) {
  const fetcher = useFetcher<{title: string; text: string}>()
  useEffect(() => {
    if (!text) {
      fetcher.load(`/questions/${pageid}`)
    }
  }, [pageid, text])

  return (
    <article>
      <h2 className={expanded ? 'expanded' : ''} onClick={onToggle}>
        {fetcher.data?.title || title}
      </h2>
      <AutoHeight>
        {expanded && (
          <div
            className="answer"
            dangerouslySetInnerHTML={{__html: text || fetcher.data?.text || '<p>Loading...</p>'}}
          />
        )}
      </AutoHeight>
    </article>
  )
}
