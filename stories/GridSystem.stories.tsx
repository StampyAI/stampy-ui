import type {Meta, StoryObj} from '@storybook/react'
import {GridSystem} from '../app/components/Grid/GridSystem'

const meta = {
  title: 'Components/GridSystem',
  component: GridSystem,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GridSystem>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    GridBoxes: [
      {
        title: 'Technical alignment research categories',
        subtitle: 'Lorem ipsum dolor sit amet consectetur',
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9769202bfb08a9b87ab3d7e55cff70586447e8f76a8c076fff6f0d4e8902c5da?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
        pageid: 'https://google.com',
        hasText: true,
      },
      {
        title: 'Governance',
        subtitle: 'Lorem ipsum dolor sit amet consectetur',
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7b7d22b33dd958b157082b2ca8a77eef6ad552d10764d38f8035285bc1f7be11?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
        pageid: 'https://google.com',
        hasText: true,
      },
      {
        title: 'Existential risk concepts',
        subtitle: 'Lorem ipsum dolor sit amet consectetur',
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/11cfe00a2459aad8521abe570fe704c47a982a1d7686ea916cc318010eaa7a32?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
        pageid: 'https://google.com',
        hasText: true,
      },
      {
        title: 'Predictions on advanced AI',
        subtitle: 'Lorem ipsum dolor sit amet consectetur',
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/fd10e7106c3d8988b4046afc200b9224122ac8051c52aae1ce0debcf3f04f3cd?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
        pageid: 'https://google.com',
        hasText: true,
      },
      {
        title: 'Prominent research organizations',
        subtitle: 'Lorem ipsum dolor sit amet consectetur',
        icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/0de85958d44d9176c2dd4eb584ec22c23e7200150932ebc110a86bdf52f595d9?apiKey=f1073757e44b4ccd8d59791af6c41a77&',
        pageid: 'https://google.com',
        hasText: true,
      },
    ],
  },
}
