import {BottomEclipse} from '~/components/icons-generated'
import {GroupTopEcplise} from '~/components/icons-generated'

export const ContentBoxThird = () => {
  return (
    <div className="main-container-box-table bordered">
      <div className="content-box-description">
        <p>
          Get involved <br /> with AI safety
        </p>
          <a href="/8TJV" className="unstyled teal">
              <div className="content-box-table-button">
                  Learn how
              </div>
          </a>
      </div>
      <div className="content-box-table">
        <GroupTopEcplise className="eclipse-individual-top" />
        <BottomEclipse className="eclipse-team-bottom" />
      </div>
    </div>
  )
}
