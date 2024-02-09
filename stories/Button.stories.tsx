import type {Meta, StoryObj} from '@storybook/react'
import Button from '../app/components/Button'

const meta = {
  title: 'Components/Button',
  component: Button,

  tags: ['autodocs'],
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {},
}

export const Basic: Story = {
  args: {
    children: 'Button',
  },
}

export const BasicOnClick: Story = {
  args: {
    children: 'Click me',
    action: () => alert('hello'),
  },
}

export const Link: Story = {
  args: {
    children: 'Click me',
    action: 'https://xkcd.com/285/',
  },
}
