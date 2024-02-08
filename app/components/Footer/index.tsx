import {FunctionComponent} from 'react'
import './footer.css'

const year = new Date().getFullYear()

export const FooterBar: FunctionComponent = () => {
  return (
    <div className="footer" key="footer">
        <hr />
      <div className="footer-grid">
        <div>
          <p className="footer-brand">AISafety.info</p>
          <div className="footer-description">
            We're a global team of volunteers from various disciplines who believe AI poses an grave
            risk of extinction to humanity.
          </div>
        </div>

        <div className="help">
          <h5>Help out</h5>
          <a href="https://www.every.org/stampy?utm_campaign=donate-link#/donate">Donate</a>
          <a href="https://github.com/StampyAI/stampy-ui">Code</a>
          <a href="https://get_involved.aisafety.info/">Write</a>
          <a href="https://discord.com/invite/Bt8PaRTDQC">Join us on Discord</a>
        </div>
        <div className="partners">
          <h5>Partner projects</h5>
          <a href="https://www.aisafety.com/">AIsafety.com</a>
          <a href="https://alignment.dev/">Alignment Ecosystem Development</a>
        </div>
      </div>
      <div className="copyright">
        <a href="https://coda.io/d/AI-Safety-Info-Dashboard_dfau7sl2hmG/Copyright_su79L#_luPMa">
          © stampy.ai, 2022 - {year}
        </a>
      </div>
    </div>
  )
}

export default FooterBar
