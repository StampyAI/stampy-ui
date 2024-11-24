import {useMemo} from 'react'
import {Link} from '@remix-run/react'
import {questionUrl} from '~/routesMapper'
import './articlenav.css'
import {useOnSiteQuestions} from '~/hooks/useCachedObjects'
import type {Question} from '~/server-utils/stampy'

export const ArticlesNavManualList = ({
  listOfIds,
  current,
}: {
  listOfIds: string[]
  current: string
}) => {
  const {items: onSiteQuestions} = useOnSiteQuestions()
  const onSiteQuestionsMap = useMemo(
    () =>
      (onSiteQuestions ?? []).reduce((acc: Record<string, Question>, q) => {
        acc[q.pageid] = q
        return acc
      }, {}),
    [onSiteQuestions]
  )
  return (
    <div className="articles-group small desktop-only bordered mark-visited">
      {listOfIds.map((pageid) => (
        <details className="article" key={pageid}>
          <summary className={`articles-title ${pageid === current ? 'selected' : ''}`}>
            <Link to={`${questionUrl({pageid})}?list=${listOfIds.join(',')}`}>
              {onSiteQuestionsMap[pageid]?.title ?? pageid}
            </Link>
          </summary>
        </details>
      ))}
    </div>
  )
}
