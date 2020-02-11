import * as React from "react";
import { OrbitTabbedView, OrbitView } from "../../../../source";

export const TabsView: React.FC = () => {
  return (
    <>
      <OrbitView>
        <h1>Tabbed view</h1>
      </OrbitView>
      <OrbitTabbedView
        tabs={[
          { component: () => <OrbitView>this is the first tab</OrbitView>, name: "Tab 1", to: "tab1", icon: "weatherRain" },
          { component: () => <OrbitView>second tab</OrbitView>, name: "Tab 2", to: "tab2", icon: "wrench3" },
          { component: () => <OrbitView>wow... its the third tab</OrbitView>, name: "Tab 3", to: "tab3", icon: "wink" }
        ]}
      />
    </>
  );
};
