import type { Meta, StoryObj } from "@storybook/react";
import { ContentBoxTable } from "../app/components/ContentBoxTable/BoxWithTable.tsx";

const meta = {
  title: "Components/ContentBoxTable",
  component: ContentBoxTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContentBoxTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    Elements: {
      "What are the main sources of AI existential risk?":
        "/what-are-the-main-sources-of-ai-existential-risk",
      "Do people seriously worry about existential risk from AI?":
        "/do-people-seriously-worry-about-existential-risk-from-ai",
      "Why would an AI do bad things?": "/why-would-an-ai-do-bad-things",
    },
  },
};
