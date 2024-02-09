import {ReactNode} from 'react'
import {ArrowRight} from '~/components/icons-generated'
import {BottomEclipse} from '~/components/icons-generated'
import {GroupTopEcplise} from '~/components/icons-generated'
import {ListTable} from '~/components/Table/ListTable'
import './box.css'

interface ContentBoxProps {
  title: string | ReactNode
  action?: string
  actionTitle?: string | ReactNode
  children?: ReactNode
  className?: string
}
export const ContentBox = ({title, action, actionTitle, children, className}: ContentBoxProps) => {
  return (
    <div className={`main-container-box-table bordered ${className || ''}`}>
      <div className="content-box-description">
        <h2>{title}</h2>
        <a href={action} className="bordered content-box-table-button teal-500">
          {actionTitle}
        </a>
      </div>
      <div className="content-box-table">{children}</div>
    </div>
  )
}

export const ContentBoxMain = () => (
  <ContentBox
    className="teal-background"
    title={
      <>
        <div className="white">New to AI Safety?</div>
        <div className="teal-200">
          Something about <br />
          reading and quick
        </div>
      </>
    }
    action="/9OGZ"
    actionTitle={(
      <>
        Start here
        <ArrowRight className="img-2" />
      </>
    )}
  >
    <img
      loading="lazy"
      src="/assets/book-circle.svg"
      className="content-box-right-icon"
      alt="AI Safety Image"
    />
  </ContentBox>
)

export const ContentBoxSecond = () => {
  return (
    <ContentBox title="Explore the arguments" action="/9TDI" actionTitle="Browse all arguments">
      <ListTable
        elements={[
          {title: 'What are the main sources of AI existential risk?', pageid: '8503'},
          {title: 'Do people seriously worry about existential risk from AI?', pageid: '6953'},
          {title: 'Why would an AI do bad things?', pageid: '2400'},
        ]}
      />
    </ContentBox>
  )
}

export const ContentBoxThird = () => {
  return (
    <ContentBox title="Get involved with AI safety" action="/8TJV" actionTitle="Learn how">
      <GroupTopEcplise className="eclipse-individual-top" />
      <BottomEclipse className="eclipse-team-bottom" />
    </ContentBox>
  )
}

export default ContentBox
