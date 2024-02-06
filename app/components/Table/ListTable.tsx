import { FunctionComponent } from "react";
import "./listTable.css";

export interface ListTableProps {
  /**
   * Browse by category
   */
  Elements: Record<string, string>;
}

export const ListTable: FunctionComponent = ({ Elements }: ListTableProps) => {

  return (
    <div className={"table-list"}>
      {Object.keys(Elements).map((key, i) => {
        return (
          <a key={`entry-${i}`} className={"table-entry"} href={Elements[key].pageid}>
            {Elements[key].title}
          </a>
        );
      })}
    </div>
  );
};
