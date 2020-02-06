import * as React from "react";
import { OrbitView, OrbitGroup, OrbitConfirmationDialog } from "../../../../source";
import { useDialogProvider, Button } from "@rocketmakers/armstrong";

export const DialogsView: React.FC = () => {
  const open = useDialogProvider(OrbitConfirmationDialog);
  return (
    <OrbitView mode="form">
      <h1>Dialogs</h1>
      <OrbitGroup label="Basic confirmation dialog">
        <Button onClick={() => open()}>Open</Button>
      </OrbitGroup>
      <OrbitGroup label="Confirmation dialog with text content">
        <Button onClick={() => open("Some text content")}>Open</Button>
      </OrbitGroup>
      <OrbitGroup label="Confirmation dialog with jsx">
        <Button
          onClick={() =>
            open(
              <div>
                <h1>Hello</h1>
                <em>this is some cool jsx</em>
                <br />
                <br />
                <br />
              </div>
            )
          }
        >
          Open
        </Button>
      </OrbitGroup>
      <OrbitGroup label="Code example">
        const open = useDialogProvider(OrbitConfirmationDialog);
        <br />
        <br />
        open("Some text content")
      </OrbitGroup>
    </OrbitView>
  );
};
