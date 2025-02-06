import {useEffect, useRef, useState} from 'react'
import useToC from '~/hooks/useToC'
import {PageId} from '~/server-utils/stampy'
import Button from '~/components/Button'
import {ArrowRight} from '~/components/icons-generated'
import {questionUrl} from '~/routesMapper'
import './category-carousel.css'

const PER_BOX = 320

type CategoryCarouselProps = {
  title: React.ReactNode
  category: PageId
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

const CategoryCarousel = ({title, category}: CategoryCarouselProps) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [offset, setOffset] = useState(0)
  const {getArticle} = useToC()

  useEffect(() => {
    const updateWidth = () => {
      if (componentRef.current) {
        const {width} = componentRef.current.getBoundingClientRect()
        console.log(width, Math.round(width / PER_BOX))
        setShown(Math.floor(width / PER_BOX))
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const section = getArticle(category)
  return (
    <div className="carousel rounded" ref={componentRef}>
      <div className="carousel-header">
        <h2>{title}</h2>
        <Navigation
          leftAction={() => setOffset((i) => Math.min(i - shown, section?.children?.length || 0))}
          rightAction={() => setOffset((i) => Math.max(i + shown, 0))}
          leftDisabled={offset === 0}
          rightDisabled={!section?.children?.length || offset + shown >= section.children.length}
        />
      </div>
      <div className="flex-container items">
        {section?.children?.slice(offset, offset + shown).map((child) => (
          <Button key={child.pageid} className="carousel-item" action={questionUrl(child)}>
            <p className="default-bold teal-500">{child.title}</p>
            <p className="small grey">{child.ttr || 1} min read</p>
          </Button>
        ))}
      </div>
    </div>
  )
}
export default CategoryCarousel
