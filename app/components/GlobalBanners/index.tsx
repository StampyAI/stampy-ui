import {ReactNode, useEffect, useState} from 'react'
import {ArrowRight, XLarge} from '~/components/icons-generated'
import Button from '~/components/Button'
import './global-banners.css'

type GlobalBannerProps = {
  bannerId: string
  title: string
  action: string
  actionLabel: ReactNode
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
        <Button action={action} className="primary-alt" size="small">
          {actionLabel}
        </Button>
        <button type="button" className="close" aria-label="Dismiss" onClick={hideBanner}>
          <XLarge fill="white" />
        </button>
      </div>
    )
  )
}

// Add an entry to show a site-wide banner. Its bannerId must be new, or returning
// visitors who dismissed an earlier banner never see it.
const banners: GlobalBannerProps[] = [
  {
    bannerId: 'call-congress-1',
    title: 'Live in the US? Call your representatives and ask for action on AI risks.',
    action: 'https://callcongress.ai/?utm_source=aisafetyinfo',
    actionLabel: (
      <>
        <span className="small-bold">callcongress.ai</span>
        <ArrowRight />
      </>
    ),
  },
]

const GlobalBanners = () => (
  <>
    {banners.map((banner) => (
      <GlobalBanner key={banner.bannerId} {...banner} />
    ))}
  </>
)
export default GlobalBanners
