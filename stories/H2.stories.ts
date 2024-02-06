import { Meta, StoryObj } from "@storybook/react";
import { H2 } from "../app/components/Typography/H2";
const meta = {
  title: "Components/Typography/H2",
  component: H2,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof H2>;
export default meta;
type Story = StoryObj<typeof H2>;
export const Primary: Story = {
  args: {
    children: "Hello World",
  },
};
