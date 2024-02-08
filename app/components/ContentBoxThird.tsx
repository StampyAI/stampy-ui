import {BottomEclipse} from '~/components/icons-generated'
import {GroupTopEcplise} from '~/components/icons-generated'

export const ContentBoxThird = () => {
  return (
    <div className="main-container-box-table bordered">
      <div className="content-box-description">
        <h2>
          <div>Get involved</div>
          <div>with AI safety</div>
        </h2>
        <a href="/8TJV" className="bordered content-box-table-button teal-500">
          Learn how
        </a>
      </div>
      <div className="content-box-table">
        <BottomEclipse className="eclipse-team-bottom" />
        <GroupTopEcplise className="eclipse-individual-top" />
      </div>
    </div>
  )
}
