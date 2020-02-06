import * as React from "react";
import { Button, Icon, Spinner, useDidUpdateEffect } from "@rocketmakers/armstrong";
import { OrbitIcons } from "../utils/orbitIcons";

interface IProps {
  readOnlyValue: string | JSX.Element;
  onSubmit?: (data?: any) => void;
  label: string;
  children: JSX.Element;
  pending?: boolean;
}
export const OrbitEditable: React.FC<IProps> = ({ children, onSubmit, readOnlyValue, label, pending }) => {
  const [editMode, setEditMode] = React.useState(false);

  useDidUpdateEffect(() => {
    if (!pending) {
      setEditMode(false);
    }
  }, [pending]);

  return (
    <div className="orbit-editable">
      <div className="info">
        <label>{label}</label>
        <div className="actions">
          {pending && <Spinner />}
          <Button disabled={pending} data-danger={editMode} onClick={() => setEditMode(!editMode)}>
            <Icon icon={editMode ? OrbitIcons.cross : OrbitIcons.edit} />
          </Button>
          {editMode && (
            <Button disabled={pending} data-success={true} onClick={onSubmit}>
              <Icon icon={OrbitIcons.tick} />
            </Button>
          )}
        </div>
      </div>
      {editMode ? children : readOnlyValue}
    </div>
  );
};
