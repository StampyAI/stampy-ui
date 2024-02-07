import './box.css'
import {EclipseIndividualIcon} from '~/assets/EclipseIndividual'
import {EclipseTeamIcon} from '~/assets/EclipseTeam'

export const ContentBoxGetInvolved = () => {
  return (
    <div className={'main-container-box-table'}>
      <div className={'content-box-description'}>
        <p>Get involved with AI safety</p>
        <div className={'content-box-table-button'}>
          <span>Learn how</span>
        </div>
      </div>
      <div className={'content-box-table'}>
        <EclipseTeamIcon classname={'eclipse-team-bottom'} />
        <EclipseIndividualIcon classname={'eclipse-individual-top'} />
      </div>
    </div>
  )
}
