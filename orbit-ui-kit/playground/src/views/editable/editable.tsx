import * as React from "react";
import { OrbitView, OrbitGroup, OrbitHiddenField, OrbitEditable, useOrbitToast } from "../../../../source";
import { TextInput } from "@rocketmakers/armstrong";

export const EditableView: React.FC = () => {
  const { sendOK } = useOrbitToast();
  return (
    <OrbitView mode="form">
      <h1>Editable</h1>
      <OrbitEditable readOnlyValue="Some random value" label="Editable input" onSubmit={() => sendOK("Noice")}>
        <TextInput value="Some random value" />
      </OrbitEditable>
      <OrbitEditable
        readOnlyValue={
          <div>
            <div>
              <label>key 1</label>
              <p>Value 1</p>
            </div>
            <div>
              <label>key 2</label>
              <p>Value 2</p>
            </div>
          </div>
        }
        label="Editable input"
        onSubmit={() => sendOK("Noice")}
      >
        <div>
          <div>
            <label>key 1</label>
            <TextInput value="value 1" />
          </div>
          <div>
            <label>key 2</label>
            <TextInput value="value 2" />
          </div>
        </div>
      </OrbitEditable>
      <OrbitGroup label="Code example">
        <pre>
          {`<OrbitEditable`} <br />
          {`readOnlyValue="Some random value"`}
          <br />
          {`label="Editable input"`}
          <br />
          {`onSubmit={() => sendOK("Noice")}>`}
          <br />
          {`<TextInput value="Some random value" />`}
          <br />
          {`</OrbitEditable>`}
        </pre>
      </OrbitGroup>
    </OrbitView>
  );
};
