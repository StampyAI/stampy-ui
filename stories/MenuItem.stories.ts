import type {Meta, StoryObj} from '@storybook/react'

import {MenuItem} from '../app/components/Menu'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/MenuItem',
  component: MenuItem,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof MenuItem>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    link: '#',
    text: 'Link',
    icon: '',
    primary: true,
  },
}
export const Secondary: Story = {
  args: {
    link: '#',
    text: 'Link',
    icon: '',
    primary: false,
  },
}
export const WithIcon: Story = {
  args: {
    link: '#',
    text: 'Link',
    icon: '/assets/book-circle.svg',
    primary: false,
  },
}
