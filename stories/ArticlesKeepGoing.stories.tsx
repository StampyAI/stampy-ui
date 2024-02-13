import type {Meta, StoryObj} from '@storybook/react'
import {ArticleKeepGoing} from '../app/components/ArticleKeepGoing'
import SvgArrowRight from '../app/components/icons-generated/ArrowRight'
import {ArticlesNav} from '~/components/ArticlesNav/Menu'

const meta = {
  title: 'Components/ArticleKeepGoing',
  component: ArticleKeepGoing,
  tags: ['autodocs'],
} satisfies Meta<typeof ArticleKeepGoing>
export default meta
type Story = StoryObj<typeof ArticleKeepGoing>

export const Primary: Story = {
  args: {
    category: 'AI alignment',
    articles: [
      {title: 'What is AI alignment', pageid: '1231', hasIcon: true},
      {title: 'What is this', pageid: '1232', hasIcon: true},
      {title: 'What is AI safety', pageid: '1233', hasIcon: true},
      {title: 'What is that', pageid: '1234', hasIcon: true},
      {title: 'What is the the orthogonality thesis', pageid: '1235', hasIcon: true},
      {title: 'What is something else', pageid: '1236', hasIcon: true},
    ],
    next: {
      title:
        'Are there any AI alignment projects which governments could usefully put a very large amount of resources into?',
      pageid: '1235',
      icon: <SvgArrowRight />,
    },
  },
}
