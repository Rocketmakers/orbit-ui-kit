import * as React from "react";
import { Icon } from "@rocketmakers/armstrong";
import { OrbitIcons } from "../utils/orbitIcons";

interface IProps {
  breadcrumb: IBreadcrumb[];
}

export interface IBreadcrumb {
  onRoute?: () => void;
  label: string;
}

export const Breadcrumb: React.FC<IProps> = ({ breadcrumb }) => {
  return (
    <div className="breadcrumb">
      {breadcrumb.map((crumb, i) => (
        <React.Fragment key={i}>
          {crumb.onRoute ? (
            <span className="link" onClick={crumb.onRoute}>
              {crumb.label}
            </span>
          ) : (
            <span>{crumb.label}</span>
          )}
          {i !== breadcrumb.length - 1 ? <Icon icon={OrbitIcons.right} /> : ""}
        </React.Fragment>
      ))}
    </div>
  );
};
