import * as React from "react";
import { OrbitView, OrbitGroup, useOrbitToast } from "../../../../source";
import { Button } from "@rocketmakers/armstrong";

export const HooksView: React.FC = () => {
  const { sendError, sendErrors, sendInfo, sendOK, sendWarning } = useOrbitToast();
  return (
    <OrbitView mode="form">
      <h1>Hooks</h1>
      <h3>Custom toast</h3>
      <OrbitGroup label="Methods">
        <Button onClick={() => sendOK("this is OK")}>sendOK</Button>
        <Button onClick={() => sendInfo("this is info")}>sendInfo</Button>
        <Button onClick={() => sendWarning("this is warning")}>sendWarning</Button>
        <Button onClick={() => sendError("this is error")}>sendError</Button>
        <Button onClick={() => sendErrors(["this is error 1", "this is error 2"])}>sendErrors</Button>
      </OrbitGroup>
      <OrbitGroup label="Code example">
        {`const { sendOK } = useOrbitToast();`}
        <br />
        <br />
        {`sendOK("this is OK")`}
      </OrbitGroup>
    </OrbitView>
  );
};
