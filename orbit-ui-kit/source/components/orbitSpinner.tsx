import * as React from "react";
import { ClassHelpers, IcomoonIcon } from "@rocketmakers/armstrong";

interface IProps {
  className?: string;
  display?: "simple" | "full";
  fill?: boolean;
}

export const OrbitSpinner: React.FC<IProps> = ({ className, fill, display = "simple" }) => {
  return (
    <div className={ClassHelpers.classNames("orbit-spinner", className)} data-fill={fill}>
      {display === "simple" ? <IcomoonIcon iconName="spinner2" /> : <IcomoonIcon iconName="spinner2" />}
    </div>
  );
};
