import type { Meta, StoryObj } from "@storybook/react";

import { MenuItem } from "../app/components/Menu/MenuItem";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/MenuItem",
  component: MenuItem,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    link: "#",
    text: "Link",
    icon: "",
    primary: true,
  },
};
export const Secondary: Story = {
  args: {
    link: "#",
    text: "Link",
    icon: "",
    primary: false,
  },
};
export const WithIcon: Story = {
  args: {
    link: "#",
    text: "Link",
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3a6d92c1038a2e95b3f9371f120e22f78d20f757ed372832f0daa5df5d632a4b?apiKey=f1073757e44b4ccd8d59791af6c41a77&",
    primary: false,
  },
};
