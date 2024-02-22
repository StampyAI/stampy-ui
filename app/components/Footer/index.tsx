import {FunctionComponent} from 'react'
import './footer.css'

const year = new Date().getFullYear()

const Link = ({to, title}: {to: string; title: string}) => (
  <div>
    <a href={to} target="_blank" rel="noreferrer">
      {title}
    </a>
  </div>
)

export const FooterBar: FunctionComponent = () => {
  return (
    <div className="footer" key="footer">
      <hr />
      <div className="footer-contents">
        <div className="col-5">
          <p className="large-bold teal-500">
            <a href="/">AISafety.info</a>
          </p>
          <div>
            We're a global team of volunteers from various disciplines who believe AI poses a grave
            risk of extinction to humanity.
          </div>
        </div>

        <div className="col-3 small">
          <p className="small-bold">Help out</p>
          <Link to="https://www.every.org/stampy?utm_campaign=donate-link#/donate" title="Donate" />
          <Link to="https://github.com/StampyAI/stampy-ui" title="Code" />
          <Link to="https://get_involved.aisafety.info/" title="Write" />
          <Link to="https://discord.com/invite/Bt8PaRTDQC" title="Join us on Discord" />
        </div>
        <div className="partners small col-4">
          <p className="small-bold">Partner projects</p>
          <Link to="https://www.aisafety.com/" title="AIsafety.com" />
          <Link to="https://alignment.dev/" title="Alignment Ecosystem Development" />
        </div>
      </div>
      <div className="xs grey text-align-center padding-bottom-16">
        <br />
        <Link
          to="https://coda.io/d/AI-Safety-Info-Dashboard_dfau7sl2hmG/Copyright_su79L#_luPMa"
          title={`© aisafety.info, 2022-${year}`}
        />
      </div>
    </div>
  )
}

export default FooterBar
