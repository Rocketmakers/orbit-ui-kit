import * as React from "react";
import { ClassHelpers, IcomoonIcon } from "@rocketmakers/armstrong";

interface IProps {
  className?: string;
  simple?: boolean;
  fill?: boolean;
}

export const OrbitSpinner: React.FC<IProps> = ({ className, fill, simple = true }) => {
  return (
    <div className={ClassHelpers.classNames("orbit-spinner", className)} data-fill={fill}>
      {simple ? <IcomoonIcon iconName="spinner2" /> : <IcomoonIcon iconName="spinner2" />}
    </div>
  );
};
