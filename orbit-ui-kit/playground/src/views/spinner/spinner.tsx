import * as React from "react";
import { OrbitView, OrbitGroup, OrbitSpinner } from "../../../../source";

export const SpinnerView: React.FC = () => {
  return (
    <OrbitView mode="form">
      <h1>Spinner</h1>
      <OrbitGroup label="Default">
        <OrbitSpinner />
      </OrbitGroup>
      <OrbitGroup label="Fill">
        <OrbitSpinner fill={true} />
      </OrbitGroup>
    </OrbitView>
  );
};
