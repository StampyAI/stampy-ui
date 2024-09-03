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

const GlobalBanners = () => (
  <>
    <GlobalBanner
      bannerId="take-survey-1"
      title="Take AISafety.info’s 3 minute survey to help inform our strategy and priorities"
      action="https://docs.google.com/forms/d/e/1FAIpQLSebvqMAyb1vUoP7gIEAJHOZE4HtNp6oixJm3taVos0AfwrBKg/viewform"
      actionLabel="Take the survey"
    />
  </>
)
export default GlobalBanners
