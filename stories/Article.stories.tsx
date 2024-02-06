import type {Meta, StoryObj} from '@storybook/react'

import {Article} from '../app/components/ArticlesContent/Articles.tsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

const meta = {
  title: 'Components/Article',
  component: Article,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} satisfies Meta<typeof Article>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Introduction to AI safety',
    timeToRead: ' 2 min read',
    interactiveOptions: ['copy'],
    tags: ['AI', 'Safety', 'Research'],
    description: `"AI safety" refers to efforts to prevent artificial intelligence from causing harm. This site focuses on powerful future AI systems pursuing goals in conflict with human flourishing, because these systems may end up in control of the world and pose an existential risk to humanity.  AI safety is closely related to AI alignment, which refers to ensuring that AI systems pursue the goals we want them to.  "AI safety" is split into four main categories:`,
  },
}
