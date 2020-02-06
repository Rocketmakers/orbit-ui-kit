import * as React from "react";
import { OrbitView, OrbitGroup, OrbitHiddenField } from "../../../../source";

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
      <OrbitGroup label="Hidden field in group">
        <OrbitHiddenField value="peekaboo" />
      </OrbitGroup>
      <OrbitGroup label="Code example">
        {`<OrbitGroup label="Text">
        <p>This is some text</p>
      </OrbitGroup>`}
      </OrbitGroup>
    </OrbitView>
  );
};
