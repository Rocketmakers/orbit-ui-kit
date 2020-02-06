import * as React from "react";
import { OrbitView, OrbitGroup } from "../../../../source";
import "./view.scss";
export const ViewView: React.FC = () => {
  return (
    <OrbitView className="orbit-views" mode="full-width">
      <h1>Views</h1>
      <OrbitView>
        <div className="page-content">default</div>
      </OrbitView>
      <OrbitView mode="form">
        <div className="page-content">form (max width 800px)</div>
      </OrbitView>
      <OrbitView mode="full-width">
        <div className="page-content">full-width</div>
      </OrbitView>
    </OrbitView>
  );
};
