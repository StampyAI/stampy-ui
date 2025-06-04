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
        <div className="teal-200">Wait,</div>
        <div className="white">AI will do what?</div>
      </>
    }
    action={questionUrl({pageid: 'NM3T'})}
    actionTitle={
      <>
        <span className="default-bold">Click here</span>
        <ArrowRight />
      </>
    }
  >
    <BookCircle className="desktop-only" />
    <IntroMobile className="mobile-only" />
  </ContentBox>
)

export const ContentBoxSecond = () => {
  const articleTitle = 'I need more arguments'
  const article = {pageid: 'NM3Q', title: articleTitle}
  return (
    <ContentBox title={articleTitle} action={questionUrl(article)} actionTitle="Click here">
      <ListTable
        sameTab
        elements={[
          {title: 'AI is advancing fast', pageid: 'NM37'},
          {title: 'AI may pursue goals', pageid: 'NM3J', className: 'desktop-only'},
          {title: 'AI can win a conflict against us', pageid: 'NM3O', className: 'desktop-only'},
          {title: 'Experts are highly concerned', pageid: 'NM3D'},
        ]}
      />
    </ContentBox>
  )
}

export const ContentBoxThird = () => {
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
