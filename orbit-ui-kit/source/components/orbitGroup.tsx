import * as React from "react";
import { ClassHelpers, IconName, IcomoonIcon, Tooltip } from "@rocketmakers/armstrong";

interface IProps {
  label?: string;
  htmlFor?: string;
  className?: string;
  icon?: IconName<"Icomoon">;
  inline?: boolean;
  info?: string | JSX.Element;
}

export const OrbitGroup: React.FC<IProps> = ({ children, label, htmlFor, className, icon, inline, info }) => {
  return (
    <div className={ClassHelpers.classNames("orbit-group", className)} data-inline={inline}>
      {label && (
        <label htmlFor={htmlFor} className="group-label">
          {icon && <IcomoonIcon iconName={icon} />}
          {label}
        </label>
      )}
      {children}
      {info && (
        <Tooltip tooltip={info} wrapperAttributes={{ className: "info" }} position={"top"}>
          <IcomoonIcon iconName="info" />
        </Tooltip>
      )}
    </div>
  );
};
