import React from "react";
import { CopyIcon } from "../../../../stampyReact/stampy-ui/src/assets/Copy.tsx";

export interface CopyProps {
  /**
   * OnClick function for the component
   */
  onClick: () => void;
}

export const Copy = ({ onClick }: CopyProps) => {
  return (
    <div
      className={"copy"}
      style={{ height: "24px", width: "25px" }}
      onClick={onClick}
    >
      <CopyIcon />
    </div>
  );
};
