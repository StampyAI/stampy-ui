import React from "react";
import "./pageSubheaderText.css";

interface PageSubheaderTextProps {
  /**
   * Text to display in subheader of page
   */
  text: string;
}
export const PageSubheaderText = ({ text }: PageSubheaderTextProps) => {
  return <div className={"container-page-subtitle"}>{text}</div>;
};
