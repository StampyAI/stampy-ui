import type { Meta, StoryObj } from "@storybook/react";
import { PageHeaderText } from "../app/components/PageHeaderText";

const meta = {
  title: "Components/PageHeaderText",
  component: PageHeaderText,
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeaderText>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    children: (
      <>
        <p>Educational content</p>
        <p>on all things AI Safety</p>
      </>
    ),
  },
};
