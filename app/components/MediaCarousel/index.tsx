import {useState} from 'react'
import './mediacarousel.css'
import {MediaItem} from '~/server-utils/parsing-utils'
import {Navigation} from '../CategoryCarousel'

type MediaCarouselProps = {
  items: MediaItem[]
}

const MediaCarousel = ({items}: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const renderMedia = (item: MediaItem) => {
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
        return <iframe src={item.url} />
      default:
        return null
    }
  }

  return (
    <div className="media-carousel-container padding-bottom-32">
      <div className="media-carousel-track">{renderMedia(items[currentIndex])}</div>
      {items.length > 1 && (
        <div className="media-carousel-navigation">
          <Navigation
            leftAction={() => setCurrentIndex((i) => i - 1)}
            rightAction={() => setCurrentIndex((i) => i + 1)}
            rightDisabled={currentIndex === items.length - 1}
            leftDisabled={currentIndex === 0}
            large
          />
        </div>
      )}
    </div>
  )
}

export default MediaCarousel
