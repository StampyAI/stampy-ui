import {useLocation} from 'react-router-dom'
import Button from '~/components/Button'
import ListTable from '~/components/Table'
import {ArrowRight} from '~/components/icons-generated'
import useToC from '~/hooks/useToC'
import type {TOCItem} from '~/routes/questions.toc'
import type {Question, RelatedQuestion} from '~/server-utils/stampy'
import {questionUrl} from '~/routesMapper'
import styles from './keepGoing.module.css'

const sectionsWithListTable = ['8TJV']

type NextArticleProps = {
  section?: TOCItem
  next?: TOCItem
  first?: boolean
}
const NextArticle = ({section, next, first}: NextArticleProps) =>
  next && (
    <>
      <h2 className="padding-bottom-40">Keep Reading</h2>
      <div className="padding-bottom-24">
        {first ? 'Start' : 'Continue'} with the {first ? 'first' : 'next'} entry in "
        {section?.title}"
      </div>
      <div className={`${styles.container} flex-container bordered ${styles.flex_dynamic}`}>
        <div className="vertically-centered white default-bold">{next.title}</div>
        <Button
          action={questionUrl(next)}
          className="vertically-centered primary-alt"
          props={{state: {section: section?.pageid}}}
        >
          {first ? 'Start' : 'Next'}
          <ArrowRight />
        </Button>
      </div>
    </>
  )

export const KeepGoing = ({pageid, relatedQuestions}: Question) => {
  const location = useLocation()
  const {findSection, getArticle, getNext} = useToC()
  const section = findSection(location?.state?.section || pageid)
  const next = getNext(pageid, section?.pageid)
  const hasRelated = relatedQuestions && relatedQuestions.length > 0
  const showListTable =
    // used on sectionsWithListTable and on sub-sections from any section, but not on leaf articles
    sectionsWithListTable.includes(pageid) || section?.children?.some((c) => c.pageid == pageid)

  const formatRelated = (hasIcon: boolean) => (related: RelatedQuestion) => {
    const relatedSection = findSection(related.pageid)
    const subtitle =
      relatedSection && relatedSection.pageid !== section?.pageid ? relatedSection.title : undefined
    return {...related, subtitle, hasIcon}
  }

  return (
    <div>
      {showListTable ? (
        <ListTable
          sameTab
          elements={getArticle(pageid)?.children?.map(formatRelated(false)) || []}
        />
      ) : (
        <>
          <NextArticle section={section} next={next} first={section?.pageid === pageid} />
          {next && hasRelated && (
            <div className="padding-bottom-24">Or jump to a related question</div>
          )}
          {hasRelated && (
            <div>
              <ListTable elements={relatedQuestions.slice(0, 3).map(formatRelated(true))} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default KeepGoing
