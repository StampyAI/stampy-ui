import type {Meta, StoryObj} from '@storybook/react'
import {ArticlesNav} from '../app/components/ArticlesNav/ArticleNav'

const meta = {
  title: 'Components/ArticlesNav',
  component: ArticlesNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArticlesNav>
export default meta
type Story = StoryObj<typeof ArticlesNav>

const article = {
  title: 'New to AI safety? Start here.',
  subtitle: 'Basic information about all of this',
  pageid: '9OGZ',
  ttr: 2,
  icon: '/assets/coded-banner.svg',
  hasText: true,
  order: 0,
  children: [
    {
      title: 'What would an AGI be able to do?',
      pageid: 'NH51',
      hasText: false,
      ttr: 1,
      order: 0,
    },
    {
      title: 'Types of AI',
      pageid: 'NH50',
      hasText: false,
      ttr: 1,
      order: 0,
      children: [
        {
          title: 'What are the differences between AGI, transformative AI, and superintelligence?',
          pageid: '5864',
          hasText: true,
          ttr: 1,
          order: 0,
        },
        {
          title: 'What is intelligence?',
          pageid: '6315',
          hasText: true,
          ttr: 1,
          order: 0,
        },
        {
          title: 'What is artificial general intelligence (AGI)?',
          pageid: '2374',
          ttr: 1,
          hasText: true,
          order: 0,
        },
        {
          title: 'What is "superintelligence"?',
          pageid: '6207',
          hasText: true,
          ttr: 1,
          order: 0,
        },
        {
          title: 'What is artificial intelligence (AI)?',
          pageid: '8G1H',
          hasText: true,
          ttr: 1,
          order: 0,
        },
      ],
    },
    {
      title: 'Introduction to ML',
      pageid: 'NH50',
      hasText: false,
      ttr: 1,
      order: 0,
      children: [
        {
          title: 'What are large language models?',
          pageid: '8161',
          hasText: true,
          ttr: 1,
          order: 0,
        },
        {
          title: 'What is compute?',
          pageid: '9358',
          hasText: true,
          ttr: 1,
          order: 0,
        },
      ],
    },
    {
      title: 'Introduction to AI Safety',
      pageid: 'NH53',
      hasText: false,
      ttr: 1,
      order: 0,
      children: [
        {
          title: 'Why would an AI do bad things?',
          pageid: '2400',
          hasText: true,
          ttr: 1,
          order: 0,
        },
        {
          title: 'How likely is extinction from superintelligent AI?',
          pageid: '7715',
          hasText: true,
          ttr: 1,
          order: 0,
        },
        {
          title: 'What is AI safety?',
          pageid: '8486',
          hasText: true,
          ttr: 1,
          order: 0,
        },
        {
          title: 'Why is safety important for smarter-than-human AI?',
          pageid: '6297',
          hasText: true,
          ttr: 1,
          order: 0,
        },
      ],
    },
  ],
}

export const Default: Story = {
  args: {
    path: ['90GZ', 'NH51'],
    article,
  },
}

export const TopSelected: Story = {
  args: {
    path: ['9OGZ'],
    article,
  },
}

export const ChildSelected: Story = {
  args: {
    path: ['9OGZ', 'NH53', '8486'],
    article,
  },
}
