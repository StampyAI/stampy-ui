import type { Meta, StoryObj } from "@storybook/react";
import { ListTable } from "../app/components/Table/ListTable.tsx";

const meta = {
  title: "Components/ListTable",
  component: ListTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ListTable>;
export default meta;
type Story = StoryObj<typeof ListTable>;
export const Default: Story = {
  args: {
    Elements: {
      "What is AI alignment": "/what-is-ai-alignment",
      "What is this": "/what-is-this",
      "What is AI safety": "/what-is-ai-safety",
      "What is that": "/what-is-that",
      "What is the the orthogonality thesis":
        "/what-is-the-the-orthogonality-thesis",
      "What is something else": "/what-is-something-else",
    },
  },
};
