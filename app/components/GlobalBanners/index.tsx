import {useEffect, useState} from 'react'
import XLarge from '~/components/icons-generated/XLarge'
import Button from '~/components/Button'
import './global-banners.css'

type GlobalBannerProps = {
  bannerId: string
  title: string
  action?: string
  actionLabel?: string
}
const GlobalBanner = ({bannerId, title, action, actionLabel}: GlobalBannerProps) => {
  const [showBanner, setShowBanner] = useState(false)
  const hideBanner = () => {
    localStorage.setItem(bannerId, 'hide')
    setShowBanner(false)
  }

  useEffect(() => {
    setShowBanner(localStorage?.getItem(bannerId) !== 'hide')
  }, [bannerId])

  return (
    showBanner && (
      <div className="global-banner white">
        <p className="small">{title}</p>
        {action && (
          <Button
            action={action}
            className="secondary-alt small-bold"
            size="small"
            props={{target: '_blank', rel: 'noopener noreferrer'}}
          >
            {actionLabel}
          </Button>
        )}
        <XLarge fill="white" className="close" onClick={hideBanner} />
      </div>
    )
  )
}

// Site-wide banners shown at the top of every page. Add an entry here to show one;
// each needs a unique bannerId so a visitor's dismissal is remembered.
// (The 2024 "Take AISafety.info's 3 minute survey" banner was removed in September 2026
// after Google took the form down.)
const banners: GlobalBannerProps[] = []

const GlobalBanners = () => (
  <>
    {banners.map((banner) => (
      <GlobalBanner key={banner.bannerId} {...banner} />
    ))}
  </>
)
export default GlobalBanners
