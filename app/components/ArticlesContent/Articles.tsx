import React from "react";
import { H1 } from "../Typography/H1";
import { Paragraph } from "../Typography/Paragraph";
import { CopyIcon } from "../../../../stampyReact/stampy-ui/src/assets/Copy.tsx";
import { Tag } from "../Tags/Tag";
import "./articles.css";
const mapInteractiveOptionsIcon = {
  copy: <CopyIcon />,
  Edit: "edit",
  Audio: "audio",
};
export interface ArticleProps {
  /**
   * Title of the article
   */
  title: string;
  /**
   * Description of the article
   */
  description: string;
  /**
   * Image of the article
   */
  /**
   * tags of the article
   */
  tags: string[];
  /**
   * Last updated date of the article
   */
  lastUpdated: string;
  /**
   * Interactive Options
   */
  interactiveOptions: string[];
  /**
   * Time to read the articles
   */
  timeToRead: string;
}
// possible interactive options: "Copy", "Edit", "Audio".

export const Article: React.FC<ArticleProps> = ({
  title,
  description,
  tags,
  lastUpdated,
  timeToRead,
  interactiveOptions,
}: ArticleProps) => {
  return (
    <div className={"article-container"}>
      <H1>{title}</H1>
      <div className={"article-meta"}>
        <Paragraph>{timeToRead}</Paragraph>

        <div className={"article-interactive-options"}>
          {interactiveOptions.map((option) => {
            return (
              <div className={"interactive-option"}>
                {mapInteractiveOptionsIcon[option]}
              </div>
            );
          })}
        </div>
      </div>

      <div className={"article-description"}>{description}</div>
      <div className={"article-tags"}>
        {tags.map((tag) => {
          return <Tag>{tag}</Tag>;
        })}
      </div>
      <div className={"article-last-updated"}>{lastUpdated}</div>
    </div>
  );
};
