import type { Meta, StoryObj } from "@storybook/react";
import { ArticlesNav } from "../app/components/ArticlesNav/Menu.tsx";

const meta = {
  title: "Components/ArticlesNav",
  component: ArticlesNav,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ArticlesNav>;
export default meta;
type Story = StoryObj<typeof ArticlesNav>;
export const Default: Story = {
  args: {
    articles: [
      {
        title: "Introduction to AI safety",
        id: 0,
        dropdown: [],
        isHeader: true,
      },
      {
        title: "Consciousness",
        id: 1,
        dropdown: [
          {
            title: "lorem",
            id: 100,
          },
        ],
      },
      {
        title: "Strategy",
        id: 2,
        dropdown: [
          {
            title: "ipsum",
            id: 200,
          },
        ],
      },
      {
        title: "Current solution attempts",
        id: 3,
        dropdown: [
          {
            title: "dolorem",
            id: 400,
          },
        ],
      },
      {
        title: "Technical misalignment",
        id: 5,
        dropdown: null,
      },
      {
        title: "AGI capabilities",
        id: 6,
        dropdown: [],
      },
      {
        title: "Types of risks",
        id: 7,
        dropdown: null,
      },
      {
        title: "Timelines",
        id: 8,
        dropdown: [
          {
            title: "set",
            id: 800,
          },
        ],
      },
      {
        title: "Takeoff & intelligence explosion",
        id: 9,
      },
      {
        title: "Types of AI",
        id: 10,
      },
      {
        title: "Introduction to machine learning",
        id: 11,
      },
    ],
  },
};
