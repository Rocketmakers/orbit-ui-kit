import * as React from "react";
import { OrbitView, OrbitGroup, useOrbitToast, useOrbitDirtyDialog } from "../../../../source";
import { Button, useForm, TextInput } from "@rocketmakers/armstrong";

const initialData = { text: "" };
export const HooksView: React.FC = () => {
  const { sendError, sendErrors, sendInfo, sendOK, sendWarning } = useOrbitToast();

  const { DataForm, bind, dataBinder } = useForm(initialData);
  const { DirtyPrompt, resetDirtyPrompt } = useOrbitDirtyDialog(dataBinder);
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
        <pre>
          {`const { sendOK } = useOrbitToast();`}
          <br />
          <br />
          {`sendOK("this is OK")`}
        </pre>
      </OrbitGroup>
      <h3>Dirty dialog</h3>
      <OrbitGroup label="Dirty dialog">
        <DataForm>
          <TextInput {...bind.text("text")} placeholder="Type something then change route" />
          <Button onClick={resetDirtyPrompt}>Reset dirty dialog</Button>
          <DirtyPrompt />
        </DataForm>
      </OrbitGroup>
      <OrbitGroup label="Code example">
        <pre>
          {`const { DataForm, bind, dataBinder } = useForm(initialData);`}
          <br />
          <br />
          {`const { DirtyPrompt, resetDirtyPrompt } = useOrbitDirtyDialog(dataBinder);`}
          <br />
          <br />
          {`<DirtyPrompt />`}
        </pre>
      </OrbitGroup>
    </OrbitView>
  );
};
