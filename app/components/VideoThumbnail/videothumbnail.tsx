import React from 'react'
import PlayIcon from '~/components/icons-generated/Play'

interface VideoThumbnailProps {
  imageUrl: string
  altText: string
  tag?: string
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({imageUrl, altText, tag}) => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md">
      {tag && (
        <span className="absolute top-2 left-2 bg-teal-50 text-teal-500 px-2 py-1 rounded text-xs font-bold z-10">
          {tag}
        </span>
      )}
      <div className="relative">
        <img src={imageUrl} alt={altText} className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <PlayIcon className="text-white w-12 h-12" />
        </div>
      </div>
    </div>
  )
}

export default VideoThumbnail
