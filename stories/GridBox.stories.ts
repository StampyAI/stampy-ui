import type {Meta, StoryObj} from '@storybook/react'
import {GridBox} from '../app/components/Grid/GridBox'

const meta = {
  title: 'Components/GridBox',
  component: GridBox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GridBox>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    title: 'Technical alignment research categories',
    description: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9769202bfb08a9b87ab3d7e55cff70586447e8f76a8c076fff6f0d4e8902c5da?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
    url: 'https://google.com',
  },
}
