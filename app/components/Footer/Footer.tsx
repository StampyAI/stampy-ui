import {FunctionComponent} from 'react'
import './footer.css'

export const Footer: FunctionComponent = () => {
  return (
    <div className={'footer'}>
      <div className={'footer-grid'}>
        <div>
          <p className={'footer-brand'}>AIsafety.com</p>
          <div className={'footer-description'}>
            We're a global team of volunteers from various disciplines who believe AI poses an grave
            risk of extinction to humanity.
          </div>
          <div className={'footer-learnMore'}>
            <div className={'footer-small'}>Learn more about us</div>
          </div>
        </div>

        <div>
          <div className={'footer-help'}>Help out</div>
          <div className={'footer-help-link'}>Donate</div>
          <div className={'footer-help-link'}>Code</div>
          <div className={'footer-help-link'}>Write</div>
          <div className={'footer-help-link'}>Join us on Discord</div>
        </div>
        <div>
          <div className={'footer-partners'}>Partner projects</div>
          <p className={'footer-logo'}>AIsafety.com</p>
          <p className={'footer-ecosystem'}>Alignment Ecosystem Development</p>
        </div>
      </div>
      <div className={'footer-copyright'}>
        (ɔ) 2023 · This site is released under a CC BY-SA license
      </div>
    </div>
  )
}
