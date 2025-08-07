import {useEffect, useRef, useState} from 'react'
import useToC from '~/hooks/useToC'
import {PageId} from '~/server-utils/stampy'
import Button from '~/components/Button'
import {ArrowRight} from '~/components/icons-generated'
import {questionUrl} from '~/routesMapper'
import './article-carousel.css'

const PER_BOX = 320

type ArticleCarouselProps = {
  title: React.ReactNode
  articles: readonly PageId[]
}

export const Navigation = ({
  leftAction,
  rightAction,
  leftDisabled = false,
  rightDisabled = false,
  large = false,
  children,
}: {
  leftAction: () => void
  rightAction: () => void
  leftDisabled?: boolean
  rightDisabled?: boolean
  large?: boolean
  children?: React.ReactNode
}) => {
  return (
    <div className="carousel-navigation">
      <Button action={leftAction} disabled={leftDisabled} className={large ? 'nav-large' : ''}>
        <ArrowRight style={{transform: 'rotate(180deg)'}} />
      </Button>
      {children}
      <Button action={rightAction} disabled={rightDisabled} className={large ? 'nav-large' : ''}>
        <ArrowRight />
      </Button>
    </div>
  )
}

const ArticleCarousel = ({title, articles}: ArticleCarouselProps) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [offset, setOffset] = useState(0)
  const {getArticle} = useToC()

  useEffect(() => {
    const updateWidth = () => {
      if (componentRef.current) {
        const {width} = componentRef.current.getBoundingClientRect()
        setShown(Math.floor(width / PER_BOX))
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const articleData = articles.map((id) => getArticle(id)).filter(Boolean)

  return (
    <div className="carousel rounded" ref={componentRef}>
      <div className="carousel-header">
        <h2>{title}</h2>
        <Navigation
          leftAction={() => setOffset((i) => Math.max(i - shown, 0))}
          rightAction={() => setOffset((i) => Math.min(i + shown, articleData.length))}
          leftDisabled={offset === 0}
          rightDisabled={offset + shown >= articleData.length}
        />
      </div>
      <div className="flex-container items">
        {articleData.slice(offset, offset + shown).map((article) =>
          article ? (
            <Button key={article.pageid} className="carousel-item" action={questionUrl(article)}>
              <p className="default-bold teal-500">{article.title}</p>
              <p className="small grey">{article.ttr || 1} min read</p>
            </Button>
          ) : null
        )}
      </div>
    </div>
  )
}
export default ArticleCarousel
