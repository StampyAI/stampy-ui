import Card from '~/components/Card'
import CardSmall from '~/components/CardSmall'
import {HelpPage, helpUrl} from '~/routesMapper'
import {PuzzlePieces} from '~/components/icons-generated'

type HelpMethodsProps = {
  current?: HelpPage
  header?: string
  subheader?: string
}
const HelpMethods = ({
  current,
  header = 'Multiply your impact: Support your career pursuit',
  subheader = 'Or, explore more ways to help directly',
}: HelpMethodsProps) => (
  <div className="help-footer">
    <h2 className="teal-500 padding-bottom-56">{header}</h2>
    <div className="flexbox padding-bottom-80">
      {current !== 'knowledge' && (
        <Card
          action={helpUrl('knowledge')}
          title="Build your knowledge"
          description="Learning more about AI safety and the alignment problem is essential if you want to pursue a career in this field"
          icon={PuzzlePieces}
          impact="We'll show you how"
          className='col-6'
        />
      )}
      {current !== 'community' && (
        <Card
          action={helpUrl('community')}
          title="Join a community"
          description="Connecting with others online or in person will help you navigate the transition to a career in AI safety"
          icon={PuzzlePieces}
          impact="Find your community"
          className='col-6'
        />
      )}
    </div>
    <p className="large-bold padding-bottom-40">{subheader}</p>
    <div className="flexbox">
      {current !== 'career' && (
        <CardSmall
          action={helpUrl('career')}
          title="Start a career in AI Safety"
          description="For both technical and non-technical roles in research, policy, and field-building"
          icon={PuzzlePieces}
          className='col-4'
        />
      )}
      {current !== 'donate' && (
        <CardSmall
          action={helpUrl('donate')}
          title="Donate"
          description="The AI safety field is constrained by funding—financial help is critical at this moment"
          icon={PuzzlePieces}
          className='col-4'
        />
      )}
      {current !== 'volunteer' && (
        <CardSmall
          action={helpUrl('volunteer')}
          title="Volunteer"
          description="Help us build important AI safety infrastructure—all skill sets and levels of time—commitment are wanted"
          icon={PuzzlePieces}
          className='col-4'
        />
      )}
      {current !== 'grassroots' && (
        <CardSmall
          action={helpUrl('grassroots')}
          title="Spread the word & grassroots activism"
          description="For anyone—help us spread the word about this issue"
          icon={PuzzlePieces}
          className='col-4'
        />
      )}
    </div>
  </div>
)
export default HelpMethods
