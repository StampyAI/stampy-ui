import {ReactNode} from 'react'
import {ArrowRight} from '~/components/icons-generated'
import ListTable from '~/components/Table'
import Button from '~/components/Button'
import SvgGroup from '~/components/icons-generated/Group'
import {questionUrl} from '~/routesMapper'
import './box.css'

interface ContentBoxProps {
  title: string | ReactNode
  action?: string
  actionTitle?: string | ReactNode
  children?: ReactNode
  className?: string
  classNameTable?: string
}
export const ContentBox = ({
  title,
  action,
  actionTitle,
  children,
  className,
  classNameTable = 'content-box-table',
}: ContentBoxProps) => {
  return (
    <div className={`main-container-box-table bordered ${className || ''}`}>
      <div className="content-box-description">
        <h2 className="padding-bottom-32">{title}</h2>
        <Button action={action} className="bordered content-box-table-button teal-500">
          {actionTitle}
        </Button>
      </div>
      <div className={classNameTable}>{children}</div>
    </div>
  )
}

export const ContentBoxMain = () => (
  <ContentBox
    className="teal-background"
    classNameTable={'content-box-table main'}
    title={
      <>
        <div className="white">New to AI Safety?</div>
        <div className="teal-200">
          Something about <br />
          reading and quick
        </div>
      </>
    }
    action={questionUrl({pageid: '9OGZ'})}
    actionTitle={
      <>
        Start here
        <ArrowRight />
      </>
    }
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
  const article = {pageid: '9TDI', title: 'Not convinced? Explore the arguments.'}
  return (
    <ContentBox
      title="Explore the arguments"
      action={questionUrl(article)}
      actionTitle="Browse all arguments"
    >
      <ListTable
        elements={[
          {title: 'What are the main sources of AI existential risk?', pageid: '8503'},
          {
            title: 'Do people seriously worry about existential risk from AI?',
            pageid: '6953',
            className: 'desktop-only',
          },
          {title: 'Why would an AI do bad things?', pageid: '2400'},
        ]}
      />
    </ContentBox>
  )
}

export const ContentBoxThird = () => {
  const article = {pageid: '8TJV', title: 'Get involved with AI safety'}
  return (
    <ContentBox
      title="Get involved with AI safety"
      action={questionUrl(article)}
      actionTitle="Learn how"
      classNameTable={'content-box-table main'}
    >
      <SvgGroup />
    </ContentBox>
  )
}

export default ContentBox
