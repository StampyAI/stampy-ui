import type {Meta, StoryObj} from '@storybook/react'
import {FooterBar} from '../app/components/Footer'

const meta = {
  title: 'Components/Footer',
  component: FooterBar,

  tags: ['autodocs'],
} satisfies Meta<typeof FooterBar>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
