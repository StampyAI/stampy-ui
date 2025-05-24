import {useState, useEffect} from 'react'
import './mediacarousel.css'
import {MediaItem} from '~/server-utils/parsing-utils'
import {Navigation} from '../CategoryCarousel'

const Media = ({item}: {item: MediaItem}) => {
  switch (item.type) {
    case 'youtube':
      return (
        <iframe
          src={item.url}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          width="100%"
          height="315"
        />
      )
    case 'image':
      return <img src={item.url} alt={item.title || ''} />
    case 'iframe':
      return (
        <iframe
          src={item.url}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )
    default:
      return null
  }
}

type MediaCarouselProps = {
  items: MediaItem[]
}

const MediaCarousel = ({items}: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Helper to get adjacent indices
  const getAdjacentIndices = (index: number) => {
    const prev = index - 1 < 0 ? items.length - 1 : index - 1
    const next = index + 1 >= items.length ? 0 : index + 1
    return [prev, index, next]
  }

  // Preload adjacent images
  useEffect(() => {
    const adjacentIndices = getAdjacentIndices(currentIndex)

    adjacentIndices.forEach((index) => {
      const item = items[index]
      if (item.type === 'image') {
        const img = new Image()
        img.src = item.url
      }
    })
  }, [currentIndex, items])

  const adjacentIndices = new Set(getAdjacentIndices(currentIndex))

  return (
    <div className="media-carousel-container padding-bottom-32">
      <div className="media-carousel-track">
        {/* Render current and adjacent items but only show current */}
        {items.map((item, index) => {
          const isAdjacent = adjacentIndices.has(index)

          return (
            <div
              key={index}
              style={{
                display: index === currentIndex ? 'block' : 'none',
                position: index === currentIndex ? 'relative' : 'absolute',
              }}
            >
              {isAdjacent && <Media item={item} />}
            </div>
          )
        })}
      </div>
      {items[currentIndex].title && (
        <div className="media-carousel-title small grey">{items[currentIndex].title}</div>
      )}
      {items.length > 1 && (
        <div className="media-carousel-navigation">
          <Navigation
            leftAction={() => setCurrentIndex((i) => (i <= 0 ? items.length - 1 : i - 1))}
            rightAction={() => setCurrentIndex((i) => (i >= items.length - 1 ? 0 : i + 1))}
            large
          >
            <div className="media-carousel-index-indicator small grey">
              {currentIndex + 1}/{items.length}
            </div>
          </Navigation>
        </div>
      )}
    </div>
  )
}

export default MediaCarousel
