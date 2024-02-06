import { FunctionComponent, useCallback } from "react";
import "./group.css";
import { navigate } from "@storybook/addon-links";

interface GridBoxProps {
  /**
   * Title
   */
  title: string;
  /**
   * Description
   */
  description: string;
  /**
   * Icon
   */
  icon: string;
  /**
   * URL
   */
  url: string;
}
export const GridBox: FunctionComponent = ({
  title,
  description,
  icon,
  url,
}: GridBoxProps) => {
  const onGroupContainerClick = useCallback(() => {
    // Add your code here
  }, [url]);

  return (
    <div className={"grid-container-group"} onClick={onGroupContainerClick}>
      <div className={"cardBg"}>
        <div className={"grid-rectangle"} />
      </div>
      <div className={"grid-title"}>{title}</div>
      <div className={"grid-description"}>{description}</div>
      <img className={"grid-icon"} alt="" src={icon} />
    </div>
  );
};
