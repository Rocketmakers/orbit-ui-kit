import * as React from "react";
import { ClassHelpers, IcomoonIcon } from "@rocketmakers/armstrong";

interface IProps {
  className?: string;
}

export const OrbitSpinner: React.FC<IProps> = ({ className }) => {
  return (
    <div className={ClassHelpers.classNames("spinner", className)}>
      <IcomoonIcon iconName="spinner2" />
    </div>
  );
};
