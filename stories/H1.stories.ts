import { Meta, StoryObj } from "@storybook/react";
import { H1 } from "../app/components/Typography/H1";
const meta = {
  title: "Components/Typography/H1",
  component: H1,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof H1>;
export default meta;
type Story = StoryObj<typeof H1>;
export const Primary: Story = {
  args: {
    children: "Hello World",
  },
};
