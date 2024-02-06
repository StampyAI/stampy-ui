import React, { FunctionComponent } from "react";
import "./menu.css";
import { act } from "react-dom/test-utils";
interface Category {
  title: string;
  id: number;
}
interface CategoriesNavProps {
  /**
   * Articles List
   */
  categories: Category[];
  /**
   * Selected article
   */
  active: 0;
  /**
   * Callback function to handle click on article
   */
  onClick?: () => void;
}

export const CategoriesNav = ({
  categories,
  active,
  onclick,
}: CategoriesNavProps) => {
  const [selected, setSelected] = React.useState(active || 0);

  const handleClick = (index) => {
    setSelected(index);
    if (onclick) {
      onclick(index);
    }
  };

  return (
    <div className={"categories-group"}>
      <div className={"category-autoLayoutHorizontal"}>
        <div className={"category-nav-title"}>Categories</div>
      </div>
      {categories.map((category) => {
        return (
          <div
            key={`category-${category.id}`}
            className={[
              "category-autoLayoutHorizontal",
              selected == category.id ? ["active"].join(" ") : "",
            ].join(" ")}
            onClick={() => handleClick(category.id)}
          >
            <div className={"category-title"}>{category.title}</div>
          </div>
        );
      })}
    </div>
  );
};
