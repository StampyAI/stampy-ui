import React from "react";
import "./menuItem.css";

interface MenuItemProps {
  /**
   * Link url
   */
  link: string;
  /**
   * Provide icon src to display heading img
   */
  icon?: React.ReactNode | string;
  /**
   * Link text
   */
  text: string;
  /**
   * Is this the primary class of Menu link?
   */
  primary?: boolean;
}
export const MenuItem = ({
  primary = false,
  link,
  icon,
  text,
  onMouseEnter,
  onMouseLeave,
}: MenuItemProps) => {
  return (
    <li
      className="top-menu-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <a href={link} className="top-menu-link">
        {icon ? (
          typeof icon === "string" ? (
            <img
              loading="lazy"
              src={icon}
              className="top-menu-icon"
              alt={text}
            />
          ) : (
            icon
          )
        ) : null}

        <span
          className={["top-menu-text", primary ? "" : "secondary"].join(" ")}
        >
          {text}
        </span>
      </a>
    </li>
  );
};
