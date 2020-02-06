import * as React from "react";
import { ClassHelpers } from "@rocketmakers/armstrong";

interface IProps {
  mode?: "full-width" | "form";
  className?: string;
}

export const OrbitView: React.FC<IProps> = ({ children, mode, className }) => {
  return (
    <div className={ClassHelpers.classNames("orbit-view", className)} data-mode={mode}>
      {children}
    </div>
  );
};
