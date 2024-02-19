import Button from '~/components/Button'
import ListTable from '~/components/Table'
import {ArrowRight} from '~/components/icons-generated'
import useToC from '~/hooks/useToC'
import type {TOCItem} from '~/routes/questions.toc'
import type {Question, RelatedQuestion} from '~/server-utils/stampy'
import {questionUrl} from '~/routesMapper'
import styles from './keepGoing.module.css'

const nonContinueSections = ['8TJV']

type NextArticleProps = {
  section?: TOCItem
  next?: TOCItem
  first?: boolean
}
const NextArticle = ({section, next, first}: NextArticleProps) =>
  next && (
    <>
      <h2 className="padding-bottom-40">Keep going! &#128073;</h2>
      <div className="padding-bottom-24">
        {first ? 'Start' : 'Continue'} with the {first ? 'first' : 'next'} article in{' '}
        {section?.category}
      </div>
      <div className={`${styles.container} flex-container bordered`}>
        <div className="vertically-centered white default-bold">{next.title}</div>
        <Button action={questionUrl(next)} className="primary-alt">
          {first ? 'Start' : 'Next'}
          <ArrowRight />
        </Button>
      </div>
    </>
  )

export const KeepGoing = ({pageid, relatedQuestions}: Question) => {
  const {findSection, getArticle, getNext} = useToC()
  const section = findSection(pageid)
  const next = getNext(pageid)
  const hasRelated = relatedQuestions && relatedQuestions.length > 0
  const skipNext = nonContinueSections.includes(section?.pageid || '')

  const formatRelated = (related: RelatedQuestion) => {
    const relatedSection = findSection(related.pageid)
    const subtitle =
      relatedSection && relatedSection.pageid !== section?.pageid ? relatedSection.title : undefined
    return {...related, subtitle, hasIcon: true}
  }

  return (
    <div>
      {!skipNext && (
        <NextArticle section={section} next={next} first={section?.pageid === pageid} />
      )}

      {next && hasRelated && !skipNext && (
        <div className="padding-bottom-56">Or jump to a related question</div>
      )}
      {hasRelated && !skipNext && (
        <div className="padding-bottom-40">
          <ListTable elements={relatedQuestions.slice(0, 3).map(formatRelated)} />
        </div>
      )}
      {skipNext && (
        <div className="padding-bottom-40">
          <ListTable elements={getArticle(pageid)?.children?.map(formatRelated) || []} />
        </div>
      )}
    </div>
  )
}

export default KeepGoing
