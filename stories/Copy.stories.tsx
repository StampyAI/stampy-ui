import type { Meta, StoryObj } from "@storybook/react";
import { Copy } from "../app/components/ArticleInteractive/Options.tsx";
const meta = {
  title: "Components/Buttons/Copy",
  component: Copy,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Copy>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    onClick: () => {
      console.log("Copy clicked");
    },
  },
};
