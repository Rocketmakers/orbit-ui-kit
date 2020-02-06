import * as React from "react";
import { Icon } from "@rocketmakers/armstrong";

interface IProps {
  value: string | number | JSX.Element;
  hiddenLength?: number;
}
export const OrbitHiddenField: React.FC<IProps> = ({ value, hiddenLength = 6 }) => {
  const [hidden, setHidden] = React.useState(true);

  return (
    <div className="hidden-field" onClick={() => setHidden(!hidden)}>
      <div className="value">{hidden ? "●".repeat(hiddenLength) : value}</div>
      <Icon icon={hidden ? Icon.Icomoon.eye : Icon.Icomoon.eyeBlocked} />
    </div>
  );
};
