import {useEffect, useRef, useState} from 'react'
import useToC from '~/hooks/useToC'
import {PageId} from '~/server-utils/stampy'
import Button from '~/components/Button'
import {ArrowRight} from '~/components/icons-generated'
import {questionUrl} from '~/routesMapper'
import './category-carousel.css'

const PER_BOX = 320

const CategoryCarousel = ({title, category}: {title: string; category: PageId}) => {
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
        <div className="navigation">
          <Button
            action={() => setOffset((i) => Math.min(i - shown, section?.children?.length || 0))}
            disabled={offset === 0}
          >
            <ArrowRight style={{transform: 'rotate(180deg)'}} />
          </Button>
          <Button
            action={() => setOffset((i) => Math.max(i + shown, 0))}
            disabled={!section?.children?.length || offset + shown >= section?.children?.length}
          >
            <ArrowRight />
          </Button>
        </div>
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
