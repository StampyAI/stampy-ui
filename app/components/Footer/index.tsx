import {FunctionComponent} from 'react'
import './footer.css'
const year = new Date().getFullYear()

const Link = ({to, title, className}: {to: string; title: string; className?: string}) => (
  <div className={className}>
    <a href={to} target="_blank" rel="noreferrer">
      {title}
    </a>
  </div>
)

export const FooterBar: FunctionComponent = () => {
  return (
    <div className="padding-top-104">
      <hr />
      <div className="page-body" key="footer">
        <div className="flexbox padding-bottom-80 padding-top-104">
          <div className="col-5">
            <p className="large-bold teal-500 padding-bottom-16">
              <a href="/">AISafety.info</a>
            </p>
            <div>
              We’re a global team of specialists and volunteers from various backgrounds who want to
              ensure that the effects of future AI are beneficial rather than catastrophic.
            </div>
          </div>

          <div className="col-3 small">
            <p className="small-bold padding-bottom-16">Get involved</p>
            <Link
              to="https://www.every.org/stampy?utm_campaign=donate-link#/donate"
              title="Donate"
              className="padding-bottom-8"
            />
            <Link
              to="https://github.com/StampyAI/stampy-ui"
              title="Code"
              className="padding-bottom-8"
            />
            <Link
              to="https://get_involved.aisafety.info/"
              title="Write"
              className="padding-bottom-8"
            />
            <Link to="https://discord.gg/88TbjZnNyA" title="Join us on Discord" />
          </div>
          <div className="partners small col-4">
            <p className="small-bold padding-bottom-16">Partner projects</p>
            <Link
              to="https://www.aisafety.com/"
              title="AISafety.com"
              className="padding-bottom-8"
            />
            <Link
              to="https://alignment.dev/"
              title="Alignment Ecosystem Development"
              className="padding-bottom-8"
            />
          </div>
        </div>
        <div className="xs grey text-align-center padding-bottom-16">
          <br />
          <Link
            to="https://coda.io/d/AI-Safety-Info-Dashboard_dfau7sl2hmG/Copyright_su79L#_luPMa"
            title={`© AISafety.info, 2022—${year}`}
          />
          <Link
            to="https://aisafety.info/questions/NLZQ/What-is-this-site-about"
            title={`About us`}
          />
          <p>
            Aisafety.info is an <a href="https://www.ashgro.org/">Ashgro Inc</a> Project. Ashgro Inc
            (EIN: 88-4232889) is a 501(c)(3) Public Charity incorporated in Delaware.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FooterBar
