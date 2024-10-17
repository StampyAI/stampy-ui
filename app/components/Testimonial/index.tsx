import React from 'react'
import './testimonial.css'
import useIsMobile from '../../hooks/isMobile'

interface TestimonialProps {
  className?: string
  title: string
  description: string
  src: string
  layout?: 'expanded' | 'squeezed'
}

const Testimonial: React.FC<TestimonialProps> = ({
  className,
  title,
  description,
  src,
  layout = 'squeezed',
}) => {
  const isMobile = useIsMobile()
  const finalLayout = isMobile ? 'squeezed' : layout
  className = `testimonial ${finalLayout} ${className || ''}`

  return finalLayout === 'squeezed' ? (
    <div className={className}>
      <div className="padding-bottom-24 testimonial-header">
        <img width={80} height={80} className="rounded" src={src} alt="Testimonial's Face" />
        <p className="default-bold padding-left-24">{title}</p>
      </div>
      <p className="default grey">{description}</p>
    </div>
  ) : (
    <div className={className}>
      <div className="flex-container">
        <img width={151} height={151} className="rounded" src={src} alt="Testimonial's Face" />
        <div className="padding-left-40">
          <p className="large-bold padding-bottom-16">{title}</p>
          <p className="default grey">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default Testimonial
