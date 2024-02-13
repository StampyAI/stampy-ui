import Button from '~/components/Button'
import ListTable from '~/components/Table'
import {ArrowRight} from '~/components/icons-generated'
import useToC from '~/hooks/useToC'
import type {TOCItem} from '~/routes/questions.toc'
import type {Question} from '~/server-utils/stampy'
import './keepGoing.css'

const nonContinueSections = ['8TJV']

const NextArticle = ({section, next}: {section?: TOCItem; next?: TOCItem}) =>
  next && (
    <>
      <h2>Keep going! &#128073;</h2>
      <span>Continue with the next article in {section?.category}</span>
      <div className="keepGoing-next">
        <span className="keepGoing-next-title">{next.title}</span>
        <Button action={`/${next.pageid}`} className="primary-alt">
          Next
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
      {!skipNext && <NextArticle section={section} next={next} />}

      {next && hasRelated && !skipNext && <span>Or jump to a related question</span>}
      {hasRelated && <ListTable elements={relatedQuestions.map((i) => ({...i, hasIcon: true}))} />}
    </div>
  )
}

export default KeepGoing
