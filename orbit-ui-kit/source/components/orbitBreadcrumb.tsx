import * as React from "react";
import { Icon, ClassHelpers } from "@rocketmakers/armstrong";
import { OrbitIcons } from "../utils/orbitIcons";
import { Link } from "react-router-dom";

interface IProps {
  breadcrumb: IBreadcrumb[];
  className?: string;
}

export interface IBreadcrumb {
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  label: string;
}

export const OrbitBreadcrumb: React.FC<IProps> = ({ breadcrumb, className }) => {
  return (
    <div className={ClassHelpers.classNames("orbit-breadcrumb", className)}>
      {breadcrumb.map((crumb, i) => (
        <React.Fragment key={i}>
          {crumb.to || crumb.onClick ? (
            <Link className="link" to={crumb.to} onClick={crumb.onClick}>
              {crumb.label}
            </Link>
          ) : (
            <span>{crumb.label}</span>
          )}
          {i !== breadcrumb.length - 1 ? <Icon icon={OrbitIcons.right} /> : ""}
        </React.Fragment>
      ))}
    </div>
  );
};
