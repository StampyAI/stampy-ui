import React from "react";

import "./tag.css";

export interface TagProps {
  /**
   * Children of the component
   */
  children: string;
}
export const Tag = ({ children }: TagProps) => {
  return (
    <div className={"tags-tag"}>
      <div className={"tags-label"}>{children}</div>
    </div>
  );
};
