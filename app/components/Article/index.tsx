import {useState, useRef, useEffect} from 'react'
import {Link} from '@remix-run/react'
import KeepGoing from '~/components/Article/KeepGoing'
import ShareIcon from '~/components/icons-generated/Share'
import EditIcon from '~/components/icons-generated/Pencil'
import SocialCopy from '~/components/icons-generated/SocialCopy'
import SocialX from '~/components/icons-generated/SocialX'
import SocialFacebook from '~/components/icons-generated/SocialFacebook'
import SocialLinkedin from '~/components/icons-generated/SocialLinkedin'
import SocialReddit from '~/components/icons-generated/SocialReddit'
import SocialEmail from '~/components/icons-generated/SocialEmail'
import Button, {CompositeButton} from '~/components/Button'
import Feedback, {logFeedback} from '~/components/Feedback'
import {tagUrl} from '~/routesMapper'
import type {Glossary, Question, Banner as BannerType} from '~/server-utils/stampy'
import Contents from './Contents'
import './article.css'
import useIsMobile from '~/hooks/isMobile'

const isLoading = ({text}: Question) => !text || text === 'Loading...'

const ArticleFooter = (question: Question) => {
  const mobile = useIsMobile()

  const date =
    question.updatedAt &&
    new Date(question.updatedAt).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
    })

  return (
    !isLoading(question) && (
      <div className="footer-comtainer padding-bottom-40">
        <div className="edited-container">
          {date && <div className="grey"> {`Updated ${date}`}</div>}
          <CompositeButton secondary>
            <Button
              secondary
              action={question.answerEditLink || ''}
              tooltip="Google Doc"
              props={{target: '_blank', rel: 'noopener noreferrer'}}
            >
              <EditIcon />
            </Button>
          </CompositeButton>
        </div>
        <div className="feeback-container">
          {mobile && <p>Was this page helpful?</p>}
          <Feedback
            showForm
            pageid={question.pageid}
            onSubmit={async (message: string, option?: string) =>
              logFeedback({
                message,
                option,
                type: 'bot',
                question: question.title || '',
                answer: question.text || '',
              })
            }
            options={['Unclear', 'Too wordy', 'Confusing', 'Incorrect', 'Other']}
            upHint="This page was helpful"
            downHint="This page was unhelpful"
          />
        </div>
      </div>
    )
  )
}

type ShareOption = {
  label: string
  icon: React.ReactNode
  getShareUrl: (url: string, text: string) => string
}

