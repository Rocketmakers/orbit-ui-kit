import * as React from "react";
import { OrbitView, OrbitGroup, OrbitSpinner } from "../../../../source";

export const SpinnerView: React.FC = () => {
  return (
    <OrbitView mode="form">
      <h1>Spinner</h1>
      <OrbitGroup label="Spinner">
        <OrbitSpinner />
      </OrbitGroup>
    </OrbitView>
  );
};
