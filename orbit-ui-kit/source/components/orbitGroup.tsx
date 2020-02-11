import * as React from "react";
import { ClassHelpers, IconName, IcomoonIcon } from "@rocketmakers/armstrong";

interface IProps {
  label?: string;
  htmlFor?: string;
  className?: string;
  icon?: IconName<"Icomoon">;
}

export const OrbitGroup: React.FC<IProps> = ({ children, label, htmlFor, className, icon }) => {
  return (
    <div className={ClassHelpers.classNames("orbit-group", className)}>
      {label && (
        <label htmlFor={htmlFor} className="group-label">
          {icon && <IcomoonIcon iconName={icon} />}
          {label}
        </label>
      )}
      {children}
    </div>
  );
};
