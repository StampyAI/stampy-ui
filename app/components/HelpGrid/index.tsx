import Card from '../Card'
import {Briefcase, Megaphone, PiggyBank, Hand, Book, People} from '../icons-generated'
import {helpUrl} from '~/routesMapper'

const helpItems = [
  {
    title: 'Start a career in AI Safety',
    description:
      'For both technical and non-technical roles in AI alignment, governance, and field-building',
    impact: 'Highest direct impact',
    icon: Briefcase,
    action: helpUrl('career'),
  },
  {
    title: 'Spread the word & grassroots activism',
    description: 'For anyone—help us spread the word about this issue',
    impact: 'Quickest & most accessible',
    icon: Megaphone,
    action: helpUrl('grassroots'),
  },
  {
    title: 'Donate',
    description:
      'The AI safety field is constrained by funding—financial help is critical at this moment',
    impact: 'Highest indirect impact',
    icon: PiggyBank,
    action: helpUrl('donate'),
  },
  {
    title: 'Volunteer',
    description:
      'Help us build important AI safety infrastructure—all skill sets and levels of time-commitment are wanted',
    impact: 'Best for partial commitment',
    icon: Hand,
    action: helpUrl('volunteer'),
  },
  {
    title: 'Build your knowledge',
    description:
      'Learning about AI safety equips you to effectively contribute to discussions and influence its development',
    impact: 'Enables impact',
    icon: Book,
    action: helpUrl('knowledge'),
  },
  {
    title: 'Join a community',
    description:
      'Joining a community is motivating, and will help guide your efforts to contribute and get involved',
    impact: 'Enables impact',
    icon: People,
    action: helpUrl('community'),
  },
]

export default function HelpGrid() {
  return (
    <div className="flexbox">
      {helpItems.map((item, index) => (
        <Card key={index} {...item} className="col-6" />
      ))}
    </div>
  )
}
