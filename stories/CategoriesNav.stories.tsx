import type {Meta, StoryObj} from '@storybook/react'
import {CategoriesNav} from '../app/components/CategoriesNav/Menu'

const meta = {
  title: 'Components/CategoriesNav',
  component: CategoriesNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoriesNav>
export default meta
type Story = StoryObj<typeof CategoriesNav>
export const Default: Story = {
  args: {
    categories: [
      {
        name: 'Alignment',
        tagId: 0,
          rowId: '123',
          url: 'http://bla.bla',
          internal: false,
          mainQuestion: null,
        questions: [
          {
            title: 'What is instrumental convergence?',
            pageid: '0',
          },
        ],
      },
      {
        name: 'Contributing',
        tagId: 1,
          rowId: '123',
          url: 'http://bla.bla',
          internal: false,
        questions: [],
          mainQuestion: null,
      },
      {
        name: 'Definitions',
        tagId: 2,
          rowId: '123',
          url: 'http://bla.bla',
          internal: false,
        questions: [],
          mainQuestion: null,
      },
      {
        name: 'Lorem',
        tagId: 3,
          rowId: '123',
          url: 'http://bla.bla',
          internal: false,
        questions: [],
          mainQuestion: null,
      },
    ],
  },
}
