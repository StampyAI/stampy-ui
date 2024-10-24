import type {Meta, StoryObj} from '@storybook/react'
import {SearchResults} from '../app/components/SearchResults/Dropdown'

const meta = {
  title: 'Components/SearchResults',
  component: SearchResults,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchResults>
export default meta
type Story = StoryObj<typeof SearchResults>
export const Default: Story = {
  args: {
    results: [
      {
        title: 'What is instrumental convergence?',
        description:
          'Instrumental convergence is the idea that as an AI becomes more intelligent and capable, it will converge on certain instrumental goals, such as self-preservation and resource acquisition.',
        url: '/what-is-instrumental-convergence',
        source: 'From Introduction to AI safety',
      },
      {
        title: "A post that doesn't have the keyword in the title",
        description:
          'Ideally this post would show the first excerpt of where the word instrumental convergence was used, but only do this..',
        url: 'http://bla.bom',
      },
    ],
  },
}
export const NoResults: Story = {
  args: {
    results: [],
  },
}