const shareOptions: ShareOption[] = [
  {
    label: 'X',
    icon: <SocialX />,
    getShareUrl: (url: string, text: string) => `https://x.com/intent/tweet?url=${url}&text=${text}`,
  },
  {
    label: 'Facebook',
    icon: <SocialFacebook />,
    getShareUrl: (url: string, text: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    label: 'LinkedIn',
    icon: <SocialLinkedin />,
    getShareUrl: (url: string, text: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  },
  {
    label: 'Reddit',
    icon: <SocialReddit />,
    getShareUrl: (url: string, text: string) => `https://reddit.com/submit?url=${url}&title=${text}`,
  },
  {
    label: 'Email',
    icon: <SocialEmail />,
    getShareUrl: (url: string, text: string) => `mailto:?subject=${text}&body=${url}`,
  },
]

const ShareMenuItem = ({
  href,
  onClick,
  icon,
  label,
}: {
  href?: string
  onClick?: () => void
  icon: React.ReactNode
  label: string
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  const Element = onClick ? 'button' : 'a'
  const props = onClick
    ? {type: 'button' as const, onClick: handleClick}
    : {href, target: '_blank' as const, rel: 'noopener noreferrer'}

  return (
    <Element {...props} className="share-menu-item">
      <span className="share-menu-item-icon">{icon}</span>
      {label}
    </Element>
  )
}

const ArticleActions = ({answerEditLink, title}: Question) => {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy link')
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.toString())
    setCopyLabel('Copied!')
    setTimeout(() => {
      setCopyLabel('Copy link')
      setShowShareMenu(false)
    }, 1000)
  }

  const shareArticle = async () => {
    const url = window.location.toString()
    const shareData = {
      title: title || 'AI Safety Info',
      url: url,
    }

    // Check if Web Share API is supported and can be used
    // This is generally available on mobile, but not on desktop.
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled, do nothing
        if ((err as Error).name !== 'AbortError') {
          // If share fails, show dropdown menu
          setShowShareMenu(!showShareMenu)
        }
      }
    } else {
      // Show dropdown menu for desktop browsers
      setShowShareMenu(!showShareMenu)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  const url = encodeURIComponent(window.location.toString())
  const text = encodeURIComponent(title || 'AI Safety Info')

  return (
    <CompositeButton>
      <div style={{position: 'relative'}} ref={shareMenuRef}>
        <Button className="secondary" action={shareArticle} tooltip="Share this article">
          <ShareIcon />
        </Button>
        {showShareMenu && (
          <div className="share-dropdown">
            <ShareMenuItem onClick={copyLink} icon={<SocialCopy />} label={copyLabel} />
            {shareOptions.map((option) => (
              <ShareMenuItem
                key={option.label}
                href={option.getShareUrl(url, text)}
                icon={option.icon}
                label={option.label}
              />
            ))}
          </div>
        )}
      </div>
      <Button
        className="secondary"
        action={answerEditLink || ''}
        tooltip="Suggest changes in Google Docs"
        props={{target: '_blank', rel: 'noopener noreferrer'}}
      >
        <EditIcon className="no-fill" />
      </Button>
    </CompositeButton>
  )
}

export const ttr = (text: string, rate = 160) => {
  const time = text.split(' ')
  return Math.ceil(time.length / rate) // ceil to avoid "0 min read"
}

const ArticleMeta = ({question, className}: {question: Question; className?: string}) => {
  const {text} = question

  return (
    !isLoading(question) && (
      <div className={'article-meta ' + (className || '')}>
        <p className="grey large">{ttr(text || '')} min read</p>

        <ArticleActions {...question} />
      </div>
    )
  )
}

const Banner = ({title, text, icon, backgroundColour, textColour}: BannerType) => {
  return (
    <div
      key={title}
      className="banner rounded shadowed"
      style={{
        backgroundColor: backgroundColour || 'inherit',
        color: textColour || 'inherit',
      }}
    >
      <h3>
        {icon?.url?.includes('drive.google.com/file/d/') ? (
          <iframe src={icon.url.replace(/(\/view|\/preview)$/, '/preview')} allowFullScreen />
        ) : (
          <img src={icon?.url} alt={icon?.name} />
        )}
        <span className="title">{title}</span>
      </h3>
      <div
        className="banner-contents"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      ></div>
    </div>
  )
}

const Tags = ({tags}: Question) => (
  <div className="tags">
    {tags?.map((tag) => (
      <Link key={tag} className="tag bordered" to={tagUrl({name: tag})}>
        {tag}
      </Link>
    ))}
  </div>
)

type ArticleProps = {
  question: Question
  glossary?: Glossary
  className?: string
  showNext?: boolean
}
export const Article = ({question, glossary, className, showNext}: ArticleProps) => {
  const {title, text, pageid, carousels} = question
  // Create a seen set for glossary terms that will be shared across all Contents components
  const seenGlossaryTermsRef = useRef(new Set<string>())

  return (
    <article className={`${className} ${isLoading(question) ? 'loading' : ''}`}>
      <h1 className="teal-500 padding-bottom-24">{title}</h1>
      {question.banners?.filter((b) => b.title).map(Banner)}
      <ArticleMeta question={question} className="padding-bottom-56" />

      {text ? (
        <Contents
          className="padding-bottom-80"
          pageid={pageid}
          html={text}
          carousels={carousels}
          glossary={glossary || {}}
          seenGlossaryTermsRef={seenGlossaryTermsRef}
        />
      ) : (
        <div className="padding-bottom-32" />
      )}

      {showNext && <KeepGoing {...question} />}

      <ArticleFooter {...question} />
      <hr />

      <Tags {...question} />
    </article>
  )
}
export default Article
