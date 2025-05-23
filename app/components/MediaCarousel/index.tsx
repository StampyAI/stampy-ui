import {useState} from 'react'
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

  return (
    <div className="media-carousel-container padding-bottom-16">
      <div className="media-carousel-track">
        <Media item={items[currentIndex]} />
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
