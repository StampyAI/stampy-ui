import { Meta, StoryObj } from "@storybook/react";
import { Paragraph } from "../app/components/Typography/Paragraph";
const meta = {
  title: "Components/Paragraph",
  component: Paragraph,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Paragraph>;
export default meta;
type Story = StoryObj<typeof Paragraph>;
export const Primary: Story = {
  args: {
    children: "2min read",
  },
};
