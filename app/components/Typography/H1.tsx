import React from "react";
import "./h1.css";
export interface h1Props {
  /**
   * Children of the component
   */
  children: string;
}
export interface h1Props {
  /**
   * Children of the component
   */
  children: string;
}
export const H1 = ({ children }: h1Props) => {
  return <h1 className={"h1"}>{children}</h1>;
};
