import {ReactNode} from 'react'
import {ArrowRight} from '~/components/icons-generated'
import ListTable from '~/components/Table'
import Button from '~/components/Button'
import BookCircle from '~/components/icons-generated/BookCircle'
import SvgGroup from '~/components/icons-generated/Group'
import IntroMobile from '~/components/icons-generated/IntroMobile'
import GetInvolvedMobile from '~/components/icons-generated/GetInvolvedMobile'
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
        <Button action={action} className="primary-alt" size="large">
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
        <div className="white">New to AI safety?</div>
        <div className="teal-200">Jump into the basics.</div>
      </>
    }
    action={questionUrl({pageid: '9OGZ'})}
    actionTitle={
      <>
        <span className="default-bold">Start here</span>
        <ArrowRight />
      </>
    }
  >
    <BookCircle className="desktop-only" />
    <IntroMobile className="mobile-only" />
  </ContentBox>
)

export const ContentBoxSecond = () => {
  const article = {pageid: '9TDI', title: 'Objections and responses'}
  return (
    <ContentBox
      title="Objections and responses"
      action={questionUrl(article)}
      actionTitle="Explore the debate"
    >
      <ListTable
        sameTab
        elements={[
          {
            title: 'Why can’t we just turn the AI off if it starts to misbehave?',
            pageid: '5611',
            className: 'desktop-only',
          },
          {title: 'Isn’t the real concern technological unemployment?', pageid: '6412'},
          {title: 'Will AI be able to think faster than humans?', pageid: '8E41'},
        ]}
      />
    </ContentBox>
  )
}

export const ContentBoxThird = () => {
  const article = {pageid: '8TJV', title: 'Get involved with AI safety'}
  return (
    <ContentBox
      title="Want to help with AI safety?"
      action={'how-can-i-help'}
      actionTitle="Get involved"
      classNameTable="content-box-table main"
    >
      <SvgGroup className="desktop-only" />
      <GetInvolvedMobile className="mobile-only full-width" />
    </ContentBox>
  )
}

export default ContentBox
