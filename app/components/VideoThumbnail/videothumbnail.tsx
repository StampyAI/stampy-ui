import React from 'react'
import PlayIcon from '~/components/icons-generated/Play'

interface VideoThumbnailProps {
  imageUrl: string
  altText: string
  tag?: string
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({imageUrl, altText, tag}) => {
  return (
    <div className="rounded">
      {tag && <span className="tag">{tag}</span>}
      <div>
        <img src={imageUrl} alt={altText} />
        <div>
          <PlayIcon />
        </div>
      </div>
    </div>
  )
}

export default VideoThumbnail
