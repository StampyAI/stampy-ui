import type {Meta, StoryObj} from '@storybook/react'
import KeepGoing from '../app/components/Article/KeepGoing'
import {CachedObjectsContext} from '../app/hooks/useCachedObjects'
import type {TOCItem} from '../app/routes/questions.toc'
import type {Question} from '../app/server-utils/stampy'

const toc = [
  {
    title: 'New to AI safety? Start here.',
    pageid: '9OGZ',
    hasText: true,
    category: 'Your momma',
    children: [
      {
        title: 'What would an AGI be able to do?',
        pageid: 'NH51',
        hasText: false,
      },
      {
        title: 'Types of AI',
        pageid: 'NH50',
        hasText: false,
        children: [
          {
            title:
              'What are the differences between AGI, transformative AI, and superintelligence?',
            pageid: '5864',
            hasText: true,
          },
          {
            title: 'What is intelligence?',
            pageid: '6315',
            hasText: true,
          },
        ],
      },
      {
        title: 'Introduction to ML',
        pageid: 'NH50',
        hasText: false,
        children: [
          {
            title: 'What are large language models?',
            pageid: '8161',
            hasText: true,
          },
          {
            title: 'What is compute?',
            pageid: '9358',
            hasText: true,
          },
        ],
      },
    ],
  },
  {
    title: 'This is a different section',
    pageid: '9876',
    hasText: true,
    category: 'Your momma',
    children: [
      {
        title: 'Bla bla bla',
        pageid: 'NH72',
        hasText: false,
      },
    ],
  },
] as any[] as TOCItem[]

const relatedQuestions = [
  {pageid: '1412', title: 'something or other'},
  {pageid: 'NH72', title: 'From a different section'},
  {pageid: '0987', title: 'This one doesnt have a section'},
  {pageid: '1236', title: 'What time is it?'},
]

const withMockedToC = (StoryFn: any) => {
  return (
    <CachedObjectsContext.Provider
      value={{toc: {items: toc}, glossary: {items: undefined}, tags: {items: undefined}}}
    >
      <StoryFn />
    </CachedObjectsContext.Provider>
  )
}

const meta = {
  title: 'Components/Article/KeepGoing',
  component: KeepGoing,
  tags: ['autodocs'],
  decorators: [withMockedToC],
} satisfies Meta<typeof KeepGoing>
export default meta
type Story = StoryObj<typeof KeepGoing>

export const Default: Story = {
  args: {
    pageid: 'NH50',
    relatedQuestions,
  } as any as Question,
}

export const FirstArticle: Story = {
  args: {
    pageid: '9OGZ',
    relatedQuestions,
  } as any as Question,
}

export const NoMore: Story = {
  args: {
    pageid: '123',
    relatedQuestions: [],
  } as any as Question,
}

export const OnlyRelated: Story = {
  args: {
    pageid: '123',
    relatedQuestions,
  } as any as Question,
}

export const OnlyNext: Story = {
  args: {
    pageid: 'NH50',
    relatedQuestions: [],
  } as any as Question,
}
