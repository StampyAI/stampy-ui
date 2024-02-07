import {FunctionComponent} from 'react'
const year = new Date().getFullYear()
export const FooterBar: FunctionComponent = () => {
  return (
    <div className={'footer'} key={'footer'}>
      <div className={'footer-grid'}>
        <div>
          <p className={'footer-brand'}>AISafety.info</p>
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
        <a href="https://coda.io/d/AI-Safety-Info-Dashboard_dfau7sl2hmG/Copyright_su79L#_luPMa">
          © stampy.ai, 2022 - {year}
        </a>
      </div>
    </div>
  )
}
