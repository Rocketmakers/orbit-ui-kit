import * as React from "react";
import { OrbitHiddenField, OrbitView, OrbitGroup } from "../../../../source";

export const HiddenFieldView: React.FC = () => {
  return (
    <OrbitView mode="form">
      <h1>Hidden Field</h1>
      <OrbitHiddenField value={"this is a hidden field"} hiddenLength={10} />
      <OrbitGroup label="Code example">{`<OrbitHiddenField value={"this is a hidden field"} />`}</OrbitGroup>
    </OrbitView>
  );
};
