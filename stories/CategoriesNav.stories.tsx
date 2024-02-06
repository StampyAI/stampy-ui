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
        title: "Alignment",
        id: 0,
      },
      {
        title: "Contributing",
        id: 1,
      },
      {
        title: "Definitions",
        id: 2,
      },
      {
        title: "Lorem",
        id: 3,
      },
      {
        title: "Lorem",
        id: 5,
      },
      {
        title: "Lorem",
        id: 6,
      },
      {
        title: "Lorem",
        id: 7,
      },
      {
        title: "Lorem",
        id: 8,
      },
      {
        title: "Lorem",
        id: 9,
      },
      {
        title: "Lorem",
        id: 10,
      },
      {
        title: "Lorem",
        id: 11,
      },
    ],
  },
};
