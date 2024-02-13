import Button from '~/components/Button'
import ListTable from '~/components/Table'
import {ArrowRight} from '~/components/icons-generated'
import useToC from '~/hooks/useToC'
import type {TOCItem} from '~/routes/questions.toc'
import type {Question} from '~/server-utils/stampy'
import './keepGoing.css'

const nonContinueSections = ['8TJV']

type NextArticleProps = {
  section?: TOCItem
  next?: TOCItem
  first?: boolean
}
const NextArticle = ({section, next, first}: NextArticleProps) =>
  next && (
    <>
      <h2>Keep going! &#128073;</h2>
      <span>
        {first ? 'Start' : 'Continue'} with the {first ? 'first' : 'next'} article in{' '}
        {section?.category}
      </span>
      <div className="keepGoing-next">
        <span className="keepGoing-next-title">{next.title}</span>
        <Button action={`/${next.pageid}`} className="primary-alt">
          {first ? 'Start' : 'Next'}
          <ArrowRight />
        </Button>
      </div>
    </>
  )

export const KeepGoing = ({pageid, relatedQuestions}: Question) => {
  const {findSection, getNext} = useToC()
  const section = findSection(pageid)
  const next = getNext(pageid)
  const hasRelated = relatedQuestions && relatedQuestions.length > 0
  const skipNext = nonContinueSections.includes(section?.pageid || '')

  return (
    <div className="keepGoing">
      {!skipNext && (
        <NextArticle section={section} next={next} first={section?.pageid === pageid} />
      )}

      {next && hasRelated && !skipNext && <span>Or jump to a related question</span>}
      {hasRelated && <ListTable elements={relatedQuestions.map((i) => ({...i, hasIcon: true}))} />}
    </div>
  )
}

export default KeepGoing
