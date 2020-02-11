import * as React from "react";
import { IButtonProps, Button, ClassHelpers } from "@rocketmakers/armstrong";

interface IProps extends IButtonProps {
  big?: boolean;
  displayMode?: "positive" | "negative";
  invert?: boolean;
  accent?: boolean;
}

export const OrbitButton: React.FC<IProps> = ({ big, displayMode, className, invert, accent, children, ...buttonProps }) => {
  const attributes = React.useMemo<Partial<IButtonProps>>(
    () => ({
      ...(big ? { "data-big": true } : {}),
      ...(displayMode ? { "data-display-mode": displayMode } : {}),
      ...(!children ? { "data-has-text": false } : {}),
      ...(invert ? { "data-invert": true } : {}),
      ...(accent ? { "data-accent": true } : {})
    }),
    [big, displayMode, children, invert, accent]
  );

  return (
    <Button className={ClassHelpers.classNames("orbit-btn", className)} {...buttonProps} {...attributes}>
      {children}
    </Button>
  );
};
