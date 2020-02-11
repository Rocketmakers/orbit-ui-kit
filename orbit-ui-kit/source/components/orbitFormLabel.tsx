import * as React from "react";
import { ClassHelpers } from "@rocketmakers/armstrong";

interface IProps {
  className?: string;
  label: string;
  htmlFor?: string;
  mandatory?: boolean;
}

export const OrbitFormLabel: React.FC<IProps> = ({ label, mandatory, children, className, htmlFor }) => {
  return (
    <div className={ClassHelpers.classNames(`orbit-form-input`, className)}>
      <label htmlFor={htmlFor}>
        {label}
        {!!mandatory && <span className="fg-negative">*</span>}
      </label>
      {children}
    </div>
  );
};
