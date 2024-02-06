import type { Meta, StoryObj } from "@storybook/react";
import { CategoriesNav } from "../app/components/CategoriesNav/Menu.tsx";

const meta = {
  title: "Components/CategoriesNav",
  component: CategoriesNav,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CategoriesNav>;
export default meta;
type Story = StoryObj<typeof CategoriesNav>;
export const Default: Story = {
  args: {
    categories: [
      {
        name: "Alignment",
        id: 0,
        questions: [
            {
                title: "What is instrumental convergence?",
                pageId: 0,
            },
            ],
      },
      {
        name: "Contributing",
        id: 1,
        questions: []
      },
      {
        name: "Definitions",
        id: 2,
        questions: []
      },
      {
        name: "Lorem",
        id: 3,
        questions: []
      },
    ],
  },
};
