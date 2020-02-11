import * as React from "react";
import { OrbitView, OrbitGroup, OrbitHiddenField, OrbitFormLabel } from "../../../../source";
import { TextInput } from "@rocketmakers/armstrong";

export const GroupView: React.FC = () => {
  return (
    <OrbitView mode="form">
      <h1>Group</h1>
      <OrbitGroup label="Hello">
        <p>This is some text</p>
      </OrbitGroup>
      <OrbitGroup label="Hello">
        <div>
          <label>Nested text</label>
          <p>This is some nested text</p>
        </div>
        <div>
          <label>More nested text</label>
          <p>This is some more nested text</p>
        </div>
      </OrbitGroup>
      <OrbitGroup label="With icon" icon={"weatherRain"}>
        This label has an icon
      </OrbitGroup>
      <OrbitGroup label="Hidden field in group">
        <OrbitHiddenField value="peekaboo" />
      </OrbitGroup>
      <OrbitGroup label="Code example">
        <pre>
          {`<OrbitGroup label="Text">`}
          <br />
          {`<p>This is some text</p>`}
          <br />
          {`</OrbitGroup>`}
        </pre>
      </OrbitGroup>
    </OrbitView>
  );
};
