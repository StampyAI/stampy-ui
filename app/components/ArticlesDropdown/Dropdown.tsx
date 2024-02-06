import { FunctionComponent } from "react";
import "./dropdown.css";
export interface ArticlesDropdownProps {
  /**
   * Introductory sections
   */
  IntroductorySections: Record<string, string>;
  /**
   * Advanced sections
   */
  AdvancedSections: Record<string, string>;
  /**
   * Browse by category
   */
  BrowseByCategory: Record<string, string>;
  /**
   * Browse all categories
   */
  BrowseAllCategories: string;
  /**
   * Sticky state
   */
  isSticky: boolean;
  /**
   * Mouse enter event
   */
  MouseEnter: () => void;
  /**
   * Mouse leave event
   */
  MouseLeave: () => void;
}
export const ArticlesDropdown: FunctionComponent = ({
  IntroductorySections,
  AdvancedSections,
  BrowseByCategory,
  BrowseAllCategories,
  isSticky,
  MouseEnter,
  MouseLeave,
}: ArticlesDropdownProps) => {
  return (
    <div
      className={"articles-dropdown-container"}
      onMouseEnter={MouseEnter}
      onMouseLeave={MouseLeave}
      style={{ display: isSticky ? "flex" : "none" }}
    >
      <div className={"articles-dropdown-grid"}>
        <div className={"articles-dropdown-title"}>Introductory sections</div>

        {Object.keys(IntroductorySections).map((key, i) => {
          return (
            <a
              key={`article-${i}`}
              className={"articles-dropdown-entry"}
              href={IntroductorySections[key]}
            >
              {key}
            </a>
          );
        })}

        <div
          className={["articles-dropdown-title", "top-margin-large"].join(" ")}
        >
          Advanced sections
        </div>

        {Object.keys(AdvancedSections).map((key, i) => {
          return (
            <a
              key={`article-${i}`}
              className={"articles-dropdown-entry"}
              href={AdvancedSections[key]}
            >
              {key}
            </a>
          );
        })}
      </div>

      <div className={"articles-dropdown-grid"}>
        {/*sorted right side*/}
        <div className={"articles-dropdown-title"}>Browse by category</div>

        {Object.keys(BrowseByCategory).map((key, i) => {
          return (
            <a
              key={`article-${i}`}
              className={"articles-dropdown-teal-entry"}
              href={BrowseByCategory[key]}
            >
              {key}
            </a>
          );
        })}

        <div className={"dropdown-button"}>
          <a href={BrowseAllCategories} className={"dropdown-button-label"}>
            Browse all categories
          </a>
        </div>
      </div>
    </div>
  );
};
