import {ReactNode} from 'react'
import Card from '~/components/Card'
import CardSmall from '~/components/CardSmall'
import {HelpPage, helpUrl} from '~/routesMapper'
import {Book} from '~/components/icons-generated'
import {People} from '~/components/icons-generated'
import {Briefcase} from '~/components/icons-generated'
import {Megaphone} from '~/components/icons-generated'
import {PiggyBank} from '~/components/icons-generated'
import {Hand} from '~/components/icons-generated'

const titles = {
  career: (
    <div>
      Multiply your impact:
      <br />
      Support your career pursuit
    </div>
  ),
  grassroots: (
    <div>
      Multiply your positive impact:
      <br />
      Support your advocacy efforts
    </div>
  ),
  donate: (
    <div>
      Multiply your postive impact:
      <br />
      Support your donation efforts
    </div>
  ),
  volunteer: (
    <div>
      Multiply your positive impact:
      <br />
      Support your volunteer efforts
    </div>
  ),
  knowledge: (
    <div>
      Boost your learning efforts:
      <br />
      Join a community
    </div>
  ),
  community: (
    <div>
      Boost your efforts:
      <br />
      Learn more about AI safety
    </div>
  ),
}

const knowledgeDescriptions = {
  donate: 'The more you know about this topic, the further your donation efforts will go',
}

const communityDescriptions = {
  donate:
    'Connecting with other advocates online or in person will help guide donation decisions, and can be motivating',
}

const KnowledgeCard = ({current}: {current?: HelpPage}) => {
  if (current == 'knowledge') return null
  const defaultDescription =
    'Learning more about AI safety and the alignment problem is essential if you want to pursue a career in this field'
  return (
    <Card
      action={helpUrl('knowledge')}
      title="Build your knowledge"
      description={
        knowledgeDescriptions[current as keyof typeof knowledgeDescriptions] || defaultDescription
      }
      icon={Book}
      className="col-6"
    />
  )
}

const CommunityCard = ({current}: {current?: string}) => {
  if (current === 'community') return null
  const defaultDescription =
    'Connecting with others online or in person will help you navigate the transition to a career in AI safety'
  return (
    <Card
      action={helpUrl('community')}
      title="Join a community"
      description={
        communityDescriptions[current as keyof typeof communityDescriptions] || defaultDescription
      }
      icon={People}
      className="col-6"
    />
  )
}

export type HelpMethodsProps = {
  current?: HelpPage
  footerTitle?: ReactNode
  footerSubheader?: ReactNode
}
const HelpMethods = ({
  current,
  footerTitle,
  footerSubheader = 'Or, explore more ways to help directly',
}: HelpMethodsProps) => (
  <div className="help-footer">
    <h2 className="teal-500 padding-bottom-56">{footerTitle || (current && titles[current])}</h2>
    <div className="flexbox padding-bottom-80">
      <KnowledgeCard current={current} />
      <CommunityCard current={current} />
    </div>
    <p className="large-bold padding-bottom-40">{footerSubheader}</p>
    <div className="flexbox">
      {current !== 'career' && (
        <CardSmall
          action={helpUrl('career')}
          title="Start a career in AI safety"
          description="For both technical and non-technical roles in research, policy, and field-building"
          icon={Briefcase}
          className="col-4"
        />
      )}
      {current !== 'donate' && (
        <CardSmall
          action={helpUrl('donate')}
          title="Donate"
          description="The AI safety field is constrained by funding—financial help is critical at this moment"
          icon={PiggyBank}
          className="col-4"
        />
      )}
      {current !== 'volunteer' && (
        <CardSmall
          action={helpUrl('volunteer')}
          title="Volunteer"
          description="Help us build important AI safety infrastructure—all skill sets and levels of time commitment are wanted"
          icon={Hand}
          className="col-4"
        />
      )}
      {current !== 'grassroots' && (
        <CardSmall
          action={helpUrl('grassroots')}
          title="Spread the word & grassroots activism"
          description="For anyone—help us spread the word about this issue"
          icon={Megaphone}
          className="col-4"
        />
      )}
    </div>
  </div>
)
export default HelpMethods
