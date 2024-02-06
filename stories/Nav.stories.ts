import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "../app/components/Nav/Nav";

const meta = {
  title: "Components/Nav",
  component: NavBar,
  tags: ["autodocs"],
} satisfies Meta<typeof NavBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    IntroductorySections: {
      "Introduction to AI Safety": "/introduction-to-ai-safety",
      "Frequent questions guide": "/frequent-questions-guide",
      "Get involved with AI Safety": "/get-involved-with-ai-safety",
    },
    AdvancedSections: {
      Governance: "/governance",
      "Predictions on advanced AI": "/predictions-on-advanced-ai",
      "Technical alignment research categories":
        "/technical-alignment-research-categories",
      "Existential risk concepts": "/existential-risk-concepts",
      "Prominent research organizations": "/prominent-research-organizations",
    },
    BrowseByCategory: {
      Definitions: "/definitions",
      Objections: "/objections",
      Superintelligence: "/superintelligence",
      Contributing: "/contributing",
      "Existential risk": "/existential-risk",
      Catastrophe: "/catastrophe",
      "Research agendas": "/research-agendas",
      Governance: "/governance",
      Resources: "/resources",
      Capabilities: "/capabilities",
      "Machine learning": "/machine-learning",
      AGI: "/agi",
    },
    BrowseAllCategories: "/browse-all-categories",
  },
};
