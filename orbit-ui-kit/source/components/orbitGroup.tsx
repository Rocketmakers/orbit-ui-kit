import * as React from "react";
import { ClassHelpers } from "@rocketmakers/armstrong";

interface IProps {
  label?: string;
  htmlFor?: string;
  className?: string;
}

export const OrbitGroup: React.FC<IProps> = ({ children, label, htmlFor, className }) => {
  return (
    <div className={ClassHelpers.classNames("orbit-group", className)}>
      {label && (
        <label htmlFor={htmlFor} className="group-label">
          {label}
        </label>
      )}
      {children}
    </div>
  );
};
