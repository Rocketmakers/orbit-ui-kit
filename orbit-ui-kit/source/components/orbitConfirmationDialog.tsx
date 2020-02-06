import * as React from "react";
import { Button, IDialogProviderProps } from "@rocketmakers/armstrong";

export const OrbitConfirmationDialog: React.FC<IDialogProviderProps<boolean, JSX.Element | string | number>> = ({
  close,
  choose,
  argument
}) => {
  return (
    <div>
      <h3>ARE YOU SURE?</h3>
      {argument && <div>{argument}</div>}
      <div className="dialog-buttons">
        <Button onClick={() => choose(true)}>Yes</Button>
        <Button onClick={close}>No</Button>
      </div>
    </div>
  );
};
